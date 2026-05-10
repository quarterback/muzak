# Music sIT

A Y2K / web-1.0 indie-music discovery & collab platform. Tiles, marquees,
beveled buttons, real artists in real cities, deep-linked tip jars.

## Try it locally

```sh
# any static server works
python3 -m http.server 8080
# then open http://localhost:8080
```

## Deploy

Drop the folder on Vercel or Netlify — it's pure static (HTML/CSS/JS).

```sh
npx vercel deploy
# or
netlify deploy --dir .
```

No build step. No environment variables for the demo. The d3 and topojson
libraries are loaded from unpkg.

## What's in the box

- `index.html` — page shell + all CSS (mobile-responsive, 768/480 breakpoints)
- `app.js` — single-file vanilla app: hash routing, state in localStorage,
  d3 + topojson scene map, event delegation, tip-jar deep links
- `manifest.webmanifest` + `icon.svg` + `icon-maskable.svg` — PWA install
  metadata; supports "Add to Home Screen" with app shortcuts to digs /
  collab / map / guestbook
- `sw.js` — service worker: precaches the shell, cache-first for assets,
  stale-while-revalidate for d3/topojson, network-first for the world
  atlas. The site keeps working offline once visited.
- `db/schema.sql` — Postgres / Supabase schema for when you're ready to
  graduate from localStorage to a real backend (matches the in-memory shape)
- `AUTH.md` — sketch of the OAuth + AT Protocol auth integration

## Mobile / PWA

Responsive down to phone widths. On iOS / Android, "Add to Home Screen" gives
you a standalone app with the Y2K theme color and four launch shortcuts
(Crate Digs / Collab Board / Scene Map / Sign Guestbook). Safe-area insets
respected when running standalone. Service worker requires HTTPS — Vercel
and Netlify both handle that automatically.

## Demo / fully working

Everything persists in `localStorage`, so the prototype is end-to-end usable
without any backend:

- Edit your profile (`#/me`) — handle, bio, city, payment handles
- Become an artist → upload page unlocks
- Paste a Bandcamp / SoundCloud / YouTube / Mixcloud / Spotify URL — it
  embeds inline as a real iframe player
- Save tracks, follow artists, post to the collab board, sign the guestbook
- Tip → opens a modal, picks a payment method, deep-links to the artist's
  Venmo / Cash App / PayPal / Stripe (money never touches the site)
- Switch between demo accounts in the **★ tweaks** drawer (bottom-right)
- "reset all data" in tweaks or the profile page wipes localStorage

## Y2K skins

Tweaks drawer → theme: bubblegum · cassette · hacker · sunset.

## Going beyond the demo

`db/schema.sql` is a drop-in Supabase schema with RLS. `AUTH.md` covers
swapping localStorage for the Supabase JS client and adding OAuth +
AT Protocol login. Until you do that, every visitor sees their own copy.
