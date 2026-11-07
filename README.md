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

## Swap in your cartoon portraits
The scenes load these files. Replace them with transparent-background PNG/WebP cartoons
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
