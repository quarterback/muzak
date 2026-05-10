# Put Me On — Auth & Deployment

Two login paths share one Supabase `auth.users` table. Every signed-in user has exactly one row in `public.profiles` (created by trigger).

## 1. Login paths

### A. Supabase OAuth (Google / GitHub) — the simple path

One nav link: "sign in with Google" / "sign in with GitHub". The Supabase JS client handles the redirect dance:

```js
supabase.auth.signInWithOAuth({ provider: 'google',
  options: { redirectTo: location.origin + '/auth/callback' } })
```

Supabase creates the `auth.users` row; the `on_auth_user_created` trigger upserts `public.profiles`. Done.

### B. atproto / Bluesky — `@atproto/oauth-client-browser`

User types `alice.bsky.social`. The SDK resolves their PDS, redirects there for consent, comes back with a session blob. We then **mint a Supabase JWT** (approach (a) in the brief — keeps RLS simple by giving every user a single `auth.uid()`):

1. Browser receives the atproto session.
2. Browser POSTs the session to Edge Function `mint-atproto-session`.
3. Function verifies the session against the user's PDS, looks up `profiles.atproto_did`. If found, signs a JWT for that `auth.users.id`. If not, creates a new anonymous `auth.users` row with `raw_user_meta_data = { atproto_did, atproto_handle }` (the trigger fills `profiles`).
4. Browser calls `supabase.auth.setSession({ access_token, refresh_token })`. From here on, RLS works the same as path A.

Persist the atproto session blob in `public.sessions_atproto` so we can reattach without re-running consent.

## 2. Linking identities

A Supabase user that signed in via Google can later link Bluesky from settings: run path B's flow while already signed in, then `update profiles set atproto_did = $1, atproto_handle = $2 where id = auth.uid()`. Reverse direction works the same. The `unique` constraint on `atproto_did` prevents double-binding.

## 3. Required files

### `client-metadata.json` (served at site root, public)

The file's URL **must equal** the `client_id` value — PDSes fetch it to verify your client.

```json
{
  "client_id": "https://putmeon.lol/client-metadata.json",
  "client_name": "Put Me On",
  "client_uri": "https://putmeon.lol",
  "redirect_uris": ["https://putmeon.lol/auth/atproto/callback"],
  "grant_types": ["authorization_code", "refresh_token"],
  "response_types": ["code"],
  "scope": "atproto transition:generic",
  "token_endpoint_auth_method": "none",
  "application_type": "web",
  "dpop_bound_access_tokens": true
}
```

### Env vars

```bash
SUPABASE_URL=https://xxxx.supabase.co
SUPABASE_ANON_KEY=eyJ...        # public, ship in client
SUPABASE_SERVICE_ROLE_KEY=eyJ... # server-only; Edge Function secret
```

## 4. Deployment

- **Static site** → `vercel deploy` (or drag the folder to Netlify). No build step needed.
- **Database** → Supabase free tier; paste `db/schema.sql` into the SQL editor, or `supabase db push`.
- **Edge Function** `mint-atproto-session` (one file, ~60 lines): verifies the atproto session blob against the issuing PDS, finds-or-creates the matching `auth.users` row using the service role key, returns a freshly signed Supabase JWT pair. Deploy with `supabase functions deploy mint-atproto-session`.

## 5. Security gotchas

- RLS is on for every table. **Only ever use the anon key client-side**; the service role key bypasses RLS and must live in Edge Function secrets.
- Always verify atproto sessions **server-side** (in the Edge Function) before minting a Supabase JWT. The browser is untrusted.
- atproto DPoP keys must stay in **IndexedDB**, not localStorage. The SDK does this by default — don't override its storage adapter.
- Strip the seed block at the bottom of `schema.sql` before going to production (it temporarily drops the `auth.users` FK).
