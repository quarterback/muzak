/* Music sIT — vanilla JS app, localStorage-backed.
   No build step. Loads d3 + topojson from CDN (see index.html).
   All persisted data lives under STORAGE_KEY in localStorage.
*/

const STORAGE_KEY = "musicSIT_v1";

/* ── seed data ─────────────────────────────────────────────────────────── */
const SEED = {
  // profiles keyed by handle. you = "tape_tooth" by default.
  profiles: {
    tape_tooth: {
      handle: "tape_tooth",
      role: "listener",
      display_name: "Tape Tooth",
      bio: "crate digger, mostly slow stuff. trying to get back into mixing.",
      city: "Brooklyn", country: "US", flag: "🇺🇸", lat: 40.7, lng: -74.0,
      taste: { ambient:.82, melodic:.71, slow:.68, vocal:.55, glitch:.34, club:.22, dense:.18, warm:.74 },
      i_offer: ["mix","drums","cover-art"],
      i_need:  ["vocal","feature"],
      i_am: "producer / mixer",
      prefs: { sizeMax: 500, near: 5000, languages:["en","any"] },
      payment_handles: {},
      bandcamp_url: "", soundcloud_url: "", website_url: "",
      atproto_handle: "",
      created_at: Date.now() - 1000*60*60*24*60,
    },
    saltvane: {
      handle: "saltvane", role: "artist", display_name: "saltvane",
      bio: "4-track loops out of a back porch in Oakland. tape hiss is a feature.",
      city: "Oakland", country: "US", flag: "🇺🇸", lat: 37.8, lng: -122.3,
      taste: { ambient:1, tape:1, slow:1, diy:1, melodic:.5, warm:.6 },
      i_offer: ["mix","master"], i_need: ["vocal","cover-art"],
      i_am: "tape musician",
      payment_handles: { venmo:"@saltvane", paypal:"saltvane@example.com" },
      bandcamp_url: "https://saltvane.bandcamp.com",
      created_at: Date.now() - 1000*60*60*24*120,
    },
    konigswasser: {
      handle: "konigswasser", role: "artist", display_name: "Königswasser",
      bio: "glitch & breaks. new EP friday.",
      city: "Leipzig", country: "DE", flag: "🇩🇪", lat: 51.3, lng: 12.4,
      taste: { glitch:1, breaks:1, club:1, dense:1 },
      i_offer: ["drums","remix"], i_need: ["vocal"], i_am: "producer",
      payment_handles: { paypal:"k@example.de" },
      bandcamp_url: "https://konigswasser.bandcamp.com",
      created_at: Date.now() - 1000*60*60*24*200,
    },
    bus_shelter: {
      handle: "bus_shelter", role: "artist", display_name: "the bus shelter",
      bio: "first upload. folk / shoegaze. recorded in a flat in Glasgow.",
      city: "Glasgow", country: "UK", flag: "🇬🇧", lat: 55.9, lng: -4.2,
      taste: { folk:1, shoegaze:1, slow:1, melodic:1 },
      i_offer: ["guitar"], i_need: ["bass","synth"], i_am: "songwriter",
      payment_handles: { cashapp:"$busshelter" },
      created_at: Date.now() - 1000*60*60*24*14,
    },
    mira_moss: {
      handle: "mira_moss", role: "artist", display_name: "mira moss",
      bio: "art-pop from Montréal. open to swap a master for cover art.",
      city: "Montréal", country: "CA", flag: "🇨🇦", lat: 45.5, lng: -73.5,
      taste: { "art-pop":1, melodic:1, vocal:1, warm:1 },
      i_offer: ["vocal","master"], i_need: ["cover-art","mix"], i_am: "songwriter",
      payment_handles: { venmo:"@miramoss", paypal:"mira@example.ca" },
      bandcamp_url: "https://miramoss.bandcamp.com",
      created_at: Date.now() - 1000*60*60*24*300,
    },
    goodroom: {
      handle: "goodroom", role: "artist", display_name: "goodroom",
      bio: "alté / r&b. single dropped last week.",
      city: "Lagos", country: "NG", flag: "🇳🇬", lat: 6.5, lng: 3.4,
      taste: { "alté":1, "r&b":1, warm:1, melodic:1 },
      i_offer: ["vocal"], i_need: ["feature","remix"], i_am: "vocalist",
      payment_handles: {}, created_at: Date.now() - 1000*60*60*24*90,
    },
    pobox17: {
      handle: "pobox17", role: "artist", display_name: "P.O. BOX 17",
      bio: "drone & vox. cassette only.",
      city: "Reykjavík", country: "IS", flag: "🇮🇸", lat: 64.1, lng: -21.9,
      taste: { drone:1, ambient:1, vocal:1, slow:1 },
      i_offer: ["vocal"], i_need: ["split-tape"], i_am: "drone musician",
      payment_handles: {}, created_at: Date.now() - 1000*60*60*24*45,
    },
    chrome_plum: {
      handle: "chrome_plum", role: "artist", display_name: "chrome plum",
      bio: "hyper-bedroom. stems are up — turn in a remix, get on the b-side.",
      city: "Manila", country: "PH", flag: "🇵🇭", lat: 14.6, lng: 121.0,
      taste: { hyperpop:1, bedroom:1, dense:1, vocal:1 },
      i_offer: ["vocal","beats"], i_need: ["remix"], i_am: "producer / vocalist",
      payment_handles: { paypal:"chrome@example.ph" },
      created_at: Date.now() - 1000*60*60*24*180,
    },
    hannah_woods: {
      handle: "hannah_woods", role: "artist", display_name: "hannah of the woods",
      bio: "appalachian electro. split tape with saltvane on the way.",
      city: "Asheville", country: "US", flag: "🇺🇸", lat: 35.6, lng: -82.5,
      taste: { folk:1, electro:1, slow:1, melodic:1 },
      i_offer: ["vocal"], i_need: ["split-tape"], i_am: "songwriter",
      payment_handles: {}, created_at: Date.now() - 1000*60*60*24*60,
    },
    low_orbit_lab: {
      handle: "low_orbit_lab", role: "artist", display_name: "low orbit lab",
      bio: "club / ambient. live set saturday.",
      city: "Kyoto", country: "JP", flag: "🇯🇵", lat: 35.0, lng: 135.7,
      taste: { ambient:1, club:1, slow:1, warm:1 },
      i_offer: ["mix"], i_need: ["feature","vocal"], i_am: "producer",
      payment_handles: { paypal:"low@example.jp" },
      created_at: Date.now() - 1000*60*60*24*150,
    },
  },

  // tracks. embed_url is a real URL the iframe loads.
  // For seeded demo content we use real Bandcamp embeds for two real free
  // releases (so first-time visitors can actually press play and hear something);
  // the rest are placeholder embeds that the artist would replace with real URLs.
  tracks: [
    { id: "t1", artist_handle: "saltvane",     title: "kelp room",
      embed_kind: "bandcamp",
      embed_url: "https://bandcamp.com/EmbeddedPlayer/album=2287956043/size=large/bgcol=181a1b/linkcol=056cc4/tracklist=false/transparent=true/",
      cover_art: "art1", note: "4-track loops",
      genre: "ambient / tape", tags: ["ambient","tape","slow","diy"],
      price_label: "name your price", open_to: ["remix","vocal"],
      published_at: Date.now() - 1000*60*60*24*7 },
    { id: "t2", artist_handle: "konigswasser", title: "glitchforest 04",
      embed_kind: "soundcloud",
      embed_url: "https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/293&color=%2300ff88&inverse=true&auto_play=false&show_user=true",
      cover_art: "art2", note: "new EP friday",
      genre: "glitch breaks", tags: ["glitch","breaks","club","dense"],
      price_label: "€3+", open_to: ["drums","remix"],
      published_at: Date.now() - 1000*60*60*5 },
    { id: "t3", artist_handle: "bus_shelter",  title: "north wall",
      embed_kind: "external", embed_url: "",
      cover_art: "art3", note: "first upload",
      genre: "folk / shoegaze", tags: ["folk","shoegaze","slow","melodic"],
      price_label: "free dl", open_to: ["bass","synth"],
      published_at: Date.now() - 1000*60*60*24*3 },
    { id: "t4", artist_handle: "mira_moss",    title: "brittle / soft",
      embed_kind: "bandcamp", embed_url: "",
      cover_art: "art4", note: "open to collab",
      genre: "art-pop", tags: ["art-pop","melodic","vocal","warm"],
      price_label: "$5+", open_to: ["cover-art","mix"],
      published_at: Date.now() - 1000*60*60*24*30 },
    { id: "t5", artist_handle: "goodroom",     title: "second sun",
      embed_kind: "youtube", embed_url: "https://www.youtube.com/embed/jfKfPfyJRdk",
      cover_art: "art5", note: "single dropped",
      genre: "alté / r&b", tags: ["alté","r&b","warm","melodic"],
      price_label: "₦500+", open_to: ["feature","remix"],
      published_at: Date.now() - 1000*60*60*24*10 },
    { id: "t6", artist_handle: "pobox17",      title: "vapor at six",
      embed_kind: "bandcamp", embed_url: "",
      cover_art: "art6", note: "cassette only",
      genre: "drone / vox", tags: ["drone","ambient","vocal","slow"],
      price_label: "$12 cassette", open_to: ["split-tape"],
      published_at: Date.now() - 1000*60*60*24*40 },
    { id: "t7", artist_handle: "chrome_plum",  title: "fluorescent gum",
      embed_kind: "soundcloud", embed_url: "",
      cover_art: "art7", note: "remix stems up",
      genre: "hyper-bedroom", tags: ["hyperpop","bedroom","dense","vocal"],
      price_label: "PWYW", open_to: ["remix","vocal"],
      published_at: Date.now() - 1000*60*60*24*5 },
    { id: "t8", artist_handle: "hannah_woods", title: "creek mix",
      embed_kind: "external", embed_url: "",
      cover_art: "art8", note: "split w/ saltvane",
      genre: "appalachian electro", tags: ["folk","electro","slow","melodic"],
      price_label: "$3+", open_to: ["split-tape","vocal"],
      published_at: Date.now() - 1000*60*60*24*20 },
    { id: "t9", artist_handle: "low_orbit_lab", title: "kyoto 03:14",
      embed_kind: "youtube", embed_url: "https://www.youtube.com/embed/5qap5aO4i9A",
      cover_art: "art9", note: "live set sat",
      genre: "club / ambient", tags: ["ambient","club","slow","warm"],
      price_label: "¥500+", open_to: ["feature","mix"],
      published_at: Date.now() - 1000*60*60*24*60 },
  ],

  collabs: [
    { id:"c1", author:"saltvane", kind:"vocalist", title:"need a hushed vocal for ambient track",
      body:"have a 4 minute drone in C, looking for spoken word or whisper-y vox. will trade for mixing, or split bandcamp 50/50.",
      replies: 3, created_at: Date.now() - 1000*60*60*24*2 },
    { id:"c2", author:"konigswasser", kind:"producer", title:"drum programmer wanted (160bpm+ breaks)",
      body:"finishing a glitch EP, two tracks need real breakbeat surgery. you keep co-write + tip jar share. send refs.",
      replies: 7, created_at: Date.now() - 1000*60*60*5 },
    { id:"c3", author:"mira_moss", kind:"visual", title:"album cover trade — i'll master your EP",
      body:"if you're a collage / risograph / pixel artist and want a free master, my next album needs a cover. happy to swap.",
      replies: 11, created_at: Date.now() - 1000*60*60*8 },
    { id:"c4", author:"bus_shelter", kind:"band", title:"shoegaze trio looking for a 4th",
      body:"glasgow-ish, can you play synth or bass and rehearse twice a month? we have shows booked into autumn.",
      replies: 5, created_at: Date.now() - 1000*60*60*24*7 },
    { id:"c5", author:"chrome_plum", kind:"remix", title:"stems open: remix me, get featured",
      body:"posting full multi-tracks. anyone who turns in a remix gets a slot on the b-side comp. all genres welcome.",
      replies: 14, created_at: Date.now() - 1000*60*60*24*3 },
    { id:"c6", author:"low_orbit_lab", kind:"writer", title:"need lyrics in any language not english",
      body:"have an instrumental looking for a top-line. preferably non-english. revenue split, credit, the works.",
      replies: 2, created_at: Date.now() - 1000*60*60*24*6 },
  ],

  follows: [ {follower:"tape_tooth", artist:"saltvane"}, {follower:"tape_tooth", artist:"mira_moss"} ],
  saves:   [ {profile:"tape_tooth", track:"t1"}, {profile:"tape_tooth", track:"t4"} ],
  // tip clicks logged for the leaderboard (no money flow).
  tips:    [
    {from:"tape_tooth", to:"mira_moss", amount:5,  at: Date.now() - 1000*60*60*24},
    {from:"tape_tooth", to:"saltvane",  amount:3,  at: Date.now() - 1000*60*60*24*3},
    {from:"poolboy",    to:"chrome_plum", amount:10, at: Date.now() - 1000*60*60*24*7},
  ],

  scenes: [
    { name:"Oakland",     lat:37.8, lng:-122.3, artists:12, growth:18 },
    { name:"Los Angeles", lat:34.0, lng:-118.2, artists:22, growth:17 },
    { name:"Asheville",   lat:35.6, lng:-82.5,  artists:3,  growth:6  },
    { name:"NYC",         lat:40.7, lng:-74.0,  artists:28, growth:19 },
    { name:"Chicago",     lat:41.9, lng:-87.6,  artists:14, growth:12 },
    { name:"Atlanta",     lat:33.7, lng:-84.4,  artists:11, growth:21 },
    { name:"Toronto",     lat:43.7, lng:-79.4,  artists:11, growth:13 },
    { name:"Montréal",    lat:45.5, lng:-73.5,  artists:7,  growth:9  },
    { name:"Mexico City", lat:19.4, lng:-99.1,  artists:14, growth:31 },
    { name:"Bogotá",      lat:4.7,  lng:-74.1,  artists:6,  growth:21 },
    { name:"Lima",        lat:-12.0,lng:-77.0,  artists:5,  growth:12 },
    { name:"São Paulo",   lat:-23.5,lng:-46.6,  artists:18, growth:25 },
    { name:"Buenos Aires",lat:-34.6,lng:-58.4,  artists:9,  growth:13 },
    { name:"Reykjavík",   lat:64.1, lng:-21.9,  artists:2,  growth:5  },
    { name:"Glasgow",     lat:55.9, lng:-4.2,   artists:5,  growth:11 },
    { name:"London",      lat:51.5, lng:-0.1,   artists:31, growth:14 },
    { name:"Lisbon",      lat:38.7, lng:-9.1,   artists:8,  growth:19 },
    { name:"Barcelona",   lat:41.4, lng:2.1,    artists:9,  growth:14 },
    { name:"Paris",       lat:48.8, lng:2.3,    artists:13, growth:10 },
    { name:"Amsterdam",   lat:52.4, lng:4.9,    artists:7,  growth:8  },
    { name:"Berlin",      lat:52.5, lng:13.4,   artists:24, growth:22 },
    { name:"Leipzig",     lat:51.3, lng:12.4,   artists:8,  growth:34 },
    { name:"Warsaw",      lat:52.2, lng:21.0,   artists:6,  growth:14 },
    { name:"Istanbul",    lat:41.0, lng:28.9,   artists:6,  growth:14 },
    { name:"Cairo",       lat:30.0, lng:31.2,   artists:4,  growth:11 },
    { name:"Lagos",       lat:6.5,  lng:3.4,    artists:4,  growth:42 },
    { name:"Nairobi",     lat:-1.3, lng:36.8,   artists:5,  growth:33 },
    { name:"Cape Town",   lat:-33.9,lng:18.4,   artists:7,  growth:18 },
    { name:"Mumbai",      lat:19.1, lng:72.9,   artists:9,  growth:27 },
    { name:"Bangkok",     lat:13.7, lng:100.5,  artists:6,  growth:19 },
    { name:"Manila",      lat:14.6, lng:121.0,  artists:6,  growth:28 },
    { name:"Jakarta",     lat:-6.2, lng:106.8,  artists:8,  growth:23 },
    { name:"Seoul",       lat:37.6, lng:126.9,  artists:14, growth:20 },
    { name:"Tokyo",       lat:35.7, lng:139.7,  artists:18, growth:14 },
    { name:"Kyoto",       lat:35.0, lng:135.7,  artists:5,  growth:15 },
    { name:"Sydney",      lat:-33.9,lng:151.2,  artists:9,  growth:12 },
    { name:"Melbourne",   lat:-37.8,lng:145.0,  artists:10, growth:15 },
  ],

  current_user: null, // null = guest; set when a profile is created or chosen
  player: { track_id: null, playing: false },
  tweaks: { skin: "bubblegum", marquee: true, construction: true, sparkleCursor: false, showDemo: true },
};

