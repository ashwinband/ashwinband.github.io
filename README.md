# ashwin_webpage

A four-page site for **ASHWIN**, the songwriting project. Hand-built, no framework,
no build step: open `index.html` in a browser and it works.

## Pages

| File | What it is |
|---|---|
| `index.html` | Full-bleed crest hero, the three pillars (music / words / voices), the album, the two released songs, and three doors into the rest |
| `crest.html` | What the name and emblem mean: the Ashwin twins, the two horses, the four quarters of the shield, the Arabic motto |
| `music.html` | সমর্পণ (Shomorpon): the record, and both released songs with full Bangla lyrics and credits |
| `family.html` | Profiles — Syed Mehedi Hasan and Nafees Fahmi Ali, then Shanila Islam and Samir Hafiz |

Shared: `assets/site.css` (one committed dark theme) and `assets/site.js`
(nav highlighting + reveal-on-scroll). Fonts come from Google Fonts:
Cormorant Garamond (display), EB Garamond (body), Noto Serif Bengali, Noto Naskh Arabic.

## Design

Crimson velvet and parchment gold, taken straight off the album art. Colours, type
and spacing are CSS custom properties at the top of `assets/site.css` — change them
there, never inline. The page has **one** theme on purpose; a light mode would fight
the artwork.

Key classes: `.hero`, `.phead`, `.sechead`, `.pillars/.pillar`, `.plate`, `.split`,
`.band` (cinematic full-width image band), `.releases/.rel`, `.lyr` (lyrics
disclosure), `.people/.person`, `.quarters/.quarter`, `.doors/.door`, `.gallery`,
`.facts`, `.quote`, `.chip`, `.btn`, `.rule`.

## Images

Everything in `assets/img/` is generated from
`/home/syed/music_creation/album1-demos/walls/` with ImageMagick:

- `crest-gold.png` / `crest-ink.png` — the crest from `ashwin_wallpaper.jpg`, white
  knocked out to alpha, recoloured. `wordmark-gold.png` is the ASHWIN logotype alone
  (top 282px), `crest-mark.png` the horses-and-shield below it.
- `velvet.jpg` — a clean crop of the crimson velvet with **no crest in it**,
  desaturated and darkened; it tiles behind every page via `body::before`.
- `band-*.jpg` — wide strips cropped from the **bottom** of the scene artworks so the
  সমর্পণ lettering baked into those images does not collide with page headings. These are
  the only form of the scene artwork the site uses, in `.band__bg` and `.door__bg`.
- `crest-parchment.jpg` / `crest-plate.jpg` / `crest-black.jpg` — the mark alone in its
  three finishes, for `crest.html`. That page shows the crest and logotype only; the album
  art belongs on `music.html`.
- `crest-ink.png` and `wordmark-parchment.jpg` are build inputs for `crest-parchment.jpg`,
  not referenced by any page. Everything else in `assets/img/` is referenced; regenerate
  any of it from `walls/` with the commands above.
- `artist-*.jpg` — 700×700, cropped on the face. Nafees's is from `walls/nefees_pic.jpg`.

## Who writes first

**Do not write that the lyrics always come first.** About half the songs begin as Nafees's
Bangla with the music built to carry it; the rest begin as a melody of Syed's that the words
are written into. Four places on the site used to claim lyrics-first and were corrected:
the first quarter on `crest.html`, the Words pillar on `index.html`, the album blurb on
`music.html`, and Nafees's profile on `family.html`. Also: **never use "god"/"gods"/
"deities"** for the Ashwin twins — the word is **"entities"**.

## Still to do

- **Clear the third-party material with the people in it.** Shanila's and Samir's
  photos are their public YouTube channel avatars; their bios come from their published
  interviews, channel pages and public LinkedIn/Facebook profiles, and Shanila's card
  quotes a public Facebook post of hers about the single. Nafees's professional line
  comes from his LinkedIn. All of it is public, none of it is cleared — ask them before
  this goes live. A better press photo of Shanila would also improve her card.
- Add songs to `music.html` as the rest of সমর্পণ is released: copy one
  `<article class="rel">` block, add the cover to `assets/img/`, paste the lyrics.

## Type scale and mobile

Body text is `clamp(1.12rem, 1.45vw, 1.26rem)` — **20.2px** at desktop, **17.9px** on a phone —
and no text anywhere on any page computes below 12px. If you resize anything, keep that floor.
Bengali is never italicised (`em[lang="bn"] { font-style: normal }`): the face has no italic, so
the browser skews it and the overhang swallows the following space.

Verified with no horizontal overflow at 1385px, 485px and a true 390px viewport. Every
multi-column grid collapses to one column below its breakpoint (620–900px), the nav swaps to the
`.mnav` strip under 760px, and song art goes full-bleed on a phone.

## Deep links to profiles

Each profile card on `family.html` carries an id (`#syed`, `#nafees`, `#shanila`, `#samir`) and
every name on the front page links to one. Two things keep those links landing in the right
place, and breaking either will silently break them:

- **Every `<img>` must keep its `width`/`height`.** Without them the page is short when the
  browser resolves the hash, and the jump lands hundreds of pixels above the card.
- **`site.js` re-aims at the hash** after webfonts settle, because the text reflows taller. It
  cancels on a real gesture (wheel/touch/key/mousedown), never on a change in scroll position —
  the browser moves the page itself while resolving a hash, so watching `scrollY` makes the
  correction cancel itself.

Headless Chrome cannot verify this: it does not repaint after a programmatic scroll, and its
timing under `--virtual-time-budget` varies run to run. Check it by clicking a link in a browser.

## Checking a change

```
google-chrome --headless=new --disable-gpu --hide-scrollbars \
  --virtual-time-budget=16000 --window-size=1400,5600 \
  --screenshot=OUT.png "file://$PWD/index.html"
```

**Two traps that will waste your time.** First, if you copy `assets/` into a scratch directory to
build a test page, that copy goes stale and the page you measure is not the page you edited —
re-copy it, or point the test at the real files. Second, Chrome's headless window has a minimum
width of about 500px, so you cannot screenshot a 390px viewport directly; put the page in a
390px-wide `<iframe>` inside a wider window instead, which gives the iframe its own viewport and
evaluates the media queries correctly.

Keep `--virtual-time-budget` high: `.reveal` elements start at `opacity:0` and are
faded in by `assets/site.js`, so without it the page screenshots mostly empty. Note
that **programmatic scrolling before a headless screenshot does not repaint reliably**
— render the whole page in one tall window instead (the hero is capped at `56rem`, so
a tall window does not distort it). Check 390–500px wide too.

## Publishing

Not published anywhere yet. It is a plain static site, so any host works; GitHub Pages
would be the obvious one, the same way `smhrobi.github.io` is set up.
