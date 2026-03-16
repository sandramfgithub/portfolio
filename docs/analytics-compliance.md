# Analytics Compliance

## Provider

- Service: Umami Cloud
- DPA: https://umami.is/umami-dpa.pdf
- Data region: European Union
- Retention: 6 months

## Scope

The site limits analytics to audience measurement and usage of the portfolio
itself. The current custom events are:

- `social_link_clicked`
- `cv_download_started`
- `cv_download_succeeded`
- `cv_download_failed`
- `cv_preview_viewed`
- `entry_detail_viewed`
- `entry_link_clicked`
- `not_found_viewed`
- `private_entry_clicked`
- `project_detail_clicked`
- `project_repository_clicked`
- `skill_detail_opened`

## Data minimization

- No email address is sent to analytics.
- No names or user identifiers are sent to analytics.
- No cross-site tracking is configured.
- Domain restriction is configured through `PUBLIC_UMAMI_DOMAINS`.
- Opt-out preference is stored locally under `analytics-opt-out`.

## User controls

- Privacy policy route: `/es/privacy` and `/en/privacy`
- Footer link to the privacy policy
- Opt-out button on the privacy page

## Notes

- The current setup is intended to stay within audience measurement only.
- This document should be reviewed whenever the provider, data region,
  retention, or event catalog changes.
