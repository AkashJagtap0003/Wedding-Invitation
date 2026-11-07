# Royal Maratha Wedding Story — Free GitHub Pages Website

A mobile-first, single-page wedding invitation storybook. No Python server, paid hosting, build tools, or dependencies required.

## Publish using GitHub Pages (mobile-friendly)
1. Create a **public** GitHub repository, e.g. `wedding-invitation`.
2. Upload `index.html` to the repository root.
3. Open repository **Settings → Pages**.
4. Under Build and deployment, select **Deploy from a branch**.
5. Choose `main` and `/ (root)`, then Save.
6. Wait a few minutes. GitHub will show your public website URL.

## Personalize
Open `index.html` and edit the `const wedding = { ... }` section near the bottom:
- groom / bride
- date / time
- venue / mapsQuery
- calendarStart / calendarEnd (Google Calendar format: YYYYMMDDTHHMMSS)

Also search for bracketed placeholder text and update it. Example: `[Bride Name]`.

## Important privacy note
GitHub Pages repositories on the Free plan must be public. Anyone can view the code and any images you upload. Do not upload private photos unless you are comfortable with them being publicly accessible.

## Analytics (free)
Cloudflare Web Analytics can provide aggregate visit metrics without adding a paid backend. It does not expose individual raw IP addresses. If you later want visitor-level IP logs, that needs a backend; GitHub Pages alone cannot run Python or store server logs.


## Analytics are private
The invitation page does **not** display visitor analytics to wedding guests. Analytics should be accessible only through the account/dashboard you configure (for example, Cloudflare Web Analytics). Avoid embedding a public analytics dashboard in the invitation itself.
