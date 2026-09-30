# AO Telemetry

The Sanctuary runtime supports optional Umami analytics through:

- `VITE_ANALYTICS_ENDPOINT`
- `VITE_ANALYTICS_WEBSITE_ID`

The client loads Umami only when both values are present. The runtime remains functional when no Umami site is configured.

`ao-cross-app-analytics-dashboard.json` is the proposed privacy-safe event and funnel configuration. It is staged for export after an Umami site is provisioned.

## Current status

No Umami site exists yet. No analytics endpoint, website ID, API token, or synthetic event has been sent. Configure these values through the managed project’s secure environment settings after creating the Umami site; never commit them or place them in chat.