const GENRES = [
  { group:"electronic",    color:"var(--cool)",  tags:["ambient","drone","glitch","breaks","club","techno","house","idm","hyperpop","vaporwave","footwork","jungle"] },
  { group:"acoustic",      color:"var(--rust)",  tags:["folk","indie-folk","acoustic","singer-songwriter","appalachian","chamber","strings"] },
  { group:"rock & guitar", color:"var(--hot)",   tags:["shoegaze","slowcore","post-rock","dream-pop","noise","punk","emo","math-rock"] },
  { group:"vocal-led",     color:"var(--lime)",  tags:["art-pop","r&b","alté","soul","choral","a-cappella","spoken-word"] },
  { group:"global",        color:"#6a00ff",      tags:["afrobeats","cumbia","reggaeton","baile","k-indie","j-indie","baltic-folk"] },
  { group:"experimental",  color:"#000",         tags:["musique-concrète","field-recording","tape","sound-art","improv"] },
  { group:"hip-hop & beats", color:"#ff8a00",    tags:["boom-bap","abstract-rap","lo-fi","beat-tape","jazz-rap","cloud"] },
  { group:"moods",         color:"var(--muted)", tags:["slow","warm","melodic","dense","bedroom","diy","vocal"] },
];

const TICKER_ITEMS = [
  ["★","NEW DROP", "saltvane — 'kelp room' just landed"],
  ["♪","NOW PLAYING", "Königswasser // glitchforest 04"],
  ["✿","COLLAB", "mira moss is looking for a cover artist"],
  ["★","TIP JAR", "$2,134 sent to artists this week"],
  ["♫","RADIO", "next up — chrome plum, manila"],
  ["☆","SCENE", "47 cities listening right now"],
  ["♥","FRIENDS", "12 of your subscriptions uploaded today"],
];

/* ── state ──────────────────────────────────────────────────────────────── */
// Tag every entry that originates from the SEED with _demo: true so the
// "show demo content" toggle in settings can hide them when you're ready
// to launch with real artists. User-created profiles/tracks/etc. don't get
// this flag, so they survive even when demo content is hidden.
function _tagSeed(seed){
  const s = structuredClone(seed);
  Object.values(s.profiles).forEach(p => p._demo = true);
  s.tracks.forEach(t  => t._demo = true);
  s.collabs.forEach(c => c._demo = true);
  s.follows.forEach(f => f._demo = true);
  s.saves.forEach(x   => x._demo = true);
  s.tips.forEach(x    => x._demo = true);
  return s;
}

function loadState(){
  const seeded = _tagSeed(SEED);
  try{
    const raw = localStorage.getItem(STORAGE_KEY);
    if(!raw) return seeded;
    const saved = JSON.parse(raw);
    return { ...seeded, ...saved,
      profiles: { ...seeded.profiles, ...(saved.profiles||{}) },
      tracks:    [...(saved.tracks   || seeded.tracks)],
      collabs:   [...(saved.collabs  || seeded.collabs)],
      follows:   [...(saved.follows  || seeded.follows)],
      saves:     [...(saved.saves    || seeded.saves)],
      tips:      [...(saved.tips     || seeded.tips)],
      scenes:    seeded.scenes,
      tweaks:    { ...seeded.tweaks, ...(saved.tweaks||{}) },
    };
  }catch(e){
    return seeded;
  }
}

// filter helpers — when showDemo is off, hide _demo:true rows
function shouldShowDemo(){ return state.tweaks?.showDemo !== false; }
function nonDemo(arr){ return arr.filter(x => !x._demo); }
function visibleProfiles(){
  const all = Object.values(state.profiles);
  return shouldShowDemo() ? all : all.filter(p => !p._demo);
}
function visibleTracks(){  return shouldShowDemo() ? state.tracks  : nonDemo(state.tracks);  }
function visibleCollabs(){ return shouldShowDemo() ? state.collabs : nonDemo(state.collabs); }
function saveState(){
  try{ localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }catch(e){}
}
let state = loadState();

function setPatch(patch){ state = { ...state, ...patch }; saveState(); render(); }
function update(fn){ fn(state); saveState(); render(); }

// Synthetic "you" for guests so recommendation math keeps working on artist
// pages (the only route guests can browse).
const GUEST_PROFILE = {
  handle: "guest", role: "listener", display_name: "guest",
  bio: "", city: "Brooklyn", country: "US", flag: "🇺🇸",
  lat: 40.7, lng: -74.0,
  taste: { ambient:.5, melodic:.5, slow:.5, warm:.5 },
  i_offer: [], i_need: [], i_am: "guest listener",
  prefs: { sizeMax: 500, near: 5000 },
  payment_handles: {}, created_at: Date.now(),
};
function isGuest(){ return !state.current_user || !state.profiles[state.current_user]; }
function me(){ return isGuest() ? GUEST_PROFILE : state.profiles[state.current_user]; }
function profileBy(handle){ return state.profiles[handle]; }
function trackBy(id){ return state.tracks.find(t=>t.id===id); }
function tracksByArtist(handle){ return state.tracks.filter(t=>t.artist_handle===handle); }
function isFollowing(artist){ return state.follows.some(f=>f.follower===state.current_user && f.artist===artist); }
function isSaved(track){ return state.saves.some(s=>s.profile===state.current_user && s.track===track); }
function saveCount(track){ return state.saves.filter(s=>s.track===track).length; }
function followerCount(artist){ return state.follows.filter(f=>f.artist===artist).length; }
function tipsToArtist(artist){ return state.tips.filter(t=>t.to===artist).reduce((s,t)=>s+t.amount,0); }
function tipsThisWeek(){
  const wk = Date.now() - 1000*60*60*24*7;
  return state.tips.filter(t=>t.at>=wk).reduce((s,t)=>s+t.amount, 0);
}

/* ── helpers ────────────────────────────────────────────────────────────── */
const esc = (s) => String(s==null?"":s)
  .replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;")
  .replaceAll('"',"&quot;").replaceAll("'","&#39;");

function tier(savesNum){
  if(savesNum<25)   return {key:"tiny",    label:"TINY",    cls:"tier-tiny",  loud:true};
  if(savesNum<100)  return {key:"small",   label:"SMALL",   cls:"tier-small", loud:true};
  if(savesNum<500)  return {key:"growing", label:"GROWING", cls:"tier-grow",  loud:true};
  return            {key:"steady",  label:"",        cls:"tier-quiet", loud:false};
}
function haversineKm(a, b){
  const R=6371, t=x=>x*Math.PI/180;
  const dLat=t(b.lat-a.lat), dLng=t(b.lng-a.lng);
  const s=Math.sin(dLat/2)**2 + Math.cos(t(a.lat))*Math.cos(t(b.lat))*Math.sin(dLng/2)**2;
  return Math.round(2*R*Math.asin(Math.sqrt(s)));
}
function scoreArtist(artist, you){
  const tracksA = tracksByArtist(artist.handle);
  const tags = new Set(tracksA.flatMap(t=>t.tags||[]));
  let taste=0, n=0;
  for(const tag of tags){ taste += (you.taste[tag]||0); n++; }
  taste = n ? taste/n : 0;
  const saves = tracksA.reduce((s,t)=>s+saveCount(t.id),0) || followerCount(artist.handle);
  const sizeFit = saves <= (you.prefs?.sizeMax||500) ? 1 : Math.max(0, 1 - (saves-(you.prefs?.sizeMax||500))/2000);
  const km = haversineKm(you, artist);
  const near = Math.max(0, 1 - km/((you.prefs?.near||5000)*4));
  return Math.round(taste*60 + sizeFit*20 + near*20);
}
function collabFit(post, you){
  const author = profileBy(post.author);
  if(!author) return 0;
  const offers = new Set(author.i_offer||[]);
  const need   = new Set(you.i_need||[]);
  const offer  = new Set(you.i_offer||[]);
  let s=0;
  for(const x of offer) if(need.has(x)) s+=10;          // we both need each other's stuff
  for(const x of offer) if(offers.has(x)) s+=15;
  for(const x of need)  if(offers.has(x)) s+=25;
  const tags = new Set((author.taste && Object.keys(author.taste)) || []);
  let t=0,n=0;
  for(const tag of tags){ t+=(you.taste[tag]||0); n++; }
  s += Math.round((n? t/n:0)*30);
  return Math.min(100, s);
}
function timeAgo(at){
  const s = (Date.now()-at)/1000;
  if(s<60) return "just now";
  if(s<3600) return Math.floor(s/60)+" min ago";
  if(s<86400) return Math.floor(s/3600)+" hr ago";
  return Math.floor(s/86400)+" days ago";
}

/* ── embed URL → iframe HTML ───────────────────────────────────────────── */
function embedHtml(track){
  const u = (track.embed_url||"").trim();
  const k = track.embed_kind;
  if(k==="bandcamp" && u){
    return `<iframe src="${esc(u)}" height="120" allow="autoplay" loading="lazy"></iframe>`;
  }
  if(k==="soundcloud" && u){
    return `<iframe src="${esc(u)}" height="166" allow="autoplay" loading="lazy"></iframe>`;
  }
  if(k==="youtube" && u){
    let src = u;
    if(!/embed/.test(src)){
      const m = src.match(/(?:v=|youtu\.be\/|shorts\/)([\w-]{6,})/);
      if(m) src = `https://www.youtube.com/embed/${m[1]}`;
    }
    return `<iframe src="${esc(src)}" height="200" allow="autoplay; encrypted-media" loading="lazy" allowfullscreen></iframe>`;
  }
  if(k==="mixcloud" && u){
    return `<iframe src="${esc(u)}" height="120" allow="autoplay" loading="lazy"></iframe>`;
  }
  if(k==="spotify" && u){
    return `<iframe src="${esc(u)}" height="152" allow="autoplay; encrypted-media" loading="lazy"></iframe>`;
  }
  // empty / external — show a placeholder block
  return `<div class="small upper" style="color:var(--lime); padding:18px; text-align:center; background:#0d130d">
    <div style="font:bold 14px/1.4 'Courier New'; margin-bottom:6px">[ no embed yet ]</div>
    <div>this artist hasn't pasted a stream URL.${u ? ` external link: <a href="${esc(u)}" target="_blank" rel="noopener" style="color:var(--cool)">${esc(u)}</a>` : ""}</div>
  </div>`;
}

