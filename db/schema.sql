-- Music sIT — Postgres / Supabase schema
-- Run this in the Supabase SQL editor or via `supabase db push`.
-- Design choice: artist-side fields are folded into `profiles` (role flips
-- to 'artist'); a separate `artists` table would duplicate ownership
-- semantics already provided by auth.users without buying us anything.

create extension if not exists pgcrypto;
create extension if not exists citext;

-- ---------- shared trigger: touch updated_at ----------
create or replace function public.tg_touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

-- =====================================================================
-- profiles
-- =====================================================================
create table public.profiles (
  id              uuid primary key references auth.users(id) on delete cascade,
  handle          citext unique not null,
  display_name    text,
  bio             text,
  city            text,
  country         text,
  lat             double precision,
  lng             double precision,
  flag_emoji      text,
  role            text not null default 'listener'
                    check (role in ('listener','artist')),
  taste           jsonb not null default '{}'::jsonb,
  i_offer         text[] not null default '{}',
  i_need          text[] not null default '{}',
  prefs           jsonb not null default '{}'::jsonb,
  atproto_did     text  unique,
  atproto_handle  citext unique,
  payment_handles jsonb not null default '{}'::jsonb,
  bandcamp_url    text,
  soundcloud_url  text,
  website_url     text,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);
create trigger profiles_touch before update on public.profiles
  for each row execute function public.tg_touch_updated_at();

create index profiles_role_idx on public.profiles (role);
create index profiles_city_idx on public.profiles (city);
create index profiles_country_idx on public.profiles (country);

alter table public.profiles enable row level security;

create policy "profiles read all"  on public.profiles for select using (true);
create policy "profiles insert self" on public.profiles for insert
  with check (auth.uid() = id);
create policy "profiles update self" on public.profiles for update
  using (auth.uid() = id) with check (auth.uid() = id);

-- Auto-create a profiles row when a new auth.users row appears.
-- Handle is provisional (`user_<8>`); user can rename later.
create or replace function public.tg_handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, handle, display_name, atproto_did, atproto_handle)
  values (
    new.id,
    coalesce(
      new.raw_user_meta_data->>'handle',
      'user_' || substr(replace(new.id::text,'-',''),1,8)
    ),
    new.raw_user_meta_data->>'display_name',
    new.raw_user_meta_data->>'atproto_did',
    nullif(new.raw_user_meta_data->>'atproto_handle','')::citext
  )
  on conflict (id) do nothing;
  return new;
end $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.tg_handle_new_user();

-- =====================================================================
-- tracks
-- =====================================================================
create table public.tracks (
  id            uuid primary key default gen_random_uuid(),
  artist_id     uuid not null references public.profiles(id) on delete cascade,
  title         text not null,
  genre         text,
  tags          text[] not null default '{}',
  embed_kind    text not null check (embed_kind in
                  ('bandcamp','soundcloud','youtube','mixcloud','spotify','external')),
  embed_url     text not null,
  cover_art_url text,
  note          text,
  price_label   text,
  open_to       text[] not null default '{}',
  published_at  timestamptz,
  play_count    int not null default 0,
  save_count    int not null default 0,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);
create trigger tracks_touch before update on public.tracks
  for each row execute function public.tg_touch_updated_at();

create index tracks_artist_published_idx
  on public.tracks (artist_id, published_at desc);
create index tracks_published_idx
  on public.tracks (published_at desc) where published_at is not null;
create index tracks_tags_gin on public.tracks using gin (tags);
create index tracks_genre_idx on public.tracks (genre);

alter table public.tracks enable row level security;

create policy "tracks read published"
  on public.tracks for select
  using (published_at is not null or auth.uid() = artist_id);

create policy "tracks insert own"
  on public.tracks for insert
  with check (
    auth.uid() = artist_id
    and exists (select 1 from public.profiles p
                where p.id = auth.uid() and p.role = 'artist')
  );

