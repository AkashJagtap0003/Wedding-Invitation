# शुभविवाह · Akash & Akshada — Wedding Invitation

Mobile-friendly, interactive Maratha wedding invitation (static site for GitHub Pages).
Theme: watercolor parchment + Marathi touches (॥ श्री गणेशाय नमः ॥, चि. / चि. सौ. कां., शुभमुहूर्त, अक्षता, जय भवानी · जय शिवाजी, fort with bhagwa flag).

## Interactive bits
- Opening temple doors (दार उघडा) with bell chime + akshata shower
- Parallax scenes (mouse / phone tilt); tap the couple for hearts, ring the bell
- Scratch card to reveal the date (इथे घासा), live countdown (दिवस/तास/मिनिटे/सेकंद)
- Story timeline, photo polaroids with lightbox
- "अक्षता टाका" button, share button, blessings wall (saved on the guest's device) + Send on WhatsApp
- Sound toggle (sounds are synthesised, no audio files)

## Cartoon portraits
The scenes load these files (cut-outs of the couple's own cartoons). To change them, use transparent-background PNG/WebP cartoons
(same file names, portrait orientation, ~900–1000 px tall):

| File | Scene | Pose (from your photos) |
| --- | --- | --- |
| `assets/cartoon-hero.webp` | Hero | Standing together, holding hands, smiling at camera |
| `assets/cartoon-story.webp` | Our Story | Walking together |
| `assets/cartoon-blessing.webp` | Blessings | Akshada leaning on Akash's shoulder |

Suggested prompt for an image generator (upload the matching photo with it):

> Turn this photo into a soft, cute storybook watercolor cartoon illustration of this couple, keeping their exact
> face shapes, features, skin tone, hairstyles, his glasses and beard, her nath and jewellery, and their outfits
> (his ivory peacock-embroidered jacket, her pink Paithani saree). Full body, same pose, transparent background,
> no text.

## Edit details
Open `index.html` and edit the `wedding` object at the top of the script (muhurat time, start/end time for the
calendar + countdown, maps link, optional WhatsApp number to receive blessings).

## Deploy
Pushing to `main` deploys via `.github/workflows/static.yml` (GitHub Pages).

## Private dashboard: blessings + analytics (password protected)
GitHub Pages can't store data, so a free **Google Sheet + Apps Script** acts as the backend.
Guests' blessings and visit stats are saved in *your* sheet; only `admin.html` with your password can read them.

**One-time setup (about 5 minutes):**
1. Go to https://sheets.new (signed in to your Google account) and name the sheet "Wedding Invitation".
2. In the sheet: **Extensions → Apps Script**. Delete the sample code, paste all of `apps-script/Code.gs`, and save.
3. In Apps Script: **Project Settings (⚙) → Script properties → Add script property**
   - Property: `ADMIN_PASSWORD`, Value: *your secret password*. Save.
4. **Deploy → New deployment → Select type: Web app**
   - Execute as: **Me**. Who has access: **Anyone**. Click **Deploy**, allow the permissions, and copy the **Web app URL**
     (`https://script.google.com/macros/s/.../exec`).
5. Paste that URL into `backendUrl` in **both** `index.html` (in the `wedding` object) and `admin.html`, then push to `main`.

**Using it:** open `https://akashjagtap0003.github.io/Wedding-Invitation/admin.html`, enter your password.
You'll see unique visitors, page views, visitors per day, where guests came from (WhatsApp, Instagram, …), devices,
every tracked action (opened invite, map, calendar, share, akshata, …), and all blessings (searchable, downloadable as CSV).
The raw data is also in the Google Sheet tabs `Blessings` and `Events`.

To change the password later, edit the `ADMIN_PASSWORD` script property; no redeploy is needed.
If you edit `Code.gs`, use **Deploy → Manage deployments → Edit → New version** so the URL stays the same.