/* ── shared partials ───────────────────────────────────────────────────── */
function navHtml(){
  const r = parseHash().route;
  if(isGuest()){
    const items = [
      ["",       "home"],
      ["digs",   "crate digs"],
      ["collab", "collab board"],
      ["map",    "scene map"],
    ];
    const links = items.map(([k,l])=>
      `<a class="navlink ${r===k?"active":""}" href="#/${k}">${esc(l)}</a>`
    ).join("");
    return links +
      `<a class="navlink" href="#/signup" style="background:linear-gradient(180deg,var(--hot),#c0006a); color:#fff">+ create profile</a>` +
      `<span class="role-pill">● guest</span>`;
  }
  const role = me().role;
  const items = [
    ["",       "home"],
    ["digs",   "crate digs"],
    ["collab", "collab board"],
    ["map",    "scene map"],
    ["upload", role==="artist" ? "↑ upload" : "⊕ become an artist"],
    ["me",     `@${esc(me().handle)}`],
  ];
  const links = items.map(([k,l])=>
    `<a class="navlink ${r===k?"active":""}" href="#/${k}">${esc(l)}</a>`
  ).join("");
  const pill = role==="artist"
    ? `<span class="role-pill artist">● artist</span>`
    : `<span class="role-pill">● listener</span>`;
  return links + pill;
}
function tickerHtml(){
  return [...TICKER_ITEMS, ...TICKER_ITEMS].map(it =>
    `<span><span class="star">${esc(it[0])}</span>` +
    `<span class="hit">${esc(it[1])}</span>` +
    `<span> &mdash; ${esc(it[2])}</span>` +
    `<span class="star">  ★  </span></span>`
  ).join("");
}

function counterHtml(n){
  const s = String(n).padStart(7,"0").split("");
  return `<span class="counter">${s.map(d=>`<span>${d}</span>`).join("")}</span>`;
}

function artistCardHtml(artist, opts={}){
  const tracks = tracksByArtist(artist.handle);
  const totalSaves = tracks.reduce((s,t)=>s+saveCount(t.id),0);
  const t = tier(totalSaves || followerCount(artist.handle));
  const featuredTrack = tracks[0];
  const km = haversineKm(me(), artist);
  const totalPlays = tracks.length * 200 + totalSaves * 8; // demo proxy
  const score = opts.score!=null ? opts.score : scoreArtist(artist, me());
  const isCurrent = state.player.track_id && featuredTrack && state.player.track_id===featuredTrack.id;
  const cover = featuredTrack ? featuredTrack.cover_art : "art1";
  const genre = featuredTrack ? featuredTrack.genre : "";
  const note  = featuredTrack ? featuredTrack.note  : artist.bio;
  return `<div class="card">
    <div class="art" data-action="goto-artist" data-handle="${esc(artist.handle)}">
      <svg width="100%" height="100%"><use href="#${esc(cover)}"/></svg>
      <div class="tier-tag ${t.cls}">
        ${t.loud ? `<span class="lbl">${esc(t.label)}</span>` : ""}
        <span class="num"><svg width="11" height="11" viewBox="0 0 24 24"><polygon points="12,2 14.7,9.4 22,10 16,15 18,22 12,18 6,22 8,15 2,10 9.3,9.4" fill="currentColor" stroke="#000" stroke-width="1.4" stroke-linejoin="round"/></svg>${totalSaves.toLocaleString()}</span>
        <span class="saves-tag">SAVES</span>
      </div>
      ${featuredTrack ? `<div class="play-over" data-action="play-track" data-track="${esc(featuredTrack.id)}"><div class="pbig">▶</div></div>` : ""}
    </div>
    <div class="loc-strip">
      <span class="flag">${esc(artist.flag||"")}</span>
      <span class="city">${esc(artist.city||"")}</span>
      <span class="country">·${esc(artist.country||"")}</span>
      <span class="km">${km.toLocaleString()} km</span>
    </div>
    <div class="meta">
      <div class="row" style="justify-content:space-between">
        <h4 class="name"><a href="#/artist/${esc(artist.handle)}">${esc(artist.display_name)}</a></h4>
        ${isCurrent
          ? `<span class="small" style="color:var(--hot); font-weight:bold">● ON AIR</span>`
          : `<span class="match ${score>=70?"hi":score>=40?"mid":""}">${score}% match</span>`}
      </div>
      <div class="genre">${esc(genre)}</div>
      <div class="plays">▶ ${totalPlays.toLocaleString()} plays · ◉ ${(totalPlays*4).toLocaleString()} views · ${esc(note||"")}</div>
      <div class="row">
        ${featuredTrack ? `<button class="btn btn-hot" data-action="play-track" data-track="${esc(featuredTrack.id)}">▶ play</button>` : ""}
        <button class="btn btn-lime" data-action="open-tip" data-handle="${esc(artist.handle)}">$ tip</button>
        ${artist.bandcamp_url ? `<a class="btn" href="${esc(artist.bandcamp_url)}" target="_blank" rel="noopener">bandcamp ↗</a>` : ""}
      </div>
    </div>
  </div>`;
}

function sidebarHtml(){
  const u = me();
  const tags = Object.entries(u.taste||{}).sort((a,b)=>b[1]-a[1]).slice(0,5);
  const online = [
    { who:"tape_tooth", note:"digging in oakland" },
    { who:"marg_99",    note:"spinning leipzig" },
    { who:"k.hara",     note:"radio mode" },
    { who: u.handle,    note:"just landed", you:true },
    { who:"ratking",    note:"uploading…" },
    { who:"poolboy",    note:"tipping mira moss" },
  ];
  const tippedThisWeek = tipsThisWeek();
  const visitors = 2046193 + Math.floor((Date.now()/1000)%1000);
  return `<aside class="stack">
    <div class="bevel panel">
      <div class="panel-h"><span>♠ your taste profile</span><span class="x">×</span></div>
      <div class="row" style="gap:8px; margin-bottom:8px">
        <div style="width:44px; height:44px; background:linear-gradient(135deg,var(--hot),var(--cool)); border:2px solid #000; display:grid; place-items:center; color:#fff; font:900 18px/1 'Comic Sans MS'">${esc(u.handle[0].toUpperCase())}</div>
        <div>
          <div style="font:bold 14px/1.1 'Trebuchet MS'">@${esc(u.handle)}</div>
          <div class="small" style="color:var(--muted)">${esc(u.flag||"")} ${esc(u.city||"")} · ${esc(u.i_am||u.role)}</div>
        </div>
      </div>
      <div class="small upper" style="color:var(--muted); margin-bottom:4px">top tags</div>
      ${tags.map(([k,v])=>`
        <div class="taste-row">
          <span class="lbl">${esc(k)}</span>
          <span class="bar"><i style="width:${Math.round(v*100)}%"></i></span>
          <span class="v">${Math.round(v*100)}</span>
        </div>`).join("")}
      <div class="small upper" style="color:var(--muted); margin:8px 0 4px">i offer / i need</div>
      <div>
        ${(u.i_offer||[]).map(t=>`<span class="chip on">+ ${esc(t)}</span>`).join("")}
        ${(u.i_need||[]).map(t=>`<span class="chip x">△ ${esc(t)}</span>`).join("")}
      </div>
      <div class="row" style="margin-top:10px">
        <a class="btn btn-cool" href="#/me" style="flex:1; justify-content:center">edit profile</a>
      </div>
    </div>
    <div class="bevel panel">
      <div class="panel-h"><span>♫ ears online</span><span class="x">×</span></div>
      <ul class="sb-list">
        ${online.map(o=>`<li><span class="dot"${o.you?` style="background:var(--cool); box-shadow:0 0 6px var(--cool)"`:""}></span> <b>${esc(o.who)}</b> · ${esc(o.note)}</li>`).join("")}
      </ul>
      <div class="small" style="margin-top:6px">${(1247).toLocaleString()} ears total · <a href="#">see all</a></div>
    </div>
    <div class="bevel panel">
      <div class="panel-h"><span>top 5 this week</span><span class="x">×</span></div>
      <div>
        ${(()=>{
          // most-saved tracks
          const ranked = visibleTracks().map(t=>({t, c: saveCount(t.id)+ (Math.random()*0)}))
            .sort((a,b)=>b.c-a.c).slice(0,5);
          return ranked.map((row,i)=>{
            const a = profileBy(row.t.artist_handle);
            return `<div class="chart-row">
              <span class="rank">${i+1}</span>
              <span><b>${esc(a?a.display_name:row.t.artist_handle)}</b> <span class="small" style="color:var(--muted)">// ${esc(row.t.title)}</span></span>
              <span class="arrow ${i%2===0?"up":"dn"}">${i%2===0?"▲":"▼"}</span>
            </div>`;
          }).join("");
        })()}
      </div>
    </div>
    <div class="bevel panel" style="text-align:center">
      <div class="panel-h"><span>visitor count</span><span class="x">×</span></div>
      ${counterHtml(visitors)}
      <div class="small" style="margin-top:6px">
        you are visitor <b>${(visitors+1).toLocaleString()}</b><br/>
        <span class="blink heart">♥</span> est. summer ’26
      </div>
    </div>
    <div class="bevel panel">
      <div class="panel-h"><span>tip jar this week</span><span class="x">×</span></div>
      <div style="font:bold 22px/1 'Trebuchet MS'; color:var(--hot)">$${tippedThisWeek.toLocaleString()}</div>
      <div class="small" style="color:var(--muted)">across ${state.tips.length} clicks · 100% to artists, deep-linked.</div>
    </div>
    <div class="bevel panel">
      <div class="panel-h"><span>spread it</span><span class="x">×</span></div>
      <div class="badges">
        <div class="badge88 a">music sIT<br/>v0.4 beta</div>
        <div class="badge88 b">made by<br/>HUMANS</div>
        <div class="badge88 c">tip jar<br/>OPEN 24/7</div>
        <div class="badge88 d">no algos<br/>only ears</div>
        <div class="badge88 e">link me<br/>88×31</div>
      </div>
    </div>
  </aside>`;
}

/* ── pages ──────────────────────────────────────────────────────────────── */
function renderHome(){
  const u = me();
  const enriched = visibleProfiles().filter(p=>p.role==="artist")
    .map(p=>({ p, score: scoreArtist(p, u) }))
    .sort((a,b)=>b.score-a.score);
  const featured = enriched[0]?.p;
  const totalArtists = visibleProfiles().filter(p=>p.role==="artist").length;
  const totalCities = new Set(visibleProfiles().filter(p=>p.role==="artist").map(p=>p.city)).size;
  return `
    <div class="hero">
      <div class="bevel hero-l">
        <div class="small upper" style="color:var(--muted)">est. 2026 ✦ pop. ${totalCities} cities</div>
        <h1 style="margin:6px 0 0; font:italic 700 38px/1 'Times New Roman', serif">
          where the <span style="color:var(--hot)">underground</span> lives.
        </h1>
        <p class="tag">no playlists. no algorithms. real artists, real cities, real tip jars — clicking around like it's 2003.</p>
        <div class="row">
          <a class="btn btn-hot" href="#/digs">▶ start digging</a>
          <a class="btn btn-cool" href="#/collab">✎ find a collab</a>
          <a class="btn" href="#/me">my profile</a>
        </div>
        <div class="stat-strip">
          <div><b>${totalArtists.toLocaleString()}</b>artists</div>
          <div><b>${totalCities}</b>cities</div>
          <div><b>$${tipsThisWeek().toLocaleString()}</b>tipped this wk</div>
          <div><b>${state.collabs.length}</b>collabs open</div>
        </div>
      </div>
      <div class="bevel hero-r">
        <div class="panel-h" style="margin:-14px -14px 10px"><span>★ artist of the day</span><span class="x">×</span></div>
        ${featured ? `
        <div class="row" style="align-items:flex-start; gap:10px">
          <div style="width:120px; height:120px; border:2px solid #000; flex:0 0 auto">
            <svg width="120" height="120"><use href="#${esc(tracksByArtist(featured.handle)[0]?.cover_art||"art1")}"/></svg>
          </div>
          <div>
            <div class="small upper" style="color:var(--muted)">picked by tape_tooth</div>
            <h3 style="margin:4px 0; font:700 22px/1.1 'Times New Roman', serif">${esc(featured.display_name)}</h3>
            <div class="small">${esc(featured.flag||"")} ${esc(featured.city||"")} · ${esc(tracksByArtist(featured.handle)[0]?.genre||"")}</div>
            <p style="margin:6px 0; font-size:13px">${esc(featured.bio)}</p>
            <div class="row">
              ${tracksByArtist(featured.handle)[0] ? `<button class="btn btn-hot" data-action="play-track" data-track="${esc(tracksByArtist(featured.handle)[0].id)}">▶ play</button>` : ""}
              <button class="btn btn-lime" data-action="open-tip" data-handle="${esc(featured.handle)}">$ tip</button>
              <a href="#/artist/${esc(featured.handle)}" class="btn">full profile →</a>
            </div>
          </div>
        </div>` : `<p>No artists yet. <a href="#/upload">be the first.</a></p>`}
      </div>
    </div>
    <div class="pixel-divider"></div>
    <div class="grid">
      ${sidebarHtml()}
      <main>
        <div class="bevel panel">${renderDigsBody()}</div>
      </main>
    </div>
  `;
}

