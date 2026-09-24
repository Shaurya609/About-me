# Loading improvements

Measured against commit `da9405a`, September 24, 2026. Figures below sum each
page's unique image, favicon and linked CSS background files, in decimal MB.
These are asset sizes, not timed page loads or Lighthouse scores. Lazy loading
can further reduce the initial transfer; caching can reduce repeat transfers.

| Page | Before | After | Reduction |
| --- | ---: | ---: | ---: |
| Home | 71.09 MB | 1.29 MB | 98.2% |
| Work experience | 19.65 MB | 1.85 MB | 90.6% |
| Designs | 17.48 MB | 2.68 MB | 84.7% |
| Gaming | 15.46 MB | 5.47 MB | 64.6% |
| Education | 4.89 MB | 1.51 MB | 69.1% |
| Reading | 3.44 MB | 1.13 MB | 67.0% |
| Music | 1.22 MB | 0.71 MB | 41.7% |
| Skills | 1.12 MB | 0.52 MB | 53.3% |

## Changes

- Added 146 optimized assets, retaining all original images. Raster content uses
  WebP where smaller; favicons use small PNGs. Animated GIF and SVG assets remain.
- Content images are capped at 1600 pixels on the longest edge. Two homepage
  slideshow images displayed at 200 pixels use 400-pixel versions.
- Background images retain their dimensions so existing tiled backgrounds keep
  their appearance. Their compression reduces transfer size.
- Images after the first two in each document use native lazy loading. Images
  decode asynchronously and have intrinsic dimensions where previously absent.
- Scripts use `defer` in dependency order. Removed duplicate Bootstrap 5/Popper 2
  scripts from Education and Work Experience; their markup uses Bootstrap 4.
  Updated the remaining carousel attribute accordingly.
- Removed references to the missing `style.css` file.
- Music uses `preload="none"` and project-relative audio paths. Hover playback
  remains; enter/leave events avoid restarting songs when moving over child
  elements. Rejected playback promises are handled. Browser autoplay rules still
  apply and may require a click before hover playback is allowed.

## Maintenance and checks

`Images/optimized/manifest.json` maps each derivative to its original and records
dimensions and byte counts. With Pillow installed, regenerate derivatives with
`python scripts/optimize_images.py`. Python is only needed for maintenance;
GitHub Pages serves the generated assets directly.

Validated all 237 references with `python scripts/check_images.py`, decoded all
146 generated assets with Pillow, and loaded all 165 distinct referenced assets
successfully in the browser. Checked design zoom, navigation dropdown, mobile
menu, and work-experience slideshow controls. Gaming fits the mobile viewport.
All page text is preserved and all 12 audio source paths resolve locally.

Production timing should be measured after deployment on a cold cache and a
representative mobile connection. The existing layout and larger gaming/design
backgrounds remain candidates for the planned redesign.
