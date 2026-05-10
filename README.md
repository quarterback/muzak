# Music sIT

A Y2K / web-1.0 indie-music discovery & collab platform. Tiles, marquees,
beveled buttons, real artists in real cities, deep-linked tip jars.

## Try it locally

```sh
# any static server works
python3 -m http.server 8080
# then open http://localhost:8080
```

## What's in the box

- `index.html` — page shell + all CSS (mobile-responsive at 1024 / 768 / 480)
- `app.js` — single-file vanilla app: hash routing, state in localStorage,
  signup flow, d3 + topojson scene map, event delegation, embeds,
  tip-jar deep links
- `manifest.webmanifest` + `icon.svg` + `icon-maskable.svg` — PWA install
  metadata with launch shortcuts
- `sw.js` — service worker (offline shell + asset caching)
- `db/schema.sql` — Postgres / Supabase schema for when you're ready to
  graduate from localStorage to a shared backend
- `AUTH.md` — sketch of the OAuth + AT Protocol auth integration

## The full demo flow

1. First visit lands on **welcome** — pick a demo account or click
   **+ create profile**.
2. Signup form collects: handle, role (listener / artist), city, links,
   payment handles, and (if artist) a first-track stream URL.
3. Submit → if you're an artist and pasted a Bandcamp / SoundCloud /
   Mixcloud / YouTube / Spotify URL, the track is published immediately
   and you land on your fresh profile page with the **embed playing
   inline** as a real iframe player.
4. From there: save tracks, follow artists, post to the collab board,
   tip (deep-links to artists' Venmo / Cash App / PayPal / Stripe — money
   never touches the site).
5. Switch users any time via the **★ tweaks** drawer (bottom-right) →
   "switch user". Log out turns you back into a guest.

Everything is in `localStorage`, so the demo is fully usable end-to-end
on a single device with zero backend.

## Deploy to Vercel (or Netlify)

The site is pure static, no build step.

```sh
npx vercel deploy            # first run prompts to log in + create a project
# or
netlify deploy --dir .
```

Vercel will spin up a preview URL in ~10 seconds. Once it looks right:

```sh
npx vercel deploy --prod
```

That's the whole deploy. d3 + topojson load from unpkg; the service
worker only registers under HTTPS, which Vercel/Netlify give you for free.

## Connecting a database (it's not automatic)

Vercel hosts static files — it won't touch a database for you. The
prototype today is **localStorage-only**, so each visitor sees their own
copy. To make profiles, tracks, follows, etc. shared across devices and
users, you need to swap localStorage for a real backend. Recommended path:

### 1. Create a Supabase project (free tier)

- Go to <https://supabase.com>, create a project. Copy the **Project URL**
  and **anon (public) key** from Settings → API.

### 2. Run the schema

- In the Supabase dashboard → SQL Editor → paste the contents of
  `db/schema.sql` and run. This creates the tables, RLS policies,
  triggers, and a small seed of demo profiles. The seed block is bracketed
  with `-- ▼▼▼ SEED DATA — remove before production ▼▼▼` so it's easy to
  delete when you're ready to launch with real artists only.

### 3. Add env vars in Vercel

Vercel project → Settings → Environment Variables:

| Key                    | Value                       | Scope                   |
|------------------------|-----------------------------|-------------------------|
| `SUPABASE_URL`         | your project URL            | Production + Preview    |
| `SUPABASE_ANON_KEY`    | the anon key (it's public)  | Production + Preview    |

For pure static sites these aren't injected at build — you'll need to
either use a small build step (a `<script>` tag that reads from
`window.SUPABASE_*` populated by `vercel build`) or just paste the values
directly into a small `config.js` you commit (anon keys are safe to
publish since they only allow what RLS lets through).

### 4. Wire the client

Replace the `localStorage` reads/writes in `app.js` with the Supabase JS
client (`@supabase/supabase-js` from a CDN — no bundler needed):

```html
<script type="module">
  import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
  window.sb = createClient(window.SUPABASE_URL, window.SUPABASE_ANON_KEY);
</script>
```

Then swap functions like `state.tracks` reads for `await sb.from('tracks').select()`,
inserts go through `sb.from('tracks').insert(...)`. The schema names match
the in-memory shape, so it's mostly a search-and-replace job. RLS is on,
so the anon key only lets users read public rows and modify their own.

### 5. Auth (when you're ready)

See `AUTH.md` for both the standard OAuth path (Google / GitHub via
Supabase Auth) and the AT Protocol (Bluesky) path. The schema already has
`atproto_did` and `atproto_handle` columns on `profiles` for linking
identities.

## Replacing demo content with real artists

Right now the front-end ships with seed profiles (saltvane, mira_moss,
Königswasser, etc.) so the homepage isn't empty on first visit. Two ways
to swap them out:

### Quick: hide them in the UI

In the **★ tweaks** drawer → uncheck **"show demo content"**. Every seed
row gets `_demo: true` on load; flipping the toggle filters them
everywhere they're listed. New profiles you create are not flagged, so
your real content stays.

### Proper: replace the seed

`SEED` near the top of `app.js` is the source. Edit the `profiles`,
`tracks`, `collabs`, and `scenes` to match the artists you actually want
featured. Or, if you've moved to Supabase, just clear the seed block from
`db/schema.sql` and let real signups populate the tables.

## Mobile / PWA

Responsive down to phone widths (1024 / 768 / 480 breakpoints). On iOS /
Android, **Add to Home Screen** installs it as a standalone app with the
Y2K theme color and four launch shortcuts (Crate Digs / Collab Board /
Scene Map / Create Profile). Safe-area insets are respected when running
standalone. Service worker requires HTTPS — Vercel and Netlify both
handle that automatically.
