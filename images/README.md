# Images folder

Structure:
- `/images/` — site-wide assets (logo, hero, icons)
- `/images/products/` — individual product photography, named by SKU (e.g. `sku-0192-jacket.jpg`)

## Legal sourcing plan (Part 1 requirement)
Since Urban Threads does not yet have professional product photography, placeholder
blocks are used in this prototype. For the real build, images should come from:
1. **Store's own photography** — best option, no licensing risk.
2. **Unsplash** (unsplash.com) or **Pexels** (pexels.com) — free for commercial use, no
   attribution legally required (but crediting is good practice).
3. **Compression/preparation** — run final images through TinyPNG or Squoosh (both free,
   browser-based) before upload, and export at web-appropriate sizes (e.g. product cards
   at 800x1000px) to keep page load fast.

## Images currently used in the prototype (Part 1)
The HTML now references these as **local files** in `images/products/` — you need to
download each one and save it under the exact filename shown, or the images won't
display. All free to use under the [Unsplash License](https://unsplash.com/license)
(free for commercial use, no attribution legally required):

| Save as | Source |
|---|---|
| `images/products/Image1.jpg` | Bernd Dittrich — unsplash.com/photos/94Tvp4AhlUU |
| `images/products/Image2.jpg` | charlesdeluvio — unsplash.com/photos/8xTN-V_s6sU |
| `images/products/Image3.jpg` | seeetz — unsplash.com/photos/Mf194wsFKZI |
| `images/products/Image4.jpg` | TuanAnh Blue — unsplash.com/photos/gYOQbqbs_mE |
| `images/products/Image5.jpg` | Amanda Vick — unsplash.com/photos/zw_oaDbfzyE |
| `images/products/Image6.jpg` | Hugo Clément — unsplash.com/photos/JGtPrdnMgQc |

To download: open each link, click "Download free" on the Unsplash page, rename the
downloaded file to match the table above, and drop it into `images/products/`.

- Low-Top Street Sneaker: still a placeholder — most free sneaker photos on Unsplash/Pexels
  visibly show Nike/Jordan branding, which isn't safe to use for a different fictional
  store. Swap in a real (unbranded, or your own) product photo before final submission.

