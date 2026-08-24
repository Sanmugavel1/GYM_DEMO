# NOVA Unisex Gym — Website Demo

A Webora client-acquisition sales demo for **NOVA Unisex Gym** (Instagram: [@team.nova.__](https://www.instagram.com/team.nova.__)).

Static, single-page site — plain HTML/CSS/JS, no build step, no backend. Built to be a noticeably more premium tier of UI than the earlier gym demos (Slim N Trim, Be Fit Fitness Centre): a black + gold glassmorphism aesthetic, animated preloader, custom cursor, tab-switching program browser, an animated billing toggle on the pricing cards, a gallery lightbox, and a testimonial carousel.

## Run it

No build step needed — just serve the folder statically, e.g.:

```bash
cd nova-unisex-gym-demo
python3 -m http.server 8080
# open http://localhost:8080
```

## ⚠️ Placeholder content — read before showing this to the client

Every attempt to pull NOVA's real business details automatically failed:

- **Instagram** (`@team.nova.__`) — the public profile page doesn't expose bio/contact info without logging in; no scrapable mirror (Picuki, Imginn) worked either (all returned 403).
- **Google Maps share link** — resolves into a JS-rendered Google Search knowledge panel that could not be scraped for address, phone, hours, or rating.

So, following the same rule used on the Slim N Trim and Be Fit Gym demos (**verified facts only, nothing fabricated**), this build uses clearly-flagged placeholders instead of guessing:

| Item | Status |
|---|---|
| Address | Placeholder — **needs real address** |
| Phone / WhatsApp | Placeholder (`+91 00000 00000`) |
| Email | Placeholder (`hello@novaunisexgym.example`) |
| Hours | Placeholder (typical gym hours, not confirmed) |
| Trainer names & bios | Placeholder ("Coach Name") |
| Membership pricing | Illustrative figures only, flagged in the UI as indicative |
| Testimonials | Illustrative, flagged in the UI as demo content |
| Logo / brand colors | No real logo found — used a black + gold palette as the "premium" brand direction |
| Photography | Free-licensed Pexels stock (see below) — not the gym's real photos |

All of this is also documented inline in [`data/business-info.json`](data/business-info.json).

**Before this goes anywhere near the client**, get them to confirm: real address, phone/WhatsApp, hours, trainer names, real pricing, and (ideally) real photos/logo — then swap the placeholders in `index.html` and `data/business-info.json`.

## Imagery

All photography is free-licensed stock from Pexels (downloaded into `assets/images/`), not NOVA's actual gym/member photos — the same approach used on the Slim N Trim and Be Fit Gym demos, since the gym's real Instagram photos can't be scraped for rights reasons.

## Structure

```
index.html
css/
  style.css        — design system + component styles
  responsive.css    — breakpoints
js/
  script.js         — preloader, cursor, navbar/scrollspy, reveal animations,
                      count-up stats, program tabs, billing toggle, gallery
                      lightbox, testimonial carousel, demo contact form
data/
  business-info.json — single source of truth for placeholder business data
assets/
  images/{hero,about,programs,trainers,gallery,testimonials}/
```

## Key interactions

- **Preloader** — animated NOVA wordmark + progress ring, ~1.9s min display, respects `prefers-reduced-motion`.
- **Programs section** — pill tabs with a sliding gold indicator; switching tabs crossfades the panel content (image + copy) for each of the 6 programs.
- **Membership section** — Monthly / Quarterly / Annual segmented toggle with a sliding indicator; switching period live-updates all three pricing cards.
- **Gallery** — hover-zoom grid that opens a keyboard-navigable lightbox (arrow keys, Esc, click-through).
- **Testimonials** — auto-advancing carousel with dot navigation, pauses on hover.
- **Scroll reveal** — IntersectionObserver-driven fade/slide-in for every section, with auto-staggered card grids.
- **Contact form** — front-end only; submitting shows a toast confirming it's a demo (no request is sent anywhere).

## Deploy

Not yet deployed. Static site — deployable as-is to Vercel/Netlify/GitHub Pages with zero config once the placeholder content above is replaced.
