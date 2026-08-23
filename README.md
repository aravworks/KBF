# Khalsa Brick Kilns

Marketing website for Khalsa Brick Kilns — a brick manufacturer exporting clay, fly-ash, hollow and paver bricks from India to the UAE, Saudi Arabia, Qatar, Oman, Kuwait and Bahrain.

Static site, no build step or framework required: plain HTML/CSS/JS with [GSAP](https://gsap.com/) (via CDN) for scroll animations.

## Structure

```
index.html          Page markup / all sections
css/style.css        Styles, layout, animation keyframes
js/main.js            Scroll animations, nav, form, FAQ, brick life-cycle animation
assets/               Images
```

## Running locally

No build tools needed — just serve the folder over HTTP (opening `index.html` directly as a `file://` URL will break some relative asset paths).

```bash
python -m http.server 8000
```

Then open `http://localhost:8000`.

## Deploying

Any static host works as-is (GitHub Pages, Netlify, Vercel, Cloudflare Pages, or a plain shared-hosting/cPanel upload) — just publish the contents of this folder. No environment variables or server-side code required.

To deploy on **GitHub Pages**: Settings → Pages → Deploy from branch → `main` / root.

## Content still to fill in

A few placeholders are marked in the markup (search for `[` in `index.html`) and need real business details before launch:

- Phone / WhatsApp number, email address, kiln location (footer + contact section)
- Certifications (Quality & Compliance section)
- Real gallery photos (currently placeholder tiles)
- Client testimonials (currently placeholder quotes)
