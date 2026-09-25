# Portfolio design and audio update

The approved Hudson-inspired preview is now the actual homepage. All eight pages
share the cream palette, Castoro headings, Public Sans text, restrained borders,
responsive navigation and contact footer. The skills grid retains the selected
monochrome symbols and gold hover/selection treatment.

Education includes all seven original certificates; experience includes all four
companies, approved career descriptions and the existing supporting artwork. The design collection uses accessible
image dialogs. Reading retains the populated story cards and their descriptions
inside expandable summaries. Gaming retains all 24 games, with lazy-loaded art.
The original image files and optimized derivatives are preserved.

The music page now uses one shared audio element. Hover starts a track and leaving
stops it. A single player prevents overlapping tracks and lets the browser retain
audio permission across artist changes. If the browser blocks the first hover,
the page explains how to enable sound instead of swallowing the error. Enable
sound starts a preview inside a click gesture; subsequent hovers switch artists.
Play buttons also support touch and keyboard. Mute, native media controls and
visible playback/error status are available. Switching tabs stops playback.
No track is loaded on page entry. Browser autoplay restrictions still apply;
the implementation does not attempt to bypass them.

Validation:

- `python scripts/check_images.py`
- `python scripts/check_site.py`
- `node scripts/test_music.cjs`
- `node --check site.js` and `node --check music.js`
- Browser playback of all 12 artist tracks, hover switching and pointer-leave stop.
- Desktop/mobile layout checks across all eight pages, mobile menu and image dialog.

The career content includes the approved Wishup entry and refreshed FoodCham,
CampK12 and Madhyam descriptions, with year-only dates. The legacy design and
comparison page are included; approved legacy amendments are documented separately. `design-preview/` retains the approved reference. The old page-specific CSS
files remain in Git but are no longer loaded by the redesigned pages.
