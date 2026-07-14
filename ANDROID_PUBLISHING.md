# Publishing Squish Pop to Google Play

Squish Pop is already a PWA (manifest + service worker), so it doesn't need a
rewrite to reach the Play Store — it's packaged as a **Trusted Web Activity
(TWA)**, an Android app that's really just your existing site wrapped in a
full-screen, app-like shell.

## 1. Generate the Android App Bundle (AAB) with PWABuilder

1. Go to **https://www.pwabuilder.com**
2. Enter the live URL: `https://lanthanum89.github.io/squish-pop/`
3. Let it analyze the manifest/service worker, then click **Package for stores → Android**
4. Fill in:
   - **Package ID** — reverse-domain style, e.g. `com.lanthanum89.squishpop`
   - **App name** — Squish Pop
   - **Signing key** — choose **"Create new signing key"** (PWABuilder generates and signs it for you). Download and *keep this keystore file somewhere safe* — you need the exact same one for every future update, and Google can't recover it if it's lost.
5. Download the generated package. It includes:
   - The signed `.aab` file (upload this to Play Console)
   - A `signing-key-info.txt` (or similar) with the **SHA-256 fingerprint**
   - An `assetlinks.json` file

## 2. Wire up Digital Asset Links (proves you own the domain)

The repo already has a placeholder at `.well-known/assetlinks.json`. Once
PWABuilder gives you the real package name and SHA-256 fingerprint:

1. Open `.well-known/assetlinks.json` in the repo
2. Replace `REPLACE_WITH_PACKAGE_NAME` with your package ID (e.g. `com.lanthanum89.squishpop`)
3. Replace `REPLACE_WITH_SHA256_FINGERPRINT` with the fingerprint from PWABuilder
4. Commit, push, and let it deploy — verify it's live at
   `https://lanthanum89.github.io/squish-pop/.well-known/assetlinks.json`

Without this step, the Android app will open the site inside a browser
address bar instead of full-screen.

## 3. Store listing assets (already prepared)

Sent alongside this guide:
- `icon-512.png` — 512×512 app icon
- `feature-graphic.png` — 1024×500 Play Store feature graphic
- `screenshot-1-menu.png`, `screenshot-2-collection.png`, `screenshot-3-gameplay.png` — 1080×1920 phone screenshots
- `store-listing.md` — app name, short/full description, category, content rating notes

## 4. Privacy policy

Live (once merged/deployed) at:
`https://lanthanum89.github.io/squish-pop/privacy.html`

Play Console requires this URL in the store listing's "Privacy policy" field.

## 5. Upload to Play Console

1. Play Console → your app (or create a new app entry)
2. **Production → Create new release**, upload the `.aab`
3. **Store listing** — paste in the copy from `store-listing.md`, upload the
   icon, feature graphic, and screenshots
4. **App content** section — fill in the privacy policy URL, content rating
   questionnaire, and the target-audience/Families declaration (your call —
   see notes in `store-listing.md`)
5. Submit for review

Google's review typically takes a few hours to a few days for a first
submission.

## Updating the app later

Any time you change the site, the live PWA updates itself automatically
(service worker + Play Store users both just load the new content — no app
update needed) **unless** you change the manifest's name/icons in a way that
affects the native shell, in which case you'd rebuild via PWABuilder using
the *same* signing key and upload a new `.aab` as a new release.