create policy "tracks update own" on public.tracks for update
  using (auth.uid() = artist_id) with check (auth.uid() = artist_id);
create policy "tracks delete own" on public.tracks for delete
  using (auth.uid() = artist_id);

-- =====================================================================
-- track_plays  (append-only analytics log)
-- =====================================================================
create table public.track_plays (
  id          bigserial primary key,
  track_id    uuid not null references public.tracks(id) on delete cascade,
  listener_id uuid references public.profiles(id) on delete set null,
  at          timestamptz not null default now(),
  country     text
);
create index track_plays_track_at_idx on public.track_plays (track_id, at desc);
create index track_plays_at_idx on public.track_plays (at desc);

alter table public.track_plays enable row level security;

-- Anonymous plays allowed; aggregate-only reads via a view (below).
create policy "plays insert anyone" on public.track_plays for insert
  with check (listener_id is null or listener_id = auth.uid());
create policy "plays read own" on public.track_plays for select
  using (listener_id = auth.uid());

-- =====================================================================
-- track_saves
-- =====================================================================
create table public.track_saves (
  profile_id uuid not null references public.profiles(id) on delete cascade,
  track_id   uuid not null references public.tracks(id) on delete cascade,
  at         timestamptz not null default now(),
  primary key (profile_id, track_id)
);
create index track_saves_track_idx on public.track_saves (track_id);

alter table public.track_saves enable row level security;
create policy "saves read all"   on public.track_saves for select using (true);
create policy "saves insert self" on public.track_saves for insert
  with check (auth.uid() = profile_id);
create policy "saves delete self" on public.track_saves for delete
  using (auth.uid() = profile_id);

create or replace function public.tg_track_saves_count()
returns trigger language plpgsql as $$
begin
  if (tg_op = 'INSERT') then
    update public.tracks set save_count = save_count + 1 where id = new.track_id;
  elsif (tg_op = 'DELETE') then
    update public.tracks set save_count = greatest(save_count - 1, 0) where id = old.track_id;
  end if;
  return null;
end $$;
create trigger track_saves_count_aiu
  after insert or delete on public.track_saves
  for each row execute function public.tg_track_saves_count();

-- =====================================================================
-- follows
-- =====================================================================
create table public.follows (
  follower_id uuid not null references public.profiles(id) on delete cascade,
  artist_id   uuid not null references public.profiles(id) on delete cascade,
  at          timestamptz not null default now(),
  primary key (follower_id, artist_id),
  check (follower_id <> artist_id)
);
create index follows_artist_idx on public.follows (artist_id);

alter table public.follows enable row level security;
create policy "follows read all"   on public.follows for select using (true);
create policy "follows insert self" on public.follows for insert
  with check (auth.uid() = follower_id);
create policy "follows delete self" on public.follows for delete
  using (auth.uid() = follower_id);

