# Live portfolio evaluation and redesign brief

Reviewed: 24 September 2026

Site: https://shaurya609.github.io/About-me/

## Intended direction

The website began as a learning project for HTML, CSS, Bootstrap, and JavaScript. Its purpose is to let visitors learn about Shaurya through education, skills, work experience, designs, and hobbies. The next version should be a premium, polished personal portfolio that retains this breadth and personality.

Hovering over an artist to hear their music is an intentional feature to preserve. It should be improved, with touch and keyboard alternatives, rather than removed. Template selection is deferred to the user. No visual template, framework migration, content deletion, or deployment is approved or implemented by this evaluation.

## What was tested

All eight live pages were opened and visually inspected at desktop width. Image element completion and intrinsic image dimensions were checked after loads settled. Section pages were also checked at a 390px viewport; homepage mobile behavior was covered in the earlier local audit using matching source. Targeted HTTP requests checked representative failed images, a missing stylesheet, and all 12 live audio URLs.

Counts below describe this browser session, not an assurance that every browser or network behaves identically. They count image elements, including images in hidden dialogs/carousels and repeated uses of the same URL. Background images and favicons are excluded. No Lighthouse score or comprehensive accessibility certification was generated.

## Broken image inventory

| Page | Failed image elements | Total image elements | Observation |
| --- | ---: | ---: | --- |
| Home | 0 | 20 | Large assets were slow to finish, but all eventually loaded. |
| Education | 0 | 15 | School and certificate images loaded. |
| Skills | 0 | 17 | Skill logos loaded. |
| Work experience | 2 | 15 | One Drive image and one 99acres image failed. |
| Designs | 4 | 33 | Failed Drive artwork and tool icons; one artwork URL is used twice. |
| Reading | 28 | 37 | Most book/series imagery failed. |
| Gaming | 13 | 28 | External logo failures plus five explicitly empty image sources. |
| Music | 7 | 17 | Seven artist images hosted through Drive failed. |
| Total | 54 | 182 | Approximately 30% of image elements failed in this session. |

The live site is more complete than the current laptop folder. All eight pages are reachable. Missing local pages should not be described as broken live navigation.

## Why images fail

### Google Drive embedding restrictions

Drive image URLs repeatedly failed inside the live pages. However, direct HEAD requests to sampled artist, reading, and background URLs returned HTTP 200 with image content types. The sampled Zhu image redirects to drive.usercontent.google.com and responds with `Cross-Origin-Resource-Policy: same-site`. GitHub Pages is a different site, so this is a concrete embedding restriction even though the file exists.

Do not assume every failed Drive file has been deleted. Some originals may be recoverable. The preferred repair is to recover the intended originals, optimize them, and serve them as stable website assets. Do not rely on rotating Drive URL formats as the long-term asset strategy.

Reference: https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Cross-Origin-Resource-Policy

### Dead external URLs

The tested 99acres property image and Asterix logo returned HTTP 404. These require an updated source or replacement asset. Other third-party failures were observed in the browser, but their individual server-side causes were not all diagnosed.

### Empty image sources

Five Gaming image elements have `src=""`. These cannot display their intended artwork. Supply the intended image or deliberately remove the image element while retaining the game name and a designed fallback. These are content/reference omissions rather than third-party availability problems.

### Background failure also damages readability

Reading, Gaming, and Music lose their intended Drive-hosted header/background imagery. In Gaming, the white title remains on a pale gray header and becomes difficult to read. Some cards rely on artwork to communicate the game identity; failed artwork can leave only a genre or an almost blank card.

Every redesigned card should have a real text title, stable dimensions, and a readable fallback. A missing image must not make the content or label disappear.

## Music: preserve the interaction, repair the implementation

All 12 live song requests return HTTP 404 because the page requests `/Music/...` instead of `/About-me/Music/...`. The tested Zhu file returns HTTP 200 when requested under the correct project path. This is now a confirmed live deployment defect, rather than the conditional concern in the source audit.

Recommended interaction contract for the redesign:

