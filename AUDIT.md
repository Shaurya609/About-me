# About-me website audit

Date: 24 September 2026

Follow-up: See [LIVE-SITE-AUDIT.md](LIVE-SITE-AUDIT.md) for testing of the deployed GitHub Pages site and the clarified project direction. Hovering over an artist to preview their music is intentional and should be preserved; the concerns below concern reliability and alternative input methods, not removal of that feature.

## Scope and verdict

Reviewed the five local source files and all 17 HTML/CSS/JavaScript files on GitHub at commit `92bd85f7a49107815d7e7953c6942a116338b731`. The remote repository has eight HTML pages. The five local files match their remote counterparts after normalizing line endings. Browser checks covered the local homepage at desktop, 390px and 768px widths, and the music page at 390px.

This is a workable personal-site prototype, but it needs substantial performance, accessibility, reliability, and presentation improvements before serving as a polished professional portfolio. Its simple static architecture remains appropriate; a framework rewrite is unnecessary to fix the findings.

This was an audit, not a repair. Application files were not changed. No Lighthouse score, Core Web Vitals measurement, penetration test, or full WCAG certification was performed. Production hosting, security headers, cache configuration, and every external link were not verified.

## Local checkout integrity - resolve before development

The local `.git` directory lacks a HEAD file and Git reports that this is not a repository. Only index.html and music.html are present locally; education, skills, work experience, designs, reading, and gaming pages exist on GitHub but are missing locally. Images/background-skills.jpg and Images/teaching-bg.jpg are also missing locally but present remotely. The latter makes the coding card's white text appear on a white fallback background.

These are local-copy problems, not missing-page defects in GitHub. Preserve this directory and recover a complete clone into a separate directory, then compare any local work before replacing anything. The source comparison does not prove that missing Git history or omitted files contain no uncommitted work.

The supplied URL contains a trailing period. The working repository URL is https://github.com/Shaurya609/About-me.

## Prioritized findings

### 1. High: homepage images are extremely large

Evidence: index.html:133 loads Images/task2.jpg, which is 56,781,224 bytes (56.8 MB), into a 200 × 200 CSS-pixel carousel slot. Images/IMG_1683.JPG is 5.44 MB and Images/full_piz_ing.jpg is 4.49 MB. Unique local image files referenced by homepage img elements total 67,884,260 bytes, excluding background images and external resources. That is a source-asset total, not a measured network-transfer total.

Impact: unnecessarily long downloads, substantial mobile data use, and decoding/memory pressure. CSS resizing does not reduce the original asset size.

Fix: generate correctly sized compressed image variants, use WebP/AVIF where appropriate, preserve image aspect ratios, add intrinsic width/height, and lazy-load below-the-fold images. Keep only suitably sized derivatives in the website; archive originals separately if needed.

### 2. High: music playback is inaccessible and unreliable

Evidence: music.html:114 and the other artist cards invoke playAudio through onmouseover and StopSound through onmouseout. The audio elements have no native controls. music.js:3 calls play() without handling its rejected promise. The cards are not keyboard controls. Mouseover/mouseout bubble when crossing child elements, which can repeatedly stop or restart playback.

Impact: keyboard users cannot operate playback; touch users have no dependable playback UI; browsers may block playback without user activation.

Fix: add explicit, labeled play/pause buttons or native audio controls, handle play() failures with visible feedback, stop other tracks when starting one, and specify preload="none" if audio should load only on demand.

Reference: https://developer.mozilla.org/en-US/docs/Web/Media/Guides/Autoplay

### 3. High, conditional on hosting path: audio URLs break under a project subdirectory

Evidence: all 12 sources in music.html:76–109 start with /Music/.

Impact: a site deployed under /About-me/ resolves these requests at the domain root /Music/ rather than /About-me/Music/. A root-hosted site does not have this particular problem. Current production deployment was not established.

Fix: use relative Music/... URLs or a consistently configured deployment base path, and test the site under its intended subdirectory.

### 4. Medium: header and footer mobile menus toggle together

Evidence: index.html:42 and :244 both use id="navbarNav". Both buttons target #navbarNav. The duplicate occurs on all eight remote pages. In the 390px browser test, clicking the header toggle added the visible collapse state to both menus.

Fix: assign unique IDs such as primaryNavigation and contactNavigation, and update data-target and aria-controls. A simple footer without a collapsible menu would also work.

### 5. Medium: third-party artist images fail to load

Evidence: seven Google Drive artist images on music.html completed with naturalWidth=0 in the browser check. Examples start at music.html:115 and :124. Several backgrounds and other pages also depend on third-party image URLs, but those were not exhaustively tested.

Fix: serve optimized assets from a stable location you control, where you have permission to use them. Add appropriate alternative text and a usable fallback. An external URL existing in the markup does not establish that it will remain usable as an image source.

