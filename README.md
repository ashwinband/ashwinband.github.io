# ashwin_webpage

A five-page site for **ASHWIN**, the songwriting project. Hand-built, no framework,
no build step: open `index.html` in a browser and it works.

## Pages

| File | What it is |
|---|---|
| `index.html` | Full-bleed crest hero, the three pillars (music / words / voices), the album, the two released songs, and four doors into the rest |
| `crest.html` | What the name and emblem mean: the Ashwin twins, the two horses, the four quarters of the shield, the Arabic motto |
| `twins.html` | The divine twins behind the name: the Indo-European pattern, six cousin traditions, and the two horses read as medicine and science |
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
`.facts`, `.quote`, `.chip`, `.btn`, `.rule`, and for `twins.html` `.cousins/.cousin`
(tradition cards), `.roll` (the list of shared traits) and `.yoke/.yoked` (the two
horse panels).

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
- `horse-left.jpg` / `horse-right.jpg` — 560×690 portraits of the two rearing horses,
  cropped out of `walls/Ashwin Heraldic Crest on Crimson Velvet.png` at `268x330+536+212`
  and `268x330+1142+222` with a gradient fade over the bottom fifth. The crest is **not**
  symmetric: the right-hand horse sits further left than mirroring the left one suggests.
- `band-horses.jpg` — the door background for `twins.html`, `800x320+615+235` from the same
  file, darkened (`-modulate 72,72`). The crop deliberately starts below the ASHWIN logotype
  and stops above the Arabic banner: no lettering in a background image.

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

## Navigation

Above 760px the nav is the plain row of links it has always been: Home, The
Crest, The Two Horses, Music, The Family, Listen. Below 760px those links do
not fit, so they live behind one **hamburger button** in the topbar which opens
`<nav class="mnav">`, the same six pages one per row. There are no dropdown
panels and no sub-sections in the menu: one button, one list, pick a page.

- The bars are drawn in CSS (`.menubtn__b` plus its two pseudo-elements) rather
  than the `³0` glyph, which renders at a different weight in each face the
  site loads. They rotate into an X while the menu is open.
- `section[id], article[id]` carry `scroll-margin-top: 5.6rem`, so a deep link
  such as `family.html#syed` does not land with the heading under the sticky bar.
- The resize handler closes the menu only on a real **width** change. A bare
  resize listener also fires when a phone hides its address bar, which would
  shut the menu under the thumb reaching for it.
- Section ids exist on every page (`#whole #album #why #ways`, `#name #horses
  #shield #motto #mark`, `#pattern #cousins #treaty #yoke #lights #pair
  #living`, `#record #outnow #coming`, `#horses #voices #door`). The menu does
  not use them, but they are stable deep-link targets.

## Checking a change

```
google-chrome --headless=new --disable-gpu --hide-scrollbars \
  --virtual-time-budget=16000 --window-size=1400,5600 \
  --screenshot=OUT.png "file://$PWD/index.html"
```

**Anything that animates cannot be screenshotted as-is.** Under
`--virtual-time-budget` the timers advance but the transition clock does not, so
an element mid-transition is captured at its starting value and working UI looks
broken. Inject `<style>*,*::before,*::after{transition:none !important}</style>`
into a test copy and drive it with `.click()` from an inline script.

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

## The mythology on `twins.html`

Every claim on that page is sourced, and the sources are printed at the foot of it. The
comparative frame is West's *Indo-European Poetry and Myth* and Mallory and Adams; the
Vedic episodes (Vishpala's iron leg, Chyavana, Rijrashva, Bhujyu) are Rigveda 1.112–1.118
and 10.39; Dadhichi's horse head is the Jaiminiya Brahmana version; Tacitus on the Alcis is
*Germania* 43; Pliny on the two lights is *Natural History* 2.101. **Do not add a fact there
without a source**, and keep the rules: *Ashwin*, never *Ashvin*; *ashwa*, never *ashva*
(the Lithuanian `ašva` is that language's own spelling and stays); and **entities**, never
gods.

## Publishing

Live at <https://smhrobi.github.io/ashwin/> from the `main` branch of
`github.com/smhrobi/ashwin` (legacy Pages build, root, `.nojekyll`). A push is served in
about 30 seconds; check the public URL rather than assuming.
