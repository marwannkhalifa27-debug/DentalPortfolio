# Dentist portfolio website (frontend)

Static, multi-page frontend built with plain HTML, CSS and JavaScript modules. No build step.
It runs on mock data now and is wired so the real backend can replace the mocks by changing one setting.

## Run it

ES modules do not load from `file://`, so serve the folder:

    npx serve .
    # or: python3 -m http.server 8000
    # or: VS Code "Live Server"

Then open http://localhost:3000 (or the port shown).

Add `?mock_error=1` to any page URL to preview the error states.

## Folder structure

    index.html  about.html  cases.html  case.html  contact.html
    css/
      base.css         design tokens (colors, type, spacing), reset
      layout.css       container, header, footer
      components.css   buttons, cards, before/after slider, filters, forms, states
      pages.css        page-specific sections
    js/
      config.js        API URL, mock on/off, asset base URL
      main.js          shared header/footer bootstrap, loadInto() helper
      services/api.js  the ONLY place that talks to data (mock or real)
      data/            mock data (dentist, cases, categories)
      components/      reusable UI pieces (navbar, caseCard, beforeAfter, ...)
      pages/           one script per page
      utils/           html escaping helper, formatters
    assets/images/     placeholder illustrations and portrait (replace with real photos)

## Content to replace

- `js/data/dentist.js`: every value is placeholder (name, phone, university, certifications, timeline, hours, links).
- `assets/images/dentist-portrait.svg`: replace with the real portrait and update `profileImage`.
- `js/data/cases.js` and `assets/images/cases/`: placeholder cases.
- Patients must consent to having before/after photos published.

## Connecting the backend

1. In `js/config.js` set `USE_MOCK: false` and `API_BASE_URL` (for example `/api` if Express serves this folder).
2. Make the API return these shapes. Only `js/services/api.js` needs to change if yours differ.

    GET  /dentist      -> { name, title, intro, biography: [..], university, graduationYear,
                            specialization: [..], experience, interests, highlights: [{title,text}],
                            certifications: [{title,issuer,year}], timeline: [{period,title,place,text}],
                            phone, whatsapp, email, address, workingHours: [{days,hours}],
                            socialLinks: {instagram,facebook}, mapEmbedUrl, profileImage }
    GET  /categories   -> [{ slug, name }]
    GET  /cases        -> [{ id, title, category (slug), description, details, treatment: {procedure,duration,visits},
                             results, beforeImage, afterImage, additionalImages: [..], featured, createdAt }]
                          optional query: ?category=slug &featured=true &limit=3
    GET  /cases/:id    -> one case (404 with { message } if missing)
    POST /contact      <- { name, phone, email, message }

3. If image paths returned by the API are relative to another host, set `ASSET_BASE_URL`.
4. Config overrides without editing files: define `window.__APP_CONFIG__ = {...}` in a script before the modules load.

## Notes

- Case page URL is `case.html?id=2`. If you want `/cases/2`, add a rewrite in Express that serves `case.html` and keep reading the id from the path.
- All API text is escaped before rendering (`js/utils/html.js`), and URLs are checked before use in links.
- Fonts (Source Serif 4, Hanken Grotesk) load from Google Fonts with system fallbacks. Self-host them for fully offline or privacy-strict use.
- Admin dashboard and authentication are intentionally not included.
