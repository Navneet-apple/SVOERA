# SVOERA

**ANIME · YOUR WORLD, BEYOND REALITY**

An anime-first mobile app prototype built with Expo and React Native. The interface uses the SVOERA obsidian, silver, and crimson visual system, with Home, Schedule, My List, Download, and Profile destinations.

## Run locally

Use Node.js 20.19 or newer:

```sh
npm install
npx expo start
```

Open the project with Expo Go or a development build. For an Android native project, run `npx expo prebuild --platform android` and build with the Android toolchain.

## Android APK

Every push to `main` builds an installable Android debug APK with GitHub Actions. The workflow also runs manually from the Actions tab. Download the APK from the workflow run's artifacts; tagged project releases can include an APK asset as well. Debug APKs are for testing and use Android's debug signing key; they are not production store builds.

To build locally, install the Android SDK and Java 17, then run:

```sh
npm ci --legacy-peer-deps
npx expo prebuild --platform android --no-install
cd android
./gradlew assembleDebug
```

The APK is written to `android/app/build/outputs/apk/debug/app-debug.apk`.

## Current prototype

- Branded five-tab navigation and Home discovery layout.
- Title search and trending/airing/popular/upcoming AniList catalog integration, gated pending approval.
- Anime detail pages with working five-status My List controls.
- In-app provider browser for AniKoto, AnimeGG, and Re:Anime with navigation controls.
- Sample weekly schedule and clear offline/download empty state.
- Guest profile counts derived from the current in-memory list.

The preview catalogue, dates, ratings, and artwork treatments are illustrative sample data. The watchlist resets when the app process restarts. The provider browser opens the selected website directly; it does not extract, proxy, or host video. Playback behavior and availability are controlled by each provider website.

An AniList GraphQL integration is implemented for trending, airing, popular, upcoming, artwork, and title search. **Live requests are disabled by default.** AniList's API terms restrict use in competing anime list/tracker services unless authorized, and SVOERA includes personal tracking. Ask AniList for approval before enabling those requests. After approval, start the app with `EXPO_PUBLIC_ANILIST_APPROVED=true npx expo start`. The app filters out adult entries and debounces search requests. Review AniList's [API terms](https://anilist.gitbook.io/anilist-apiv2-docs/docs/guide/terms-of-use) before distribution, including its commercial-use conditions.

## Build plan

1. Visual foundation and navigation (current): replace the sample content with SVOERA's final visual assets and refine responsive layouts.
2. Catalogue and search: obtain AniList approval for SVOERA's tracker use, enable the GraphQL integration, and connect schedule data.
3. Personal tracking: persist guest data locally, then add account sync if needed.
4. Authorized playback and downloads: keep provider browsing separate from any future licensed native player or offline downloads.
5. Accessibility, security, device coverage, and release preparation.

## Reference project

The app structure and initial scope were informed by [Navneet-apple/th3](https://github.com/Navneet-apple/th3), an independently authored Expo anime discovery starter. Its public README says the starter uses placeholder data and does not implement streaming, downloads, accounts, or remote services. The public checkout currently does not include the `src/` files referenced by its app screens, so this SVOERA app is implemented as a fresh project rather than copied from it.

This project does not use the reference repository's APK recovery archive, recovered assets, or decompiled output. AniList supplies metadata only. SVOERA opens provider websites in a WebView and does not scrape their catalogs or extract, proxy, or host their video.

## License

SVOERA is licensed under the GNU General Public License v3.0. See [LICENSE](LICENSE).