### 6. Medium: widespread missing image alternatives and unnamed controls

Source counts:

| Page | Images without alt | Total images |
| --- | ---: | ---: |
| Home | 20 | 20 |
| Music | 17 | 17 |
| Reading | 35 | 37 |
| Designs | 16 | 33 |
| Education | 11 | 15 |
| Gaming | 5 | 28 |
| Skills | 6 | 17 |
| Work experience | 5 | 15 |
| Total | 115 | 182 |

Evidence: index.html:89 and :186 onward omit alt attributes. Homepage carousel links at :144 and :147 consist solely of background-image spans and lack accessible names. Carousel indicators are non-focusable list items. Main content lacks a main landmark; the homepage uses three h1 headings followed by h3 section headings.

Fix: supply descriptive alternatives for meaningful images, alt="" for decorative icons, named keyboard-operable carousel buttons, a coherent heading hierarchy, a main landmark, and a skip link. An automatically rotating carousel should also provide a way to pause rotation.

### 7. Medium: shared stylesheet references are broken

Evidence: music.html:8 references style.css, which is absent from both local files and the remote tree. The same reference occurs in education.html:10, gaming.html:7, reading.html:7, and skills.html:8.

Fix: remove obsolete references or implement the intended shared stylesheet. Load shared framework styles first and deliberate custom overrides afterward.

### 8. Medium: inconsistent and outdated dependency setup

Evidence: all pages load jQuery 3.3.1 and Bootstrap 4.3.1. Remote education.html:11 and workex.html:9 additionally load Popper 2 and Bootstrap 5.3.2 alongside the Bootstrap 4 stack. Scripts load synchronously in the head.

Impact: redundant downloads, parser blocking, two incompatible generations of component conventions, and avoidable maintenance/security debt. Bootstrap 5 scripts do not by themselves migrate Bootstrap 4 styles or data attributes.

Fix: choose one supported dependency stack, migrate markup and styles consistently, remove redundant libraries, and defer scripts in dependency order. Existing subresource-integrity attributes are a positive safeguard.

jQuery's official 3.5.0 release documents security fixes relevant to older versions. This site's reviewed code does not establish an exploitable untrusted-HTML injection path; dependency age alone is not proof of an active exploit.

Reference: https://blog.jquery.com/2020/04/10/jquery-3-5-0-released/

### 9. Medium: typography and layout obscure the portfolio content

Evidence: index.css:20 sets paragraphs to 30px, :98 sets coding copy to 32px, and the page uses large display headings without narrower-screen overrides. Desktop and mobile screenshots show a long repeated introduction over a busy background. At 768px, three cards remain side by side and the Designing heading exceeds its narrow content area.

Fix: use restrained backgrounds or solid text panels, a responsive type scale, shorter introductory copy, and card breakpoints based on available reading width. Start with roughly 16–18px body text and adjust for the chosen typeface. Test 320px, 390px, 768px, desktop, and browser zoom. The checked page did not show document-wide horizontal overflow at 390px or 768px; readability and internal card fit still need improvement.

### 10. Low: third carousel indicator selects the second slide

Evidence: index.html:128 and :129 both specify data-slide-to="1" despite three slides.

Fix: make the third index 2 and verify each indicator selects its corresponding image.

## Professional presentation and maintainability

- Replace the generic homepage title "About" with a descriptive name-and-role title. Add useful page descriptions and social-sharing metadata; verify canonical URLs after deciding the deployment address.
- Make the opening section explain your current work and the value you offer. Provide prominent routes to selected work and contact details.
- Turn the design gallery into case studies with the brief, your contribution, tools, and outcome. Skills are stronger when supported by project evidence than by self-assigned proficiency labels.
- Review inconsistent timeline language: the work page dates CampK12 to 2017–2023 but still describes that role as current. Confirm the accuracy of every "Present" claim before publication.
- Edit informal or negative education commentary and correct spelling/grammar to match the intended professional audience.
- Share navigation/footer templates rather than manually duplicating them across eight pages. Remove dead animation code, repeated selectors, and spacing via repeated br tags.
- Add a README with purpose, local preview instructions, deployment path, and asset-handling guidance. Add automated checks for broken local links, duplicate IDs, HTML validity, and basic accessibility.

## Recommended repair sequence

1. Preserve the existing folder and establish a healthy, complete checkout.
2. Optimize the oversized images and restore reliable media assets.
3. Repair audio controls and deployment paths, menu IDs, stylesheet links, and carousel indicators.
4. Improve accessible names, image alternatives, headings, typography, and responsive card layout.
5. Consolidate dependencies and templates; refresh professional copy and metadata.
6. Validate all eight pages in the intended hosting environment, then run Lighthouse and keyboard/accessibility checks. Record measured results rather than assigning speculative scores.