let digsFilters = { size:"any", where:"global", tag:"all" };

function renderDigsBody(){
  const u = me();
  const allArtists = visibleProfiles().filter(p=>p.role==="artist");
  const enriched = allArtists.map(p=>{
    const ts = tracksByArtist(p.handle);
    const saves = ts.reduce((s,t)=>s+saveCount(t.id),0);
    return { p, score: scoreArtist(p, u), distKm: haversineKm(u,p), saves };
  });

  const indies = enriched.filter(x=>x.saves<500).sort((a,b)=>b.score-a.score);
  const headliner = indies[0]?.p;
  const understudies = indies.slice(1,4).map(x=>x.p);

  const recs = [...enriched].sort((a,b)=>b.score-a.score).slice(0,3).map(x=>x.p);

  const filtered = enriched.filter(x=>{
    if(digsFilters.size==="tiny"    && x.saves>=25)  return false;
    if(digsFilters.size==="small"   && x.saves>=100) return false;
    if(digsFilters.size==="growing" && x.saves>=500) return false;
    if(digsFilters.where==="near"      && x.distKm>2000) return false;
    if(digsFilters.where==="continent" && x.distKm>8000) return false;
    if(digsFilters.tag !== "all"){
      const ts = tracksByArtist(x.p.handle).flatMap(t=>t.tags||[]);
      if(!ts.includes(digsFilters.tag)) return false;
    }
    return true;
  }).map(x=>x.p);

  const allTagsCounts = (() => {
    const m = new Map();
    state.tracks.forEach(t => (t.tags||[]).forEach(tag => m.set(tag, (m.get(tag)||0)+1)));
    return m;
  })();

  return `
    <div class="stack">
      ${headliner ? `
      <div class="spotlight">
        <div class="spotlight-banner">
          <span class="sb-star">★</span><span>independent artist spotlight</span><span class="sb-star">★</span>
          <span class="spacer"></span>
          <span class="small">refreshed every 6 hrs · picked from <b>${indies.length}</b> indies you'd love</span>
        </div>
        <div class="spotlight-body">
          <div class="sp-art">
            <svg width="100%" height="100%"><use href="#${esc(tracksByArtist(headliner.handle)[0]?.cover_art||"art1")}"/></svg>
            ${tracksByArtist(headliner.handle)[0] ? `<button class="sp-play" data-action="play-track" data-track="${esc(tracksByArtist(headliner.handle)[0].id)}">▶ PLAY</button>` : ""}
          </div>
          <div class="sp-info">
            <div class="sp-flags">
              <span class="flag-pill">${esc(headliner.flag||"")} ${esc((headliner.city||"").toUpperCase())} · ${esc(headliner.country||"")}</span>
              <span class="flag-pill warm">UNSIGNED</span>
              <span class="flag-pill warm">DIY</span>
            </div>
            <h3 class="sp-name">${esc(headliner.display_name)}</h3>
            <div class="sp-genre">${esc(tracksByArtist(headliner.handle)[0]?.genre||"")}</div>
            <p class="sp-quote">"${esc(headliner.bio)}" — a ${scoreArtist(headliner, u)}% match for your taste profile.</p>
            <div class="row" style="margin-top:10px">
              ${tracksByArtist(headliner.handle)[0] ? `<button class="btn btn-hot" data-action="play-track" data-track="${esc(tracksByArtist(headliner.handle)[0].id)}">▶ play full set</button>` : ""}
              <button class="btn btn-lime" data-action="open-tip" data-handle="${esc(headliner.handle)}">$ tip</button>
              <a class="btn" href="#/artist/${esc(headliner.handle)}">visit profile →</a>
              ${headliner.bandcamp_url ? `<a class="btn" href="${esc(headliner.bandcamp_url)}" target="_blank" rel="noopener">bandcamp ↗</a>` : ""}
            </div>
          </div>
          <div class="sp-side">
            <div class="small upper" style="color:var(--muted); margin-bottom:6px">also worth digging</div>
            ${understudies.map(a=>{
              const ft = tracksByArtist(a.handle)[0];
              const saves = tracksByArtist(a.handle).reduce((s,t)=>s+saveCount(t.id),0);
              return `<div class="sp-mini" data-action="goto-artist" data-handle="${esc(a.handle)}">
                <div class="sp-mini-art"><svg width="100%" height="100%"><use href="#${esc(ft?ft.cover_art:"art1")}"/></svg></div>
                <div>
                  <div class="sp-mini-name">${esc(a.display_name)}</div>
                  <div class="small" style="color:var(--muted)">${esc(a.flag||"")} ${esc(a.city||"")} · ★ ${saves} · ${scoreArtist(a, u)}%</div>
                </div>
                <span class="sp-mini-play">▶</span>
              </div>`;
            }).join("")}
          </div>
        </div>
      </div>` : ""}

      <div style="padding:10px 12px; background:linear-gradient(180deg,var(--bg), var(--paper)); border:2px dashed var(--frame); margin-bottom:6px">
        <div class="row" style="align-items:baseline; margin-bottom:6px">
          <h2 class="section" style="margin:0">made for <span style="color:var(--hot)">${esc(u.handle)}</span> <span class="deco"></span></h2>
          <span class="small" style="color:var(--muted)">· from your taste profile · <a href="#/me">edit ✎</a></span>
        </div>
        <div class="cards">
          ${recs.map(a=>artistCardHtml(a)).join("")}
        </div>
      </div>

      <div class="row" style="justify-content:space-between; margin-top:8px">
        <h2 class="section">all crates <span class="deco"></span></h2>
        <button class="btn btn-cool" data-action="lucky-dip">🎲 lucky dip</button>
      </div>

      <div style="display:grid; gap:6px">
        <div class="row" style="gap:8px">
          <span class="small upper" style="color:var(--muted); min-width:60px">size</span>
          ${[["any","any"],["tiny","✳ tiny <25"],["small","· small <100"],["growing","△ growing <500"]].map(([k,l])=>
            `<button class="navlink" data-action="set-filter" data-key="size" data-value="${k}"
              ${digsFilters.size===k?`style="background:linear-gradient(180deg,var(--hot),#c0006a);color:#fff"`:""}>${esc(l)}</button>`
          ).join("")}
        </div>
        <div class="row" style="gap:8px">
          <span class="small upper" style="color:var(--muted); min-width:60px">where</span>
          ${[["global","○ global"],["continent","◐ same continent"],["near","• near "+u.city+" <2000km"]].map(([k,l])=>
            `<button class="navlink" data-action="set-filter" data-key="where" data-value="${k}"
              ${digsFilters.where===k?`style="background:linear-gradient(180deg,var(--cool),#0096b8)"`:""}>${esc(l)}</button>`
          ).join("")}
        </div>
        <div class="row" style="gap:4px; flex-wrap:wrap">
          <span class="small upper" style="color:var(--muted); min-width:60px">tag</span>
          <span class="chip ${digsFilters.tag==="all"?"on":""}" data-action="set-filter" data-key="tag" data-value="all">all</span>
        </div>
        <div class="genre-browse">
          ${GENRES.map(g=>`
            <div class="genre-row">
              <div class="genre-head" style="border-color:${g.color}; color:${g.color}">${esc(g.group.toUpperCase())}</div>
              <div class="genre-tags">
                ${g.tags.map(t=>{
                  const c = allTagsCounts.get(t)||0;
                  return `<span class="chip ${digsFilters.tag===t?"on":""} ${c===0?"x":""}" data-action="set-filter" data-key="tag" data-value="${esc(t)}">#${esc(t)}${c>0?`<span style="opacity:.55; margin-left:4px">${c}</span>`:""}</span>`;
                }).join("")}
              </div>
            </div>`).join("")}
        </div>
      </div>

      <div class="cards">
        ${filtered.length===0
          ? `<div class="small" style="padding:14px; grid-column:1 / -1; text-align:center; color:var(--muted)">no matches — widen your filters above</div>`
          : filtered.map(a=>artistCardHtml(a)).join("")}
      </div>
    </div>`;
}

function renderDigs(){
  return `
    <div class="page-h"><div><div class="crumb">discover</div><h1>crate digs</h1>
      <p class="lede">dig through cities. lean into tiny artists. follow the threads.</p></div></div>
    <div class="bevel panel">${renderDigsBody()}</div>`;
}

function renderCollab(){
  const u = me();
  const ads = visibleCollabs().map(c=>({ ...c, fit: collabFit(c, u) })).sort((a,b)=>b.fit-a.fit);
  const can = u.role==="artist";
  return `
    <div class="page-h">
      <div><div class="crumb">community</div><h1>collab board</h1>
        <p class="lede">classified ads from artists. trade skills, split tip jars, start a band.</p></div>
      ${can ? `<button class="btn btn-hot" data-action="open-collab-form">+ post a notice</button>` : `<a class="btn" href="#/upload">become an artist to post →</a>`}
    </div>
    <div class="bevel panel">
      <div class="ads">
        ${ads.map(c=>{
          const a = profileBy(c.author);
          const tagCls = c.kind==="vocalist"?"tag-vox":c.kind==="producer"?"tag-prod":c.kind==="visual"?"tag-art":"";
          return `<div class="ad">
            <span class="pin"></span>
            <div class="row" style="justify-content:space-between; align-items:flex-start">
              <span class="ad-tag ${tagCls}">${esc((c.kind||"").toUpperCase())}</span>
              <span class="match ${c.fit>=70?"hi":c.fit>=40?"mid":""}">${c.fit}% fit</span>
            </div>
            <h4>${esc(c.title)}</h4>
            <p>${esc(c.body)}</p>
            <div class="small upper" style="color:var(--muted); margin-bottom:6px">
              ${a?`${esc(a.flag||"")} ${esc(a.city||"")} · ${esc(a.country||"")} · ${haversineKm(u,a).toLocaleString()} km`:""}
            </div>
            <div class="who">
              <span><a href="#/artist/${esc(c.author)}">${esc(a?a.display_name:c.author)}</a> · ${timeAgo(c.created_at)}</span>
              <span class="spacer"></span>
              <span>· ${c.replies||0} replies</span>
              <button class="btn" style="padding:3px 8px; font-size:11px" data-action="reply-collab" data-id="${esc(c.id)}">reply ↩</button>
            </div>
          </div>`;
        }).join("")}
      </div>
    </div>
  `;
}

function renderUpload(){
  const u = me();
  if(u.role !== "artist"){
    return `
      <div class="page-h"><div><div class="crumb">artist tools</div><h1>upload</h1></div></div>
      <div class="gate">
        <h2>♫ artists only.</h2>
        <p>uploading lives on the artist side. flip your account to artist mode — it's free, takes 30 seconds, and you keep 100% of every tip (it deep-links straight to your payment app).</p>
        <ul>
          <li>paste a Bandcamp / SoundCloud / YouTube link — your existing player embeds inline</li>
          <li>add visuals, video, links to zines</li>
          <li>set your tip-jar amounts and link your bandcamp</li>
          <li>show up on the collab board with your skills + needs</li>
        </ul>
        <div class="row" style="justify-content:center; margin-top:14px">
          <button class="btn btn-hot" data-action="become-artist">+ become an artist</button>
          <a class="btn" href="#/digs">no thanks, just listening</a>
        </div>
      </div>`;
  }

  return `
    <div class="page-h">
      <div><div class="crumb">artist tools</div><h1>drop a track</h1>
        <p class="lede">paste a stream link from where your music already lives. nothing to upload.</p></div>
      <span class="role-pill artist">● artist mode</span>
    </div>
    <div class="bevel panel">
      <div class="upload" id="upload-zone">
        <h3>★ paste a stream URL ★</h3>
        <p>Bandcamp, SoundCloud, YouTube, Mixcloud, Spotify — anywhere your music lives. The player embeds inline.</p>
        <form id="upload-form" autocomplete="off" style="max-width:520px; margin:14px auto 0; text-align:left; display:grid; gap:8px">
          <label class="small upper">title <input class="field" name="title" required placeholder="kelp room"/></label>
          <label class="small upper">stream URL
            <input class="field" name="embed_url" required placeholder="https://yourname.bandcamp.com/album/..."/></label>
          <label class="small upper">cover art
            <select class="field" name="cover_art">
              ${["art1","art2","art3","art4","art5","art6","art7","art8","art9"].map(a=>`<option value="${a}">${a}</option>`).join("")}
            </select>
          </label>
          <label class="small upper">scene / genre <input class="field" name="genre" placeholder="bedroom drone"/></label>
          <label class="small upper">tags (comma-separated) <input class="field" name="tags" placeholder="ambient, slow, warm"/></label>
          <label class="small upper">price label <input class="field" name="price_label" placeholder="name your price"/></label>
          <label class="small upper">tagline <input class="field" name="note" placeholder="4-track loops"/></label>
          <div style="margin-top:6px">
            <button class="btn btn-hot" type="submit">▲ publish</button>
            <span class="small" style="margin-left:10px; color:var(--muted)">100% of tips go to you (deep-linked).</span>
          </div>
        </form>
      </div>
    </div>

    <div class="bevel panel" style="margin-top:14px">
      <div class="panel-h"><span>your tracks</span><span class="x">×</span></div>
      ${tracksByArtist(u.handle).length === 0
        ? `<p class="small" style="color:var(--muted)">no tracks yet — paste a URL above.</p>`
        : tracksByArtist(u.handle).map(t=>`
          <div class="row" style="justify-content:space-between; padding:8px 0; border-bottom:1px dotted var(--muted)">
            <span><b>${esc(t.title)}</b> <span class="small" style="color:var(--muted)">// ${esc(t.embed_kind)}</span></span>
            <span class="row">
              <button class="btn" data-action="play-track" data-track="${esc(t.id)}">▶</button>
              <button class="btn" data-action="delete-track" data-id="${esc(t.id)}">delete</button>
            </span>
          </div>`).join("")}
    </div>
  `;
}

