# Admin access and profile doorway — session checklist

The owner-session path now re-reads the user after the database upsert, so promotion from the configured owner identity to admin is visible in the same request instead of requiring a second refresh. The Admin Hub gate also explains whether the visitor is signed out or signed in with a non-admin account and provides refresh and sign-in-again recovery actions.

The personal-world profile header now includes a visible Admin Hub control-room link beside Shape your world. The link is available to signed-in profile visitors and the Admin Hub itself still enforces the admin gate.

Validation passed: all 14 Vitest files and 139 tests passed; production build completed successfully. No new diagnostics were found in the updated owner-auth, Admin Hub, or Profile files. Existing unrelated server baseline diagnostics remain.
