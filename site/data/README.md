# Site Configuration

Edit `site.json` to update the website content without touching any code.

## Quick Update Guide

### Update Mode

Change `mode` to control what countdown is shown:
- `"permit"` - Show permit-related countdowns
- `"start"` - Show countdown to trail start date

### Update Stats

Edit the `stats` object to update quick stats on the homepage:

```json
"stats": {
  "milesDone": 0,           // Total miles completed
  "sectionNow": "Permitting",  // Current section/location
  "lastCheckin": "Today",      // Last check-in time
  "nextTown": "Campo (soon)"   // Next town/resupply
}
```

### Update Live Status

Edit the `liveStatus` object to update the status card:

```json
"liveStatus": {
  "state": "Planning / Permit Day",        // Status pill text
  "area": "Off-trail (ops planning)",      // Current area
  "blurb": "Finalizing my NOBO start date today.",  // Latest update
  "next": "After permit is confirmed."     // Next update timing
}
```

### Switch to Trail Start Mode

When you lock your start date:

1. Set `startDateISO` to your start date (e.g., `"2026-04-17T07:00:00-07:00"`)
2. Change `mode` to `"start"`
3. Update stats and status as needed

## Example: Switching to Start Mode

```json
{
  "mode": "start",
  "startDateISO": "2026-04-17T07:00:00-07:00",
  "stats": {
    "milesDone": 0,
    "sectionNow": "Southern California",
    "lastCheckin": "Pre-trail",
    "nextTown": "Mt. Laguna"
  },
  "liveStatus": {
    "state": "Pre-trail / Final prep",
    "area": "San Diego area",
    "blurb": "Start date confirmed: April 17. Final gear shake-down complete.",
    "next": "Check-in from Campo on day 1."
  }
}
```

## Deployment

After editing `site.json`:

```bash
git add site/data/site.json
git commit -m "Update site status"
git push
```

Changes will be live immediately (may need to refresh with cache clear: Cmd+Shift+R on Mac, Ctrl+Shift+R on Windows).