function renderArtist(handle){
  const a = profileBy(handle);
  if(!a) return `<div class="page-h"><h1>not found</h1></div>`;
  const u = me();
  const tracks = tracksByArtist(handle);
  const totalSaves = tracks.reduce((s,t)=>s+saveCount(t.id),0);
  const t = tier(totalSaves || followerCount(handle));
  const distKm = haversineKm(u, a);
  const score = scoreArtist(a, u);
  const totalPlays = tracks.length * 200 + totalSaves * 8;
  const following = isFollowing(handle);
  const similar = Object.values(state.profiles).filter(p=>p.role==="artist" && p.handle!==handle).slice(0,3);
  return `
    <div class="page-h">
      <div>
        <div class="crumb"><a href="#/digs">crate digs</a> / artist</div>
        <h1>${esc(a.display_name)}</h1>
      </div>
      <div class="row">
        ${tracks[0] ? `<button class="btn btn-hot" data-action="play-track" data-track="${esc(tracks[0].id)}">▶ play full set</button>` : ""}
        <button class="btn btn-lime" data-action="open-tip" data-handle="${esc(handle)}">$ tip</button>
        ${a.bandcamp_url ? `<a class="btn" href="${esc(a.bandcamp_url)}" target="_blank" rel="noopener">bandcamp ↗</a>` : ""}
        <button class="btn ${following?"btn-cool":""}" data-action="${following?"unfollow":"follow"}" data-handle="${esc(handle)}">${following?"✓ following":"+ follow"}</button>
      </div>
    </div>

    <div class="ap-hero">
      <div class="ap-art"><svg width="100%" height="100%"><use href="#${esc(tracks[0]?.cover_art||"art1")}"/></svg></div>
      <div>
        <div class="ap-flags">
          <span class="flag-pill">${esc(a.flag||"")} ${esc((a.city||"").toUpperCase())} · ${esc(a.country||"")}</span>
          ${t.loud ? `<span class="flag-pill tier">${esc(t.label)} — ★ ${totalSaves} saves</span>` : ""}
          <span class="flag-pill warm">UNSIGNED</span>
          <span class="flag-pill warm">DIY</span>
          <span class="flag-pill" style="background:var(--lime); color:#000">${score}% MATCH</span>
        </div>
        <h2 class="ap-name">${esc(a.display_name)}</h2>
        <div class="sp-genre">${esc(tracks[0]?.genre||"")}</div>
        <p class="ap-bio">${esc(a.bio||"")}${a.i_offer?.length||a.i_need?.length ? ` open to: ${esc([...(a.i_offer||[]),...(a.i_need||[])].join(", "))}.` : ""}</p>
        <div class="ap-stats">
          <div>plays<b>${totalPlays.toLocaleString()}</b></div>
          <div>saves<b>★ ${totalSaves}</b></div>
          <div>followers<b>${followerCount(handle)}</b></div>
          <div>distance<b>${distKm.toLocaleString()} km</b></div>
          <div>tipped<b>$${tipsToArtist(handle)}</b></div>
        </div>
        <div class="sp-tags" style="margin-top:10px">
          ${[...new Set(tracks.flatMap(t=>t.tags||[]))].map(tag=>`<span class="chip">#${esc(tag)}</span>`).join("")}
        </div>
      </div>
    </div>

    <div class="bevel panel" style="margin-top:14px">
      <div class="panel-h"><span>♪ tracks</span><span class="x">×</span></div>
      ${tracks.length === 0 ? `<p class="small" style="color:var(--muted)">no tracks yet.</p>` : `
      <div class="tracks">
        <div class="row-t head">
          <span>#</span><span></span><span>title</span>
          <span style="text-align:right">saves</span>
          <span style="text-align:right">price</span>
          <span style="text-align:right">tip</span>
        </div>
        ${tracks.map((tr,i)=>{
          const playing = state.player.track_id===tr.id;
          const saved = isSaved(tr.id);
          return `<div class="row-t ${playing?"playing":""}">
            <span>${String(i+1).padStart(2,"0")}</span>
            <span class="pl" data-action="play-track" data-track="${esc(tr.id)}">▶</span>
            <span class="ttl">${esc(tr.title)}</span>
            <span class="plays" style="text-align:right">★ ${saveCount(tr.id)}</span>
            <span class="dur" style="text-align:right">${esc(tr.price_label||"")}</span>
            <span style="text-align:right">
              <button class="btn ${saved?"btn-hot":""}" data-action="${saved?"unsave":"save"}" data-track="${esc(tr.id)}" style="padding:3px 8px; font-size:11px">${saved?"saved":"+ save"}</button>
              <button class="btn btn-lime" data-action="open-tip" data-handle="${esc(handle)}" style="padding:3px 8px; font-size:11px">$ tip</button>
            </span>
          </div>`;
        }).join("")}
      </div>`}
    </div>

    ${tracks[0] ? `
    <div class="bevel panel" style="margin-top:14px">
      <div class="panel-h"><span>♫ now spinning · ${esc(tracks[0].title)}</span><span class="x">×</span></div>
      <div class="embed-wrap">
        ${embedHtml(tracks[0])}
        <div class="embed-meta">${esc(tracks[0].embed_kind.toUpperCase())} · ${esc(tracks[0].note||"")}</div>
      </div>
    </div>` : ""}

    <div class="bevel panel" style="margin-top:14px">
      <div class="panel-h"><span>similar in your zone</span><span class="x">×</span></div>
      <div class="cards" style="grid-template-columns:repeat(3,1fr)">
        ${similar.map(a=>artistCardHtml(a)).join("")}
      </div>
    </div>
  `;
}

function renderMe(){
  const u = me();
  const followed = state.follows.filter(f=>f.follower===u.handle).map(f=>profileBy(f.artist)).filter(Boolean);
  const myTips = state.tips.filter(t=>t.from===u.handle).sort((a,b)=>b.at-a.at);
  const tags = Object.entries(u.taste||{}).sort((a,b)=>b[1]-a[1]);
  const totalTipped = myTips.reduce((s,t)=>s+t.amount, 0);
  return `
    <div class="page-h">
      <div><div class="crumb">my profile</div><h1>@${esc(u.handle)}</h1></div>
      <div class="row">
        <a class="btn btn-cool" href="#/digs">▶ keep digging</a>
        <button class="btn" data-action="open-edit-profile">edit profile</button>
      </div>
    </div>
    <div class="me-hero">
      <div class="me-avatar">${esc(u.handle[0].toUpperCase())}</div>
      <div>
        <h2 class="me-handle">@${esc(u.handle)}</h2>
        <div class="sp-genre">${esc(u.flag||"")} ${esc(u.city||"")} · ${esc(u.i_am||u.role)} · since ${new Date(u.created_at||Date.now()).getFullYear()}</div>
        <p class="me-bio">${esc(u.bio||"")}</p>
        <div class="me-stats">
          <div>following<b>${followed.length}</b></div>
          <div>tipped<b>$${totalTipped}</b></div>
          <div>${u.role==="artist" ? `tracks<b>${tracksByArtist(u.handle).length}</b>` : `saves<b>${state.saves.filter(s=>s.profile===u.handle).length}</b>`}</div>
        </div>
      </div>
      <div>
        <div class="small upper" style="color:var(--muted); margin-bottom:6px">top taste tags</div>
        ${tags.slice(0,6).map(([k,v])=>`
          <div class="taste-row">
            <span class="lbl">${esc(k)}</span>
            <span class="bar"><i style="width:${Math.round(v*100)}%"></i></span>
            <span class="v">${Math.round(v*100)}</span>
          </div>`).join("")}
        <div class="small upper" style="color:var(--muted); margin:10px 0 4px">i offer / i need</div>
        ${(u.i_offer||[]).map(t=>`<span class="chip on">+ ${esc(t)}</span>`).join("")}
        ${(u.i_need||[]).map(t=>`<span class="chip x">△ ${esc(t)}</span>`).join("")}
      </div>
    </div>

    <div class="bevel panel" style="margin-top:14px">
      <div class="panel-h"><span>edit profile</span><span class="x">×</span></div>
      <form id="profile-form" autocomplete="off" style="display:grid; gap:8px">
        <div class="field-row"><label>handle</label><input class="field" name="handle" value="${esc(u.handle)}"/></div>
        <div class="field-row"><label>display name</label><input class="field" name="display_name" value="${esc(u.display_name||"")}"/></div>
        <div class="field-row"><label>bio</label><input class="field" name="bio" value="${esc(u.bio||"")}"/></div>
        <div class="field-row"><label>city</label><input class="field" name="city" value="${esc(u.city||"")}"/></div>
        <div class="field-row"><label>country</label><input class="field" name="country" value="${esc(u.country||"")}"/></div>
        <div class="field-row"><label>flag emoji</label><input class="field" name="flag" value="${esc(u.flag||"")}"/></div>
        <div class="field-row"><label>i am a</label><input class="field" name="i_am" value="${esc(u.i_am||"")}"/></div>
        <div class="field-row"><label>i offer</label><input class="field" name="i_offer" placeholder="comma separated" value="${esc((u.i_offer||[]).join(", "))}"/></div>
        <div class="field-row"><label>i need</label><input class="field" name="i_need" placeholder="comma separated" value="${esc((u.i_need||[]).join(", "))}"/></div>
        <div class="field-row"><label>bandcamp</label><input class="field" name="bandcamp_url" value="${esc(u.bandcamp_url||"")}"/></div>
        <div class="field-row"><label>soundcloud</label><input class="field" name="soundcloud_url" value="${esc(u.soundcloud_url||"")}"/></div>
        <div class="field-row"><label>website</label><input class="field" name="website_url" value="${esc(u.website_url||"")}"/></div>
        <div class="field-row"><label>atproto handle</label><input class="field" name="atproto_handle" placeholder="alice.bsky.social" value="${esc(u.atproto_handle||"")}"/></div>
        <fieldset style="border:1px dashed var(--muted); padding:10px; margin-top:6px">
          <legend class="small upper" style="color:var(--muted)">tip-jar handles (deep-linked, never touched by this site)</legend>
          ${[
            ["venmo","Venmo (@handle)"],
            ["cashapp","Cash App ($handle)"],
            ["paypal","PayPal email"],
            ["stripe_url","Stripe payment URL"],
            ["zelle","Zelle (email or phone)"],
            ["apple","Apple Pay (handle)"],
          ].map(([k,l])=>`<div class="field-row"><label>${esc(l)}</label><input class="field" name="ph_${k}" value="${esc(u.payment_handles?.[k]||"")}"/></div>`).join("")}
        </fieldset>
        <div style="margin-top:6px">
          <button class="btn btn-hot" type="submit">save changes</button>
          ${u.role==="listener" ? `<button class="btn btn-lime" type="button" data-action="become-artist">become an artist</button>` : `<button class="btn" type="button" data-action="become-listener">switch back to listener</button>`}
          <button class="btn" type="button" data-action="reset-state" style="margin-left:auto; float:right">reset all data</button>
        </div>
      </form>
    </div>

    <div class="bevel panel" style="margin-top:14px">
      <div class="panel-h"><span>artists you follow</span><span class="x">×</span></div>
      ${followed.length===0 ? `<p class="small" style="color:var(--muted)">no follows yet — head to <a href="#/digs">crate digs</a>.</p>` : `
      <div class="cards" style="grid-template-columns:repeat(4,1fr)">
        ${followed.map(a=>artistCardHtml(a)).join("")}
      </div>`}
    </div>

    <div class="bevel panel" style="margin-top:14px">
      <div class="panel-h"><span>your tip history</span><span class="x">×</span></div>
      ${myTips.length===0 ? `<p class="small" style="color:var(--muted)">no tips yet.</p>` : `
      <ul class="sb-list" style="font-size:13px">
        ${myTips.map(t=>{
          const a = profileBy(t.to);
          return `<li>
            <span class="dot" style="background:var(--hot); box-shadow:0 0 6px var(--hot)"></span>
            <b>$${t.amount}</b> to <a href="#/artist/${esc(t.to)}">${esc(a?a.display_name:t.to)}</a> · ${timeAgo(t.at)}
            <span class="spacer"></span>
            <span class="small" style="color:var(--muted)">${esc(a?.flag||"")} ${esc(a?.city||"")}</span>
          </li>`;
        }).join("")}
      </ul>`}
    </div>
  `;
}

function renderWelcome(){
  // pickable demo accounts so first-time visitors can try the app fully signed-in
  const demos = ["tape_tooth","saltvane","mira_moss","konigswasser","chrome_plum"]
    .map(h => profileBy(h)).filter(Boolean);
  const totalArtists = visibleProfiles().filter(p=>p.role==="artist").length;
  return `
    <div class="hero">
      <div class="bevel hero-l">
        <div class="small upper" style="color:var(--muted)">welcome ✦ no algorithms · just ears</div>
        <h1 style="margin:6px 0 0; font:italic 700 38px/1 'Times New Roman', serif">
          where the <span style="color:var(--hot)">underground</span> lives.
        </h1>
        <p class="tag">make a profile, paste a stream link, or just dig through ${totalArtists} tiny artists in 47 cities. tip jars deep-link to artists' own apps — money never touches us.</p>
        <div class="row">
          <a class="btn btn-hot" href="#/signup">+ create your profile</a>
          <a class="btn btn-cool" href="#/digs">▶ browse as guest</a>
        </div>
        <div class="stat-strip">
          <div><b>${totalArtists}</b>artists</div>
          <div><b>${state.tracks.length}</b>tracks</div>
          <div><b>${state.collabs.length}</b>collabs open</div>
          <div><b>$${tipsThisWeek().toLocaleString()}</b>tipped this wk</div>
        </div>
      </div>
      <div class="bevel hero-r">
        <div class="panel-h" style="margin:-14px -14px 10px"><span>★ try a demo account</span><span class="x">×</span></div>
        <p class="small" style="color:var(--muted); margin:0 0 8px">poke around as someone else. you can always make your own after.</p>
        <ul class="sb-list">
          ${demos.map(p=>`
            <li>
              <span class="dot"></span>
              <b style="flex:1">@${esc(p.handle)}</b>
              <span class="small" style="color:var(--muted)">${esc(p.flag||"")} ${esc(p.city||"")} · ${esc(p.role)}</span>
              <button class="btn" style="padding:3px 8px; font-size:11px" data-action="login-demo" data-handle="${esc(p.handle)}">sign in →</button>
            </li>
          `).join("")}
        </ul>
      </div>
    </div>
    <div class="pixel-divider"></div>
    <div class="bevel panel" style="margin-top:14px">
      <div class="panel-h"><span>♦ what's here</span><span class="x">×</span></div>
      <ul style="font:14px/1.6 'Trebuchet MS'">
        <li><b>Crate Digs</b> — taste-matched tiny artists, filterable by size + distance + tag</li>
        <li><b>Collab Board</b> — classified ads ranked by fit with your offer/need profile</li>
        <li><b>Scene Map</b> — d3 + topojson world map of cities with active uploaders, drag to pan, scroll to zoom</li>
        <li><b>Upload</b> — paste a Bandcamp / SoundCloud / YouTube link, it embeds inline</li>
        <li><b>Tips</b> — deep-link to the artist's Venmo / Cash App / PayPal / Stripe handle</li>
      </ul>
    </div>
  `;
}

function renderSignup(){
  // suggest a flag based on country if visible
  return `
    <div class="page-h">
      <div><div class="crumb">create your profile</div><h1>sign up</h1>
        <p class="lede">no email, no algorithm — just pick a handle and tell us where you are. everything stays in your browser until you connect a database.</p></div>
      <a class="btn" href="#/">cancel</a>
    </div>
    <div class="bevel panel" style="max-width:680px; margin:0 auto">
      <div class="panel-h"><span>♥ new profile</span><span class="x">×</span></div>
      <form id="signup-form" autocomplete="off" style="display:grid; gap:8px">
        <div class="field-row"><label>handle <span style="color:var(--hot)">*</span></label>
          <input class="field" name="handle" required pattern="[a-z0-9_\\-\\.]{2,24}" placeholder="lowercase, 2–24 chars" autofocus/></div>
        <div class="field-row"><label>display name</label>
          <input class="field" name="display_name" placeholder="(optional, defaults to handle)"/></div>
        <div class="field-row"><label>i am a <span style="color:var(--hot)">*</span></label>
          <select class="field" name="role" required>
            <option value="listener">listener (i'm here to dig)</option>
            <option value="artist">artist (i make stuff)</option>
          </select></div>
        <div class="field-row"><label>city</label>
          <input class="field" name="city" placeholder="brooklyn"/></div>
        <div class="field-row"><label>country</label>
          <input class="field" name="country" placeholder="US"/></div>
        <div class="field-row"><label>flag emoji</label>
          <input class="field" name="flag" placeholder="🇺🇸" maxlength="4"/></div>
        <div class="field-row"><label>bio</label>
          <input class="field" name="bio" placeholder="one line about you"/></div>
        <div class="field-row"><label>i offer</label>
          <input class="field" name="i_offer" placeholder="comma-separated: mix, vocal, cover-art"/></div>
        <div class="field-row"><label>i need</label>
          <input class="field" name="i_need" placeholder="comma-separated: drums, feature"/></div>

        <fieldset style="border:1px dashed var(--muted); padding:10px; margin-top:6px">
          <legend class="small upper" style="color:var(--muted)">links (optional)</legend>
          <div class="field-row"><label>bandcamp</label><input class="field" name="bandcamp_url" placeholder="https://you.bandcamp.com"/></div>
          <div class="field-row"><label>soundcloud</label><input class="field" name="soundcloud_url" placeholder="https://soundcloud.com/you"/></div>
          <div class="field-row"><label>website</label><input class="field" name="website_url" placeholder="https://"/></div>
          <div class="field-row"><label>atproto handle</label><input class="field" name="atproto_handle" placeholder="alice.bsky.social"/></div>
        </fieldset>

        <fieldset style="border:1px dashed var(--muted); padding:10px">
          <legend class="small upper" style="color:var(--muted)">tip-jar handles (deep-linked, never touched by this site)</legend>
          ${[
            ["venmo","Venmo (@handle)"],
            ["cashapp","Cash App ($handle)"],
            ["paypal","PayPal email"],
            ["stripe_url","Stripe payment URL"],
          ].map(([k,l])=>`<div class="field-row"><label>${esc(l)}</label><input class="field" name="ph_${k}"/></div>`).join("")}
        </fieldset>

        <fieldset id="signup-track-fields" style="border:1px dashed var(--hot); padding:10px; display:none">
          <legend class="small upper" style="color:var(--hot)">your first track (artist mode)</legend>
          <p class="small" style="color:var(--muted); margin:0 0 6px">paste a stream URL — Bandcamp, SoundCloud, Mixcloud, YouTube, or Spotify. it'll embed inline as a real iframe player on your profile. you can add more after.</p>
          <div class="field-row"><label>title</label><input class="field" name="first_track_title" placeholder="kelp room"/></div>
          <div class="field-row"><label>stream URL</label><input class="field" name="first_track_url" placeholder="https://yourname.bandcamp.com/album/..."/></div>
          <div class="field-row"><label>genre / scene</label><input class="field" name="first_track_genre" placeholder="bedroom drone"/></div>
          <div class="field-row"><label>tags</label><input class="field" name="first_track_tags" placeholder="ambient, slow, warm"/></div>
          <div class="field-row"><label>cover art</label>
            <select class="field" name="first_track_art">
              ${["art1","art2","art3","art4","art5","art6","art7","art8","art9"].map(a=>`<option value="${a}">${a}</option>`).join("")}
            </select></div>
          <div class="field-row"><label>tagline</label><input class="field" name="first_track_note" placeholder="4-track loops"/></div>
          <div class="field-row"><label>price label</label><input class="field" name="first_track_price" placeholder="name your price"/></div>
        </fieldset>

        <div id="signup-error" class="small" style="color:var(--hot); display:none"></div>
        <div class="row" style="margin-top:10px">
          <button class="btn btn-hot" type="submit">create profile →</button>
          <a class="btn" href="#/">cancel</a>
          <span class="spacer"></span>
          <span class="small" style="color:var(--muted)">already have a handle? <a href="#" data-action="open-login-list">switch users ↓</a></span>
        </div>
      </form>
    </div>
  `;
}

function renderMap(){
  const sorted = [...state.scenes].sort((a,b)=>(b.artists*(1+b.growth/100)) - (a.artists*(1+a.growth/100)));
  return `
    <div class="page-h"><div><div class="crumb">discover</div><h1>scene map</h1>
      <p class="lede">every dot is a city with active uploaders. drag to pan, scroll to zoom.</p></div></div>
    <div class="bevel panel">
      <div class="mil-map" id="mil-map">
        <div class="corner tl"></div><div class="corner tr"></div>
        <div class="corner bl"></div><div class="corner br"></div>
        <div class="hud-top">
          <span><span class="hud-pill live">● LIVE</span> &nbsp; SCENES.GLOBAL</span>
          <span>NATURAL EARTH PROJ · WGS84</span>
        </div>
        <div class="hud-bot">
          <span>${state.scenes.length} SCENES · ${state.scenes.reduce((s,x)=>s+x.artists,0)} ARTISTS · 47 COUNTRIES</span>
          <span><span style="color:#caff00">●</span> RISING &nbsp; <span style="color:#caff00">●</span> STEADY &nbsp; <span style="color:#00d4ff">●</span> CHILL</span>
        </div>
        <svg id="mil-svg"></svg>
        <div class="scanlines"></div>
        <div class="vignette"></div>
      </div>
      <div class="mil-controls">
        <span class="lbl">view</span>
        <button class="btn-r" data-action="map-reset">reset</button>
        <button class="btn-r alt" data-action="map-zoom" data-z="in">+ zoom</button>
        <button class="btn-r alt" data-action="map-zoom" data-z="out">- zoom</button>
        <span style="flex:1"></span>
        <span class="lbl">${state.scenes.length} pins · drag to pan</span>
      </div>

      <div class="bevel panel" style="margin-top:14px">
        <div class="panel-h"><span>♦ scenes climbing this week</span><span class="x">×</span></div>
        ${sorted.slice(0,8).map((s,i)=>{
          const cls = s.growth>=25?"fast":s.growth>=15?"med":"chill";
          return `<div class="scene-leader">
            <span class="rk">${i+1}</span>
            <span><b>${esc(s.name)}</b> <span class="small" style="color:var(--muted)">// ${s.artists} artists</span></span>
            <span class="small" style="color:var(--muted)">growth /wk</span>
            <span class="pct ${cls}">+${s.growth}%</span>
          </div>`;
        }).join("")}
      </div>
    </div>
  `;
}

function renderPlayer(){
  const t = trackBy(state.player.track_id);
  const a = t ? profileBy(t.artist_handle) : null;
  const playing = state.player.playing && t;
  const meterBars = Array.from({length:24}, (_,i)=>30 + Math.round(60 * Math.abs(Math.sin((i+1)*1.7))));
  return `
    <div class="cd"></div>
    <div class="info">
      ${t ? `
        <div><span>${playing?"►":"⏸"}</span> <span class="who">${esc(a?.display_name||t.artist_handle)}</span> — "${esc(t.title)}"</div>
        <div class="small">${esc(a?.city||"")} · ${esc(t.genre||"")} · ${esc(t.embed_kind)}</div>
      ` : `
        <div><span>○</span> <span class="who">nothing playing</span></div>
        <div class="small">press ▶ on any artist card to start</div>
      `}
    </div>
    <div class="meter" aria-hidden="true">
      ${meterBars.map(h=>`<i style="height:${h}%"></i>`).join("")}
    </div>
    <div class="player-ctl">
      <button class="pbtn" data-action="prev-track">⏮</button>
      <button class="pbtn big" data-action="toggle-play">${playing?"⏸":"▶"}</button>
      <button class="pbtn" data-action="next-track">⏭</button>
      <button class="pbtn" data-action="random-track" title="random">🎲</button>
    </div>
    <div class="player-ctl">
      ${t && a ? `<button class="btn btn-hot" style="height:32px" data-action="open-tip" data-handle="${esc(a.handle)}">$ tip</button>` : ""}
      <span class="viz" aria-hidden="true">${Array.from({length:7}).map(()=>"<i></i>").join("")}</span>
    </div>
  `;
}

/* ── modals ─────────────────────────────────────────────────────────────── */
let modalState = null; // {type, ...}
function openTipModal(handle){
  modalState = { type:"tip", handle, method:null, amount:5 };
  renderModal();
}
function openCollabForm(){
  modalState = { type:"collab" };
  renderModal();
}
function closeModal(){ modalState = null; renderModal(); }

function renderModal(){
  const root = document.getElementById("modal-root");
  if(!modalState){ root.innerHTML = ""; return; }
  if(modalState.type === "tip"){
    const a = profileBy(modalState.handle);
    if(!a) { closeModal(); return; }
    const handles = a.payment_handles || {};
    const have = Object.keys(handles).filter(k=>handles[k]);
    const sel = modalState.method;
    const amt = modalState.amount;
    let detailHtml = "";
    if(sel){
      const v = handles[sel];
      const links = {
        venmo:    v ? `https://venmo.com/${encodeURIComponent(String(v).replace(/^@/,""))}?txn=pay&amount=${amt}&note=tip+via+music+sIT` : null,
        cashapp:  v ? `https://cash.app/${encodeURIComponent(String(v).replace(/^\$/,"$"))}/${amt}` : null,
        paypal:   v ? `https://www.paypal.com/paypalme/${encodeURIComponent(String(v).split("@")[0])}/${amt}` : null,
        stripe_url: v || null,
        apple:    null,
        zelle:    null,
      };
      const link = links[sel];
      detailHtml = `<div class="pay-detail">
        sending <b>$${amt}</b> to <b>${esc(a.display_name)}</b> via <b>${esc(sel)}</b><br/>
        ${v ? `handle: <code>${esc(v)}</code>` : "<i>no handle on file</i>"}
        ${link ? `<div style="margin-top:8px"><a class="btn btn-hot" href="${esc(link)}" target="_blank" rel="noopener" data-action="confirm-tip" data-handle="${esc(a.handle)}" data-amount="${amt}">open ${esc(sel)} →</a></div>`
              : `<div class="small" style="margin-top:6px; color:var(--muted)">deep-linking not available for ${esc(sel)} — paste the handle into your app manually.</div>`}
      </div>`;
    }
    root.innerHTML = `
      <div class="modal-bg" data-action="close-modal">
        <div class="modal" onclick="event.stopPropagation()">
          <div class="modal-h"><span>♥ tip ${esc(a.display_name)}</span><span class="x" data-action="close-modal">×</span></div>
          <div class="modal-b">
            <p class="small" style="color:var(--muted); margin:0 0 8px">100% goes to the artist. We deep-link to their payment app — money never touches this site.</p>
            <div class="small upper" style="color:var(--muted); margin-bottom:4px">amount</div>
            <div class="amt-grid">
              ${[1,3,5,10,25].map(v=>`<div class="amt ${amt===v?"sel":""}" data-action="set-tip-amount" data-v="${v}">$${v}</div>`).join("")}
            </div>
            <div class="small upper" style="color:var(--muted); margin:12px 0 4px">payment method</div>
            ${have.length===0 ? `<p class="small" style="color:var(--muted)">${esc(a.display_name)} hasn't added a payment handle yet. <a href="#/artist/${esc(a.handle)}">tell them ↗</a></p>` :
              `<div class="pay-grid">
                ${have.map(k=>{
                  const labels = {venmo:"Venmo", cashapp:"Cash App", paypal:"PayPal", stripe_url:"Stripe", apple:"Apple Pay", zelle:"Zelle"};
                  const glyph  = {venmo:"V", cashapp:"$", paypal:"P", stripe_url:"S", apple:"", zelle:"Z"};
                  return `<div class="pay ${k} ${sel===k?"sel":""}" data-action="set-tip-method" data-method="${esc(k)}">
                    <span class="glyph">${esc(glyph[k]||"·")}</span>${esc(labels[k]||k)}</div>`;
                }).join("")}
              </div>`}
            ${detailHtml}
          </div>
        </div>
      </div>`;
  }
  if(modalState.type === "collab"){
    root.innerHTML = `
      <div class="modal-bg" data-action="close-modal">
        <div class="modal" onclick="event.stopPropagation()">
          <div class="modal-h"><span>✎ post a notice</span><span class="x" data-action="close-modal">×</span></div>
          <div class="modal-b">
            <form id="collab-form" autocomplete="off" style="display:grid; gap:8px">
              <div class="field-row"><label>kind</label>
                <select class="field" name="kind">
                  ${["vocalist","producer","visual","band","remix","writer","other"].map(k=>`<option value="${k}">${k}</option>`).join("")}
                </select></div>
              <div class="field-row"><label>title</label><input class="field" name="title" required placeholder="need a hushed vocal..."/></div>
              <label class="small upper">body
                <textarea class="field" name="body" required style="min-height:90px; width:100%" placeholder="describe the gig, what you offer, what you need."></textarea>
              </label>
              <div class="row" style="justify-content:flex-end">
                <button class="btn" type="button" data-action="close-modal">cancel</button>
                <button class="btn btn-hot" type="submit">post notice</button>
              </div>
            </form>
          </div>
        </div>
      </div>`;
    setTimeout(()=>document.getElementById("collab-form")?.addEventListener("submit", onCollabSubmit), 0);
  }
}

/* ── settings drawer ────────────────────────────────────────────────────── */
function renderSettings(){
  const t = state.tweaks;
  const radio = (lbl, key, opts) => `
    <div class="settings-radio">
      <div class="lbl">${esc(lbl)}</div>
      <div class="opts">
        ${opts.map(o=>`<button class="navlink ${t[key]===o?"active":""}" data-action="set-tweak" data-key="${esc(key)}" data-value="${esc(o)}" style="font:bold 11px/1 'Courier New'; padding:5px 8px; text-transform:uppercase">${esc(o)}</button>`).join("")}
      </div>
    </div>`;
  const toggle = (lbl, key) => `
    <label class="settings-row">
      <span>${esc(lbl)}</span>
      <input type="checkbox" ${t[key]?"checked":""} data-action="toggle-tweak" data-key="${esc(key)}"/>
    </label>`;
  const allHandles = Object.keys(state.profiles);
  const sw = (who) => `<button class="navlink ${state.current_user===who?"active":""}" data-action="switch-user" data-handle="${esc(who)}" style="font:bold 11px/1 'Courier New'; padding:5px 8px; text-transform:uppercase">@${esc(who)}</button>`;

  const session = isGuest()
    ? `<div class="settings-row" style="flex-direction:column; align-items:stretch; gap:6px">
         <span class="small" style="color:var(--muted)">you are browsing as <b>guest</b>.</span>
         <a class="btn btn-hot" href="#/signup" style="justify-content:center">+ create profile</a>
       </div>`
    : `<div class="settings-row" style="flex-direction:column; align-items:stretch; gap:6px">
         <span class="small" style="color:var(--muted)">signed in as <b>@${esc(me().handle)}</b> · ${esc(me().role)}</span>
         <button class="btn" data-action="log-out">log out</button>
       </div>`;

  const roleSwitch = isGuest() ? "" : `
    <div class="settings-section">role</div>
    <div class="settings-radio">
      <div class="lbl">i am a</div>
      <div class="opts">
        <button class="navlink ${me().role==="listener"?"active":""}" data-action="${me().role==="listener"?"":"become-listener"}" style="font:bold 11px/1 'Courier New'; padding:5px 8px; text-transform:uppercase">listener</button>
        <button class="navlink ${me().role==="artist"?"active":""}" data-action="${me().role==="artist"?"":"become-artist"}" style="font:bold 11px/1 'Courier New'; padding:5px 8px; text-transform:uppercase">artist</button>
      </div>
    </div>`;

  return `
    <div class="settings-section">session</div>
    ${session}
    ${roleSwitch}
    ${radio("theme","skin",["bubblegum","cassette","hacker","sunset"])}
    <div class="settings-section">extras</div>
    ${toggle("marquee on","marquee")}
    ${toggle("construction banner","construction")}
    ${toggle("sparkle cursor","sparkleCursor")}
    ${toggle("show demo content","showDemo")}
    <div class="settings-section">switch user</div>
    <div class="settings-radio"><div class="opts">
      ${allHandles.map(sw).join("")}
    </div></div>
    <div class="settings-section">data</div>
    <div class="settings-row">
      <button class="btn" data-action="reset-state">reset all data</button>
    </div>
  `;
}

/* ── routing ────────────────────────────────────────────────────────────── */
function parseHash(){
  const h = (location.hash || "#/").slice(1);
  const parts = h.split("/").filter(Boolean);
  return { route: parts[0]||"", arg: parts[1]||"" };
}

function render(){
  const { route, arg } = parseHash();
  // body chrome from tweaks
  document.body.dataset.skin = state.tweaks.skin;
  document.body.dataset.marquee = state.tweaks.marquee ? "on" : "off";
  document.body.dataset.construction = state.tweaks.construction ? "on" : "off";
  document.body.dataset.cursor = state.tweaks.sparkleCursor ? "sparkle" : "default";
  document.body.dataset.playing = state.player.playing ? "true" : "false";

  document.getElementById("nav").innerHTML = navHtml();
  document.getElementById("ticker-roll").innerHTML = tickerHtml();
  document.getElementById("player").innerHTML = renderPlayer();
  document.getElementById("settings-body").innerHTML = renderSettings();

  // Guests get the welcome screen for everything except the artist profile
  // page (so shareable links still work) and the signup form itself.
  if (isGuest() && route !== "artist" && route !== "signup" && route !== "digs" && route !== "collab" && route !== "map") {
    document.getElementById("app").innerHTML = renderWelcome();
    attachForms();
    renderModal();
    return;
  }

  let html = "";
  switch(route){
    case "":          html = isGuest() ? renderWelcome() : renderHome(); break;
    case "signup":    html = renderSignup(); break;
    case "digs":      html = `<div class="grid">${sidebarHtml()}<main>${renderDigs()}</main></div>`; break;
    case "collab":    html = `<div class="grid">${sidebarHtml()}<main>${renderCollab()}</main></div>`; break;
    case "map":       html = renderMap(); break;
    case "upload":    html = renderUpload(); break;
    case "me":        html = isGuest() ? renderWelcome() : renderMe(); break;
    case "artist":    html = renderArtist(arg); break;
    default:          html = isGuest() ? renderWelcome() : renderHome();
  }
  document.getElementById("app").innerHTML = html;

  // post-render
  if(route === "map") initMap();
  attachForms();
  renderModal();
}

/* ── d3 scene map ───────────────────────────────────────────────────────── */
let _mapInited = false;
function initMap(){
  const container = document.getElementById("mil-map");
  if(!container) return;
  const svgEl = document.getElementById("mil-svg");
  if(!svgEl) return;

  const w = container.clientWidth || 1000;
  const h = container.clientHeight || 500;
  const svg = d3.select(svgEl).attr("viewBox", `0 0 ${w} ${h}`).attr("preserveAspectRatio","xMidYMid meet");
  svg.selectAll("*").remove();

  const projection = d3.geoNaturalEarth1().scale(160).translate([w/2, h/2]);
  const path = d3.geoPath(projection);

  // root group for zoom/pan
  const g = svg.append("g");

  // sphere outline
  g.append("path")
    .datum({type:"Sphere"})
    .attr("class","mil-sphere")
    .attr("d", path);

  // graticule
  const graticule = d3.geoGraticule().step([15,15]);
  g.append("path")
    .datum(graticule())
    .attr("class","mil-graticule")
    .attr("d", path);

  // equator highlight
  g.append("path")
    .datum({type:"LineString", coordinates:[[-180,0],[-90,0],[0,0],[90,0],[180,0]]})
    .attr("class","mil-equator")
    .attr("d", path);

  // load and draw land
  const tipDiv = d3.select(container).selectAll(".mil-tip").data([0]).join("div").attr("class","mil-tip").style("display","none");

  d3.json("https://unpkg.com/world-atlas@2.0.2/countries-110m.json")
    .then(world => {
      const land = topojson.feature(world, world.objects.land);
      g.insert("path", ":first-child")
        .datum(land)
        .attr("class","mil-land")
        .attr("d", path);
    })
    .catch(()=>{ /* offline / blocked — graticule still shows */ });

  // pins
  const pins = g.append("g").attr("class","mil-pins");
  state.scenes.forEach(s=>{
    const pt = projection([s.lng, s.lat]);
    if(!pt) return;
    const r = s.artists>=20 ? 8 : s.artists>=10 ? 6 : s.artists>=5 ? 4 : 3;
    const color = s.growth>=25 ? "#ff2e93" : s.growth>=15 ? "#caff00" : "#00d4ff";
    const cls = s.growth>=25 ? "fast" : s.growth>=15 ? "med" : "";
    const pin = pins.append("g").attr("class", `mil-pin ${cls}`).attr("transform", `translate(${pt[0]},${pt[1]})`);
    pin.append("circle").attr("class","pulse").attr("r", r).attr("stroke", color);
    pin.append("circle").attr("class","core").attr("r", r).attr("fill", color);
    if(s.artists>=10){
      g.append("text").attr("class","mil-label")
        .attr("x", pt[0]+r+4).attr("y", pt[1]+3)
        .text(s.name.toUpperCase());
    } else if(s.artists>=5){
      g.append("text").attr("class","mil-label dim")
        .attr("x", pt[0]+r+4).attr("y", pt[1]+3)
        .text(s.name.toUpperCase());
    }
    pin
      .on("mouseenter", function(ev){
        const cr = container.getBoundingClientRect();
        tipDiv
          .style("display","block")
          .style("left", (ev.clientX - cr.left)+"px")
          .style("top",  (ev.clientY - cr.top)+"px")
          .html(`<div><b>${s.name}</b></div>
                 <div class="ln"></div>
                 <div class="row"><span>artists</span><span class="v">${s.artists}</span></div>
                 <div class="row"><span>growth /wk</span><span class="v" style="color:${color}">+${s.growth}%</span></div>
                 <div class="row"><span>lat / lng</span><span class="v">${s.lat.toFixed(1)} / ${s.lng.toFixed(1)}</span></div>`);
      })
      .on("mousemove", function(ev){
        const cr = container.getBoundingClientRect();
        tipDiv.style("left", (ev.clientX - cr.left)+"px")
              .style("top",  (ev.clientY - cr.top)+"px");
      })
      .on("mouseleave", ()=> tipDiv.style("display","none"));
  });

  // zoom/pan
  const zoom = d3.zoom()
    .scaleExtent([0.5, 8])
    .on("zoom", (ev)=> g.attr("transform", ev.transform));
  svg.call(zoom).on("dblclick.zoom", null);
  svg.on("mousedown", function(){ svgEl.classList.add("dragging"); });
  svg.on("mouseup", function(){ svgEl.classList.remove("dragging"); });

  // map control buttons
  document.querySelectorAll('[data-action="map-reset"]').forEach(btn => btn.onclick = ()=> svg.transition().call(zoom.transform, d3.zoomIdentity));
  document.querySelectorAll('[data-action="map-zoom"]').forEach(btn => btn.onclick = ()=>{
    const dir = btn.dataset.z === "in" ? 1.5 : 1/1.5;
    svg.transition().call(zoom.scaleBy, dir);
  });

  _mapInited = true;
}

/* ── event delegation ──────────────────────────────────────────────────── */
document.addEventListener("click", function(e){
  // close any open settings drawer when clicking outside
  const drawer = document.getElementById("settings-drawer");
  const toggle = document.getElementById("settings-toggle");
  if(drawer && !drawer.hidden && !drawer.contains(e.target) && !toggle.contains(e.target)){
    drawer.hidden = true;
  }

  const t = e.target.closest("[data-action]");
  if(!t) return;
  const a = t.dataset.action;

  switch(a){
    case "play-track": {
      const id = t.dataset.track;
      state.player = { track_id: id, playing: true };
      saveState(); render();
      break;
    }
    case "toggle-play":
      state.player.playing = !state.player.playing && !!state.player.track_id;
      saveState(); render();
      break;
    case "next-track":
    case "prev-track": {
      const list = visibleTracks();
      if(list.length===0) break;
      const idx = list.findIndex(x=>x.id===state.player.track_id);
      const next = a==="next-track" ? list[(idx+1+list.length)%list.length] : list[(idx-1+list.length)%list.length];
      state.player = { track_id: next.id, playing: true };
      saveState(); render();
      break;
    }
    case "random-track": {
      const list = visibleTracks();
      if(list.length===0) break;
      const next = list[Math.floor(Math.random()*list.length)];
      state.player = { track_id: next.id, playing: true };
      saveState(); render();
      break;
    }
    case "lucky-dip": {
      const artists = visibleProfiles().filter(p=>p.role==="artist");
      const a2 = artists[Math.floor(Math.random()*artists.length)];
      if(a2) location.hash = `#/artist/${a2.handle}`;
      break;
    }
    case "goto-artist":
      location.hash = `#/artist/${t.dataset.handle}`;
      break;
    case "set-filter":
      digsFilters[t.dataset.key] = t.dataset.value;
      render();
      break;
    case "follow":
      state.follows.push({follower: state.current_user, artist: t.dataset.handle});
      saveState(); render();
      break;
    case "unfollow":
      state.follows = state.follows.filter(f => !(f.follower===state.current_user && f.artist===t.dataset.handle));
      saveState(); render();
      break;
    case "save":
      state.saves.push({profile: state.current_user, track: t.dataset.track});
      saveState(); render();
      break;
    case "unsave":
      state.saves = state.saves.filter(s => !(s.profile===state.current_user && s.track===t.dataset.track));
      saveState(); render();
      break;
    case "open-tip": openTipModal(t.dataset.handle); break;
    case "close-modal": closeModal(); break;
    case "set-tip-amount":
      modalState.amount = +t.dataset.v; renderModal(); break;
    case "set-tip-method":
      modalState.method = t.dataset.method; renderModal(); break;
    case "confirm-tip":
      // log it; the link's default behavior opens the deep link in a new tab
      state.tips.push({from: state.current_user, to: t.dataset.handle, amount: +t.dataset.amount, at: Date.now()});
      saveState();
      setTimeout(()=>{ closeModal(); }, 50);
      break;
    case "open-collab-form": openCollabForm(); break;
    case "reply-collab": {
      const id = t.dataset.id;
      const c = state.collabs.find(x=>x.id===id);
      if(c){ c.replies = (c.replies||0)+1; saveState(); render(); }
      break;
    }
    case "become-artist":
      state.profiles[state.current_user].role = "artist";
      saveState(); render();
      break;
    case "become-listener":
      state.profiles[state.current_user].role = "listener";
      saveState(); render();
      break;
    case "delete-track":
      state.tracks = state.tracks.filter(x=>x.id!==t.dataset.id);
      saveState(); render();
      break;
    case "switch-user":
    case "login-demo": {
      const h = t.dataset.handle;
      if(state.profiles[h]){
        state.current_user = h; saveState();
        location.hash = "#/";
        render();
      }
      break;
    }
    case "log-out":
      state.current_user = null;
      saveState();
      location.hash = "#/";
      render();
      break;
    case "open-login-list":
      e.preventDefault();
      document.getElementById("settings-drawer").hidden = false;
      // flash the switch-user section so it's obvious where to go
      setTimeout(()=>{
        const drawer = document.getElementById("settings-drawer");
        drawer?.scrollTo({ top: drawer.scrollHeight, behavior: "smooth" });
      }, 50);
      break;
    case "set-tweak":
      state.tweaks[t.dataset.key] = t.dataset.value;
      saveState(); render();
      break;
    case "toggle-tweak":
      state.tweaks[t.dataset.key] = !state.tweaks[t.dataset.key];
      saveState(); render();
      break;
    case "close-settings":
      document.getElementById("settings-drawer").hidden = true;
      break;
    case "reset-state":
      if(confirm("reset all local data? (seed data will return; your additions go away)")){
        localStorage.removeItem(STORAGE_KEY);
        state = loadState();
        render();
      }
      break;
  }
});

