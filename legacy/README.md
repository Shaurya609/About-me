# Original portfolio

This preserves the original portfolio design from commit `728fc8b4c3a27221ee279235027589345b15c916` (image repairs and performance improvements, before the redesign), with the approved content updates documented below.

Open `index.html` through a local web server, or visit `legacy/` on the deployed website. The comparison page is at `../compare/`.

The HTML, CSS, JavaScript and referenced local media were initially copied byte for byte from that commit. They do not depend on the current portfolio's assets. Original external libraries, fonts and outbound links remain external, so full rendering requires an internet connection. Historical markup and browser audio restrictions are retained.

Do not change this folder as part of routine redesign work. `snapshot.json` retains the original commit and SHA-256 hashes for all 194 preserved files. `amendments.json` records explicitly approved exceptions, including original and updated hashes. Run `python scripts/preserve_legacy.py --verify` from the repository root to check unchanged files, documented amendments and local dependencies.

On 25 September 2026, the user approved adding Wishup (Online Business Manager, 2025 - Present) and updating Madhyam to 2023 - 2025 in `workex.html`. A footer button on each of the eight legacy pages returns to the matching current page. The approved role descriptions were also refreshed: FoodCham (Graphic Design Intern), CampK12 (Operations Manager) and Madhyam (Assistant General Manager). All other snapshot files remain unchanged. The exact original page can still be recovered from the source commit.

The comparison's current view follows the latest root pages; its legacy view retains the original design with these content amendments. Both folders are static and will be published alongside the main site by GitHub Pages when committed and pushed.
