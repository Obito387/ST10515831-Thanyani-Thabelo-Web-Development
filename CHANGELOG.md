# Changelog

All notable changes to the **Urban Threads** website project (`ST10515831-Thanyani-Thabelo-Web-Development` — WEDE5020 Portfolio of Evidence) are documented in this file.

---

## [Part 3 - Final POE Submission & Rubric Refinements] - 2026-11-17
### Added
- **Interactive Store Location & Map (`contact.html`, commit `9ecd762`):** Added Pretoria flagship store address (`214 Troye Street, Pretoria, 0002`), full weekly opening hours, and an accessible embedded OpenStreetMap iframe.
- **About Section & Store Milestones (`about.html`, commit `9ecd762`):** Restored the `.about` narrative section, store interior photography (`Image6.jpg`), and store milestone statistics (`Established 2014`, `Pretoria`, `100+ Curated Pieces`) alongside the interactive FAQ accordion.
- **Upgraded Gallery Lightbox & Catalogue Controls (`gallery.html`, `js/script.js`, commits `76d100d`, `f210b1c`, `9ecd762`):** Implemented full-screen lightbox modal with **Previous / Next** navigation buttons, slide counter (`1 / 4`), keyboard arrow (`ArrowLeft` / `ArrowRight`) and `Escape` support, price/name sorting (`Low to High`, `High to Low`, `A–Z`), real-time search filtering, live item count, and a no-results message.
- **Enquiry Quote Calculator & Contact Email Draft (`enquiries.html`, `contact.html`, `js/script.js`, commit `9ecd762`):** Added real-time client-side validation across inputs and `<select>` dropdowns, automatic indicative quote calculation (`Price × Quantity`), Netlify Forms AJAX submission, and `mailto:` email draft generation addressed to `urbanThread@gmail.com`.
- **Technical SEO & Security Hardening (`robots.txt`, `sitemap.xml`, `_headers`, commits `1f10b77`, `9ecd762`):** Added unique page-specific `<meta name="keywords">` and `<meta name="description">`, canonical URLs, `robots.txt`, `sitemap.xml`, and Content-Security-Policy headers in `_headers`.

### Fixed
- **Image Paths & Responsive Variants (commits `bd64f03`, `bbf7be4`, `7a74525`):** Corrected relative image paths in `images/products/` and aligned `<picture>` / `srcset` attributes across all product cards.
- **HTML Structure & Markup (`enquiries.html`, `gallery.html`, commit `9ecd762`):** Closed unclosed `<section>` tag in `enquiries.html` and malformed `</div>` tag in `gallery.html`.

---

## [Part 2 - Visual Styling, Responsive Design & Documentation] - 2026-10-15
### Added
- **External Stylesheet & Design System (`css/style.css`, commits `5e7a8e4`, `861e8e5`):** Created external CSS stylesheet with custom properties (`--primary-color`, `--secondary-color`, `--accent-color`), global CSS reset, and Google Fonts typography (`Oswald`, `Work Sans`, `Space Mono`).
- **Flexbox & CSS Grid Layouts:** Built responsive navigation, hero split layout, multi-column product gallery grid, and structured footer columns.
- **Responsive Breakpoints & Media (`css/style.css`, commits `437e0e3`, `733c836`, `c3ac704`):** Added tablet (`<= 900px`) and mobile (`<= 768px`, `<= 600px`) media queries, implemented `<picture>` and `srcset` responsive images, and documented viewport testing screenshots in `README.md`.
- **Project Documentation (`README.md`, commits `8c16b73`, `701052d`, `89a3915`, `7d1d6be`):** Added setup instructions, project overview, responsive design evidence, and Harvard-style references.

---

## [Part 1 - HTML Structure & Content Foundation] - 2026-09-01
### Added
- **Semantic HTML5 Pages:** Built initial 5-page site architecture (`index.html`, `gallery.html`, `about.html`, `contact.html`, `enquiries.html`) with `<header>`, `<nav>`, `<main>`, `<section>`, and `<footer>` landmarks.
- **Asset Organization & Legal Sourcing (`images/`, commit `7edcd5b`):** Structured `/images/` and `/images/products/` directories with Unsplash-licensed photography and placeholder assets, and added social media navigation links (commit `f1877e9`).