document.getElementById("settings-toggle").addEventListener("click", function(){
  const d = document.getElementById("settings-drawer");
  d.hidden = !d.hidden;
});

/* ── form handlers ─────────────────────────────────────────────────────── */
function attachForms(){
  const upload = document.getElementById("upload-form");
  if(upload) upload.addEventListener("submit", onUploadSubmit);
  const profile = document.getElementById("profile-form");
  if(profile) profile.addEventListener("submit", onProfileSubmit);
  const signup = document.getElementById("signup-form");
  if(signup){
    signup.addEventListener("submit", onSignupSubmit);
    // toggle the "your first track" fieldset based on role select
    const roleSel = signup.querySelector('[name="role"]');
    const trackFs = signup.querySelector('#signup-track-fields');
    if(roleSel && trackFs){
      const sync = () => { trackFs.style.display = roleSel.value === "artist" ? "" : "none"; };
      roleSel.addEventListener("change", sync); sync();
    }
  }
}

function detectEmbedKind(url){
  const u = (url||"").toLowerCase();
  if(u.includes("bandcamp.com")) return "bandcamp";
  if(u.includes("soundcloud.com")) return "soundcloud";
  if(u.includes("youtube.com") || u.includes("youtu.be")) return "youtube";
  if(u.includes("mixcloud.com")) return "mixcloud";
  if(u.includes("spotify.com")) return "spotify";
  return "external";
}