- Desktop: hovering an artist card previews that artist's track after sound has been enabled by the visitor.
- Provide an obvious one-time “Enable music previews” action because browser autoplay policies can block audible playback before user activation.
- Touchscreen and keyboard: provide a labeled preview button with equivalent behavior.
- Show the artist, track, and playing state; provide a mute/stop control.
- Only one preview plays at a time. Entering child elements must not restart playback; use pointer entry/exit behavior appropriate to the whole card.
- Stop or fade when leaving the card and when navigating away. Avoid downloading every full song merely to display the page.

This keeps the original personality while making the feature understandable and dependable. Audible hover playback was not verified end-to-end because the current source URLs are broken.

## Visual and content evaluation

### Home

The current introduction repeatedly announces that this is a website about you, but gives little immediate orientation to who you are today. Large headings and textured backgrounds occupy most of the first screen. The six interests are useful content, but they need clearer hierarchy and shorter previews.

Direction: a concise introduction, a distinctive personal image or visual treatment, and clear routes into your experience, selected work, and interests. Keep the personal story and hobbies visible.

### Education

The images work, and the chronological story has personal value. Oversized headings and paragraphs make it lengthy to scan. At phone width, the qualifications table is about 844px wide inside a correctly scrollable wrapper; this is not page-wide overflow, but a more compact presentation would be easier to read.

Direction: an education timeline, concise summaries, and a certificate viewer. Retain longer personal stories as optional detail after reviewing their wording.

### Skills

The logos work, but each skill is a large biography-style card. This produces a long page and gives self-rated proficiency greater prominence than evidence.

Direction: group skills by discipline, highlight current strengths, and connect them to real work. Keep learning stories where they contribute to the personal narrative.

### Work experience

This page contains substantial material for the portfolio: graphic design, teaching, operations, and sales. Company descriptions currently occupy space that could better explain your own responsibilities and achievements. Some role dates and present-tense descriptions need reconciliation.

Direction: current role first, consistent dates, concise role summaries, and verified outcomes. Add metrics only when supplied or confirmed by you.

### Designs

The gallery contains genuine work worth showcasing, and most locally hosted artwork loads. The strongly textured purple background competes with the artwork. Thumbnails and tool icons provide little project context.

Direction: a quiet gallery surface with consistent image framing, titles, and short project stories. A larger image view should include your contribution and the tools used.

### Reading

This is the most visibly damaged page: 28 of 37 image elements fail. The large catalog and plot summaries show your interests, but your personal perspective is often less prominent than the story synopsis.

Direction: a curated bookshelf with restored covers, favorites, and brief personal notes. Longer descriptions can sit behind an intentional expansion or detail view.

### Gaming

Artwork failures, empty sources, mixed backgrounds, and inconsistent card text make the grid difficult to scan. Long names wrap awkwardly, and white text loses contrast when backgrounds fail.

Direction: consistent covers, explicit game titles, restrained overlays, and a short note about why each favorite matters to you. Keep motion subtle and ensure cards remain readable without artwork.

### Music

The hover-preview idea is a distinctive part of this portfolio. Broken portraits and missing audio currently hide its value.

Direction: a coherent artist grid with restored portraits, visible preview affordances, and a small playing indicator. Preserve hover previews with reliable fallback controls.

## What “premium” should mean for this project

1. One coherent visual system across every section: typography, spacing, palette, image framing, navigation, and motion.
2. A clear opening that explains who you are today, followed by deeper professional and personal material.
3. Strong content editing that preserves your voice and factual history.
4. Fast, dependable media with graceful fallbacks.
5. Deliberate interactions, including the artist previews, that work across input methods.
6. Careful phone layouts, legible text, and consistent accessibility.

The main gap is broader than replacing broken images. The site needs visual consistency and editorial hierarchy, while preserving its personal breadth.

## Preparation before choosing a template

- Recover a healthy checkout while preserving the existing laptop folder.
- Inventory and recover artwork, artist portraits, book covers, and game imagery; distinguish recoverable originals from assets requiring replacement.
- Confirm current biography, roles, dates, skills, contact links, and which existing work should be featured.
- Keep education, experience, skills, designs, and hobbies in the content plan. The final page structure can follow the selected design.
- Evaluate future templates against these actual content types and the music-preview requirement, not only the appearance of their homepage demo.

No site source files were changed or deployed during this follow-up. This document records the live baseline and the direction for later redesign work.
