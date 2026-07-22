# Google Play Data Safety Guide

This guide reflects the July 21, 2026 Android build. Re-audit it whenever an SDK, permission, account, cloud-save, analytics, advertising, or backend feature changes. The developer remains responsible for the final Play Console declaration.

## Current Declaration

- The app does not collect or share Google Play Data Safety user-data categories through Nathan Miller's systems.
- The app does not provide account creation.
- The app contains no ads or advertising SDKs.
- The app contains no analytics or crash-reporting SDKs.
- Game saves and settings remain local to the device.
- Catch and cabin images are created locally and leave only through a user-initiated system share action.
- Google Play processes optional purchases. Fishing Adventure does not access payment-card or bank-account details. Google states that payment details collected directly by a payment service generally do not need to be declared by the app when the app never accesses them.

## Play Console Answers to Recheck

1. **Does your app collect or share any required user data types?** No, for the current build and SDK set.
2. **Is all user data encrypted in transit?** Not applicable to developer collection; Google Play communication uses its platform service.
3. **Does the app allow users to create an account?** No.
4. **Can users request deletion?** Local progress can be deleted with Reset progress, Android's Clear storage control, or uninstalling. There is no developer-hosted account or cloud save.
5. **Ads?** No.

Before submission, compare the generated Android manifest and complete dependency tree against this guide. Server-side purchase verification, crash reporting, analytics, cloud saves, support forms, or any other future network service will require another privacy and Data Safety review before release.