function onUploadSubmit(e){
  e.preventDefault();
  const fd = new FormData(e.target);
  const url = (fd.get("embed_url")||"").trim();
  const id = "t"+Math.random().toString(36).slice(2,8);
  const newTrack = {
    id,
    artist_handle: state.current_user,
    title: fd.get("title").toString().trim() || "untitled",
    embed_kind: detectEmbedKind(url),
    embed_url: url,
    cover_art: fd.get("cover_art")?.toString() || "art1",
    note: fd.get("note")?.toString() || "",
    genre: fd.get("genre")?.toString() || "",
    tags: (fd.get("tags")?.toString()||"").split(",").map(s=>s.trim()).filter(Boolean),
    price_label: fd.get("price_label")?.toString() || "name your price",
    open_to: [],
    published_at: Date.now(),
  };
  state.tracks.unshift(newTrack);
  saveState(); render();
}

function onProfileSubmit(e){
  e.preventDefault();
  const fd = new FormData(e.target);
  const u = me();
  const newHandle = fd.get("handle").toString().trim() || u.handle;
  const newProfile = {
    ...u,
    handle: newHandle,
    display_name: fd.get("display_name")?.toString() || u.display_name,
    bio: fd.get("bio")?.toString() || "",
    city: fd.get("city")?.toString() || "",
    country: fd.get("country")?.toString() || "",
    flag: fd.get("flag")?.toString() || "",
    i_am: fd.get("i_am")?.toString() || "",
    i_offer: (fd.get("i_offer")?.toString()||"").split(",").map(s=>s.trim()).filter(Boolean),
    i_need:  (fd.get("i_need")?.toString()||"").split(",").map(s=>s.trim()).filter(Boolean),
    bandcamp_url:   fd.get("bandcamp_url")?.toString() || "",
    soundcloud_url: fd.get("soundcloud_url")?.toString() || "",
    website_url:    fd.get("website_url")?.toString() || "",
    atproto_handle: fd.get("atproto_handle")?.toString() || "",
    payment_handles: {
      venmo:      fd.get("ph_venmo")?.toString() || "",
      cashapp:    fd.get("ph_cashapp")?.toString() || "",
      paypal:     fd.get("ph_paypal")?.toString() || "",
      stripe_url: fd.get("ph_stripe_url")?.toString() || "",
      zelle:      fd.get("ph_zelle")?.toString() || "",
      apple:      fd.get("ph_apple")?.toString() || "",
    },
  };
  if(newHandle !== u.handle){
    delete state.profiles[u.handle];
    // rewrite refs
    state.tracks.forEach(t=>{ if(t.artist_handle===u.handle) t.artist_handle = newHandle; });
    state.follows.forEach(f=>{ if(f.follower===u.handle) f.follower = newHandle; if(f.artist===u.handle) f.artist = newHandle; });
    state.saves.forEach(s=>{ if(s.profile===u.handle) s.profile = newHandle; });
    state.tips.forEach(t=>{ if(t.from===u.handle) t.from = newHandle; if(t.to===u.handle) t.to = newHandle; });
    state.collabs.forEach(c=>{ if(c.author===u.handle) c.author = newHandle; });
    state.current_user = newHandle;
  }
  state.profiles[newHandle] = newProfile;
  saveState(); render();
}