-- =====================================================================
-- collab_posts + collab_replies
-- =====================================================================
create table public.collab_posts (
  id          uuid primary key default gen_random_uuid(),
  author_id   uuid not null references public.profiles(id) on delete cascade,
  kind        text check (kind in
                ('vocalist','producer','visual','band','remix','writer','other')),
  title       text not null,
  body        text not null,
  open_until  date,
  reply_count int not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
create trigger collab_posts_touch before update on public.collab_posts
  for each row execute function public.tg_touch_updated_at();
create index collab_posts_created_idx on public.collab_posts (created_at desc);
create index collab_posts_kind_idx on public.collab_posts (kind);

alter table public.collab_posts enable row level security;
create policy "collab_posts read all" on public.collab_posts for select using (true);
create policy "collab_posts insert own" on public.collab_posts for insert
  with check (auth.uid() = author_id);
create policy "collab_posts update own" on public.collab_posts for update
  using (auth.uid() = author_id) with check (auth.uid() = author_id);
create policy "collab_posts delete own" on public.collab_posts for delete
  using (auth.uid() = author_id);

create table public.collab_replies (
  id         uuid primary key default gen_random_uuid(),
  post_id    uuid not null references public.collab_posts(id) on delete cascade,
  author_id  uuid not null references public.profiles(id) on delete cascade,
  body       text not null,
  created_at timestamptz not null default now()
);
create index collab_replies_post_idx on public.collab_replies (post_id, created_at);

alter table public.collab_replies enable row level security;
create policy "collab_replies read all" on public.collab_replies for select using (true);
create policy "collab_replies insert own" on public.collab_replies for insert
  with check (auth.uid() = author_id);
create policy "collab_replies delete own" on public.collab_replies for delete
  using (auth.uid() = author_id);

create or replace function public.tg_collab_replies_count()
returns trigger language plpgsql as $$
begin
  if (tg_op = 'INSERT') then
    update public.collab_posts set reply_count = reply_count + 1 where id = new.post_id;
  elsif (tg_op = 'DELETE') then
    update public.collab_posts set reply_count = greatest(reply_count - 1, 0) where id = old.post_id;
  end if;
  return null;
end $$;
create trigger collab_replies_count_aid
  after insert or delete on public.collab_replies
  for each row execute function public.tg_collab_replies_count();

-- =====================================================================
-- guestbook
-- =====================================================================
create table public.guestbook (
  id         uuid primary key default gen_random_uuid(),
  author_id  uuid not null references public.profiles(id) on delete cascade,
  body       text not null check (char_length(body) <= 1000),
  created_at timestamptz not null default now()
);
create index guestbook_created_idx on public.guestbook (created_at desc);
create index guestbook_author_created_idx on public.guestbook (author_id, created_at desc);

alter table public.guestbook enable row level security;
create policy "guestbook read all" on public.guestbook for select using (true);

-- rate-limit policy: 5 inserts/hr/author
create policy "guestbook insert self ratelimited" on public.guestbook for insert
  with check (
    auth.uid() = author_id
    and (
      select count(*) from public.guestbook g
      where g.author_id = auth.uid()
        and g.created_at > now() - interval '1 hour'
    ) < 5
  );

create policy "guestbook delete own" on public.guestbook for delete
  using (auth.uid() = author_id);

-- =====================================================================
-- tips_log  (NOT money flow — clicks only; real money goes via
-- artists' pasted payment handles)
-- =====================================================================
create table public.tips_log (
  id                bigserial primary key,
  from_profile_id   uuid references public.profiles(id) on delete set null,
  to_profile_id     uuid not null references public.profiles(id) on delete cascade,
  suggested_amount_cents int,
  payment_method    text,
  at                timestamptz not null default now()
);
create index tips_log_to_at_idx on public.tips_log (to_profile_id, at desc);
create index tips_log_at_idx on public.tips_log (at desc);

alter table public.tips_log enable row level security;
create policy "tips insert authed" on public.tips_log for insert
  with check (
    auth.role() = 'authenticated'
    and (from_profile_id is null or from_profile_id = auth.uid())
  );
-- individual rows hidden; expose aggregates via view below
create policy "tips read own outgoing" on public.tips_log for select
  using (from_profile_id = auth.uid() or to_profile_id = auth.uid());

create or replace view public.tips_weekly as
  select to_profile_id,
         sum(coalesce(suggested_amount_cents, 0))::bigint as cents_total,
         count(*)::int as click_count
  from public.tips_log
  where at > now() - interval '7 days'
  group by to_profile_id;
grant select on public.tips_weekly to anon, authenticated;

-- =====================================================================
-- sessions_atproto
-- =====================================================================
create table public.sessions_atproto (
  profile_id uuid primary key references public.profiles(id) on delete cascade,
  session    jsonb not null,
  updated_at timestamptz not null default now()
);
create trigger sessions_atproto_touch before update on public.sessions_atproto
  for each row execute function public.tg_touch_updated_at();

alter table public.sessions_atproto enable row level security;
create policy "atproto sessions owner only"
  on public.sessions_atproto for all
  using (auth.uid() = profile_id) with check (auth.uid() = profile_id);

-- =====================================================================
-- scenes  (view; refresh on demand)
-- Source: profiles where role='artist', grouped by city/country.
-- "Growth" = artists added in the last 30 days vs prior 30.
-- =====================================================================
create or replace view public.scenes as
  select
    coalesce(city,'Unknown')   as city,
    coalesce(country,'')        as country,
    avg(lat)                    as lat,
    avg(lng)                    as lng,
    count(*) filter (where role = 'artist')                     as artist_count,
    count(*) filter (where role = 'artist'
                       and created_at > now() - interval '30 days')   as artists_30d,
    count(*) filter (where role = 'artist'
                       and created_at between now() - interval '60 days'
                                          and now() - interval '30 days') as artists_prev_30d
  from public.profiles
  where city is not null
  group by city, country;
grant select on public.scenes to anon, authenticated;

-- =====================================================================
-- realtime publication (optional, for live guestbook / collab board)
-- =====================================================================
-- alter publication supabase_realtime add table public.guestbook,
--   public.collab_posts, public.collab_replies, public.tracks;

-- =====================================================================
-- ▼▼▼ SEED DATA — remove before production ▼▼▼
-- Bypass the auth.users FK so the homepage isn't empty on first deploy.
-- Replace these UUIDs with real auth.users ids once people sign up.
-- =====================================================================
begin;
alter table public.profiles drop constraint profiles_id_fkey;

insert into public.profiles
  (id, handle, display_name, bio, city, country, flag_emoji, role,
   taste, i_offer, bandcamp_url)
values
  ('11111111-1111-1111-1111-111111111111','saltvane','saltvane',
   'crunchy 4-track loops from the kitchen table',
   'Porto','PT','PT','artist',
   '{"lo-fi":0.9,"ambient":0.6,"tape":0.8}'::jsonb,
   array['mixing','master tapes'],
   'https://saltvane.bandcamp.com'),
  ('22222222-2222-2222-2222-222222222222','konigswasser','Königswasser',
   'corroded synths, slow bloom',
   'Leipzig','DE','DE','artist',
   '{"drone":0.9,"industrial":0.7,"experimental":0.8}'::jsonb,
   array['modular','field recording'],
   'https://konigswasser.bandcamp.com'),
  ('33333333-3333-3333-3333-333333333333','mira_moss','mira moss',
   'bedroom folk, voice + guitar + tape hiss',
   'Lagos','NG','NG','artist',
   '{"folk":0.9,"bedroom":0.8,"voice":0.7}'::jsonb,
   array['lyrics','harmony'],
   'https://miramoss.bandcamp.com');

alter table public.profiles
  add constraint profiles_id_fkey
  foreign key (id) references auth.users(id) on delete cascade
  not valid;
commit;

insert into public.tracks
  (artist_id, title, genre, tags, embed_kind, embed_url, note, price_label,
   open_to, published_at)
values
  ('11111111-1111-1111-1111-111111111111',
   'kettle, then morning', 'lo-fi',
   array['lo-fi','tape','loops'],
   'bandcamp',
   'https://bandcamp.com/EmbeddedPlayer/track=1/size=large/',
   '4-track loops','name your price',
   array['remix','vocal'],
   now()),
  ('22222222-2222-2222-2222-222222222222',
   'oxide bloom', 'drone',
   array['drone','modular'],
   'soundcloud',
   'https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/1',
   'corroded synth study','$5+',
   array['remix','visual'],
   now()),
  ('33333333-3333-3333-3333-333333333333',
   'small room song', 'folk',
   array['bedroom','folk','voice'],
   'youtube',
   'https://www.youtube.com/embed/dQw4w9WgXcQ',
   'voice + guitar + hiss','₦500+',
   array['drums','harmony'],
   now());
-- ▲▲▲ END SEED DATA ▲▲▲
