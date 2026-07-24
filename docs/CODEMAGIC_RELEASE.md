# Codemagic Release Workflow

Fishing Adventure uses `codemagic.yaml` for reproducible Android releases and a prepared future iOS path. The workflow mirrors Bible Companion's proven sequence: install locked dependencies, run tests, build the Vite app, sync Capacitor, build the native package, retain artifacts, and publish through a store integration.

## Android Release

Run the `fishing-adventure-android` workflow in Codemagic. It:

1. installs dependencies with `npm ci`;
2. runs `npm run test:run`;
3. builds the production web app with `npm run build`;
4. copies the current web bundle and Capacitor plugins with `npx cap sync android`;
5. reads the latest Google Play `versionCode` and increments it, falling back to the Codemagic project build number plus 3 when Play has no visible build;
6. injects the uploaded signing identity through Codemagic's `CM_KEYSTORE_*` variables;
7. runs `./gradlew bundleRelease`; and
8. publishes the signed `.aab` to the Google Play track selected by `GOOGLE_PLAY_TRACK`, which defaults to `internal`.

Artifacts include the signed bundle under `android/app/build/outputs/bundle/release/`, any generated APKs, native output metadata, and Gradle reports.

Do not change `GOOGLE_PLAY_TRACK` to `production` as an incidental build edit. Promotion beyond Internal testing requires the normal device, billing, privacy, Data Safety, listing, and release checks in `ANDROID_IAP_RELEASE.md`.

## Codemagic Configuration

### Android signing identity

In **Team settings → Code signing identities → Android keystores**, upload the existing Google Play upload keystore with the reference:

```text
fishing-adventure-upload
```

Codemagic creates these protected build variables from that identity:

- `CM_KEYSTORE_PATH`
- `CM_KEYSTORE_PASSWORD`
- `CM_KEY_ALIAS`
- `CM_KEY_PASSWORD`

They are read only by `android/app/build.gradle` when all four are present. No keystore path, alias, or password is committed. Preserve an independent secure backup of the upload keystore because future Play releases must use the same key.

### Google Play publishing

Create a secret Codemagic environment variable group named `google_play` containing:

- `GOOGLE_PLAY_SERVICE_ACCOUNT_CREDENTIALS` — the complete Google Play service-account JSON with permission to inspect releases and upload to the intended track.

The workflow also defines the non-secret defaults `PACKAGE_NAME=com.nathanmiller.fishingadventure` and `GOOGLE_PLAY_TRACK=internal`. Override `GOOGLE_PLAY_TRACK` in Codemagic only for a deliberate promotion.

Google Play must already contain the app; store APIs cannot create a new Play application. The first store setup and all nine one-time products remain manual Play Console work.

## Versioning

The checked-in Android marketing version remains in `android/app/build.gradle` (`2.1` at the time this workflow was added). Codemagic overrides only `versionCode`, using a value greater than the latest build visible through the Google Play Developer API. Update `versionName` deliberately in Git for a new player-facing release.

Local Gradle builds continue to use the checked-in `versionCode` and `versionName`. Without Codemagic signing variables, local release bundles are not assigned the production signing configuration.

## Future iOS Workflow

The repository does not yet contain an `ios/` Capacitor shell or the `@capacitor/ios` dependency, so `fishing-adventure-ios-future` is preparation rather than a currently runnable release. Its first step exits with a clear message if the shell is absent.

Before enabling it:

1. approve the iOS platform addition;
2. install the matching Capacitor iOS dependency and run `npx cap add ios`;
3. verify the bundle ID `com.nathanmiller.fishingadventure`, deployment target, permissions, privacy manifest, icons, splash assets, and native billing strategy;
4. create a Codemagic App Store Connect integration named `Fishing Adventure CI`;
5. store an Apple Distribution certificate as `fishing-adventure-distribution`;
6. store a matching App Store provisioning profile as `fishing-adventure-app-store`; and
7. complete App Store privacy, listing, TestFlight, and purchase testing.

Once those prerequisites exist, the prepared workflow will run tests, build and sync the web app, apply signing profiles, create an `.xcarchive` and `.ipa`, retain symbols and logs, and submit to TestFlight.

Apple API keys, certificates, certificate passwords, and provisioning profiles belong in Codemagic integrations or Code Signing Identities, never in Git.

## Local Verification

Before changing the pipeline, run:

```bash
npm ci
npm run test:run
npm run build
npx cap sync android
```

Then validate the Android release task with the supported JDK:

```bash
cd android
./gradlew bundleRelease
```

A local unsigned bundle validates compilation but does not prove that Codemagic signing or Google Play publishing is configured correctly. The first CI run must confirm the bundle is signed, its `versionCode` exceeds the current Play build, and the Internal-track upload completes.