function onSignupSubmit(e){
  e.preventDefault();
  const err = document.getElementById("signup-error");
  const showErr = (msg) => { if(err){ err.style.display = "block"; err.textContent = msg; } };
  const fd = new FormData(e.target);
  const handle = (fd.get("handle")||"").toString().trim().toLowerCase();
  if (!/^[a-z0-9_\-\.]{2,24}$/.test(handle)){
    showErr("handle must be 2–24 chars: lowercase letters, digits, _ - or ."); return;
  }
  if (state.profiles[handle]){
    showErr(`@${handle} already exists. pick another, or sign in via the tweaks drawer.`); return;
  }
  const role = fd.get("role")?.toString() === "artist" ? "artist" : "listener";
  const list = (k) => (fd.get(k)?.toString()||"").split(",").map(s=>s.trim()).filter(Boolean);
  const newProfile = {
    handle,
    role,
    display_name: (fd.get("display_name")?.toString().trim()) || handle,
    bio: fd.get("bio")?.toString() || "",
    city: fd.get("city")?.toString() || "",
    country: fd.get("country")?.toString() || "",
    flag: fd.get("flag")?.toString() || "",
    lat: 0, lng: 0,  // could geocode later
    taste: {},
    i_offer: list("i_offer"),
    i_need:  list("i_need"),
    i_am: role,
    prefs: { sizeMax: 500, near: 5000, languages: ["en","any"] },
    payment_handles: {
      venmo:      fd.get("ph_venmo")?.toString() || "",
      cashapp:    fd.get("ph_cashapp")?.toString() || "",
      paypal:     fd.get("ph_paypal")?.toString() || "",
      stripe_url: fd.get("ph_stripe_url")?.toString() || "",
    },
    bandcamp_url:   fd.get("bandcamp_url")?.toString() || "",
    soundcloud_url: fd.get("soundcloud_url")?.toString() || "",
    website_url:    fd.get("website_url")?.toString() || "",
    atproto_handle: fd.get("atproto_handle")?.toString() || "",
    created_at: Date.now(),
  };
  state.profiles[handle] = newProfile;
  state.current_user = handle;

  // if artist & first-track URL provided, ship it immediately so they can see
  // the embed working on their freshly minted profile page
  let firstTrackId = null;
  if (role === "artist") {
    const url = (fd.get("first_track_url")||"").toString().trim();
    if (url) {
      firstTrackId = "t" + Math.random().toString(36).slice(2,8);
      state.tracks.unshift({
        id: firstTrackId,
        artist_handle: handle,
        title: fd.get("first_track_title")?.toString().trim() || "untitled",
        embed_kind: detectEmbedKind(url),
        embed_url: url,
        cover_art: fd.get("first_track_art")?.toString() || "art1",
        note: fd.get("first_track_note")?.toString() || "",
        genre: fd.get("first_track_genre")?.toString() || "",
        tags: list("first_track_tags"),
        price_label: fd.get("first_track_price")?.toString() || "name your price",
        open_to: [],
        published_at: Date.now(),
      });
    }
  }
  saveState();
  // route them to their fresh profile so they see the embed (or to /me)
  location.hash = role === "artist" ? `#/artist/${handle}` : `#/me`;
  render();
}

function onCollabSubmit(e){
  e.preventDefault();
  if(me().role !== "artist"){ alert("Become an artist to post."); return; }
  const fd = new FormData(e.target);
  state.collabs.unshift({
    id: "c"+Math.random().toString(36).slice(2,8),
    author: state.current_user,
    kind: fd.get("kind")?.toString() || "other",
    title: fd.get("title")?.toString().trim() || "untitled",
    body: fd.get("body")?.toString().trim() || "",
    replies: 0,
    created_at: Date.now(),
  });
  saveState(); closeModal();
}

/* ── boot ──────────────────────────────────────────────────────────────── */
window.addEventListener("hashchange", () => { window.scrollTo(0,0); render(); });
render();

// re-init the d3 map on viewport resize so it fills its container
window.addEventListener("resize", () => {
  if (parseHash().route === "map") initMap();
});

// register service worker (PWA install + offline)
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js").catch(() => { /* HTTP-only host? fine, it's optional */ });
  });
}
