# hamza-aziz-cv

Source of [hamzaaziz.dev/hamza-aziz-cv/](https://hamzaaziz.dev/hamza-aziz-cv/), the online CV of Hamza Aziz, an AI Engineer working on production voice AI and computer vision.

It is a single hand-written static page (HTML, CSS and vanilla JavaScript, no build step) served by GitHub Pages as a project site of [hamzaaziz.dev](https://hamzaaziz.dev/), whose source is [`hamza-aziz-ai/hamza-aziz-ai.github.io`](https://github.com/hamza-aziz-ai/hamza-aziz-ai.github.io).

## Pages

| URL | Source | What it is |
|---|---|---|
| [`/hamza-aziz-cv/`](https://hamzaaziz.dev/hamza-aziz-cv/) | `index.html` | Online CV: summary, skills, languages, education, work experience, projects, certificates |
| [Download CV](https://hamzaaziz.dev/assets/pdf/Hamza_Aziz_CV_UAE.pdf) | `assets/pdf/Hamza_Aziz_CV_UAE.pdf` | PDF version of the CV; the button links to the identical copy on the root site, which is the canonical URL |

## How it is built

- **Hosting:** GitHub Pages (branch `main`, root), served under the custom domain of the root site, with DNS and proxy on Cloudflare.
- **Front end:** plain HTML/CSS/JS in `assets/`. Third-party pieces: [Remix Icon](https://remixicon.com/) (from cdnjs) and the Montserrat font (Google Fonts). `assets/js/main.js` handles the scroll-up button, the active navigation link, the light/dark theme toggle and the CV download event.
- **Analytics:** Google Analytics 4 (loaded first-party through Cloudflare's Google tag gateway, with a fallback to googletagmanager.com), including a `cv_download` event when the CV PDF is downloaded, and Cloudflare Web Analytics.
- **SEO:** `sitemap.xml`, canonical URL, Open Graph and Twitter tags, and JSON-LD (`ProfilePage` whose `Person` is shared with the root site). `robots.txt` lives in the root site's repository.

## Repository layout

| Path | Contents |
|---|---|
| `index.html` | The CV page |
| `assets/css/`, `assets/js/`, `assets/img/`, `assets/pdf/` | Styles, script, images, CV PDF and education documents |
| `sitemap.xml` | Sitemap for this project site |
| `.github/workflows/ci.yml` | On every pull request to `main`: runs `.github/scripts/check_site.py` (HTML balance, local assets, sitemap XML) and `node --check`, then merges the PR once they pass |
| `.github/workflows/guard-main.yml` | Opens an issue for any push to `main` that did not come from CI's merge job |
| `.github/workflows/deploy.yml` | Deploys `index.html`, `sitemap.xml` and `assets/` (nothing else) to GitHub Pages from `main`, with sitemap `<lastmod>` set from git history in the built copy, then resubmits the sitemap to Search Console |
| `_redirects` | Redirects the old Netlify mirror to the canonical URL |

## Running it locally

```bash
python -m http.server 8000
# then open http://localhost:8000/
```

Changes reach `main` only through a pull request; CI merges it when the checks pass. To run the same checks locally: `python .github/scripts/check_site.py` and `node --check assets/js/main.js`.

Two things behave differently off the live domain: the Download CV button points to the PDF on hamzaaziz.dev, and the Google tag gateway path (`/iitk/`) does not exist locally, so the page falls back to loading the tag from googletagmanager.com.

## Contributing

This is a personal site, so outside pull requests are not expected. If you spot a broken link or a mistake, an issue or an email to hamza.aziz.dev@gmail.com is welcome.

## License

© Hamza Aziz. All rights reserved. The text, photos, CV and other documents in this repository are personal and are not licensed for reuse.
