# jrbug.net

Source for the static site served at [www.jrbug.net](https://www.jrbug.net).

## Structure

- `site/` contains the files published to Google Cloud Storage.
- `scripts/deploy.ps1` deploys the site from a machine authenticated with Google Cloud.
- `.github/workflows/deploy.yml` deploys automatically after a push to `main` that changes the site.

## Hosting

The site is stored in `gs://www.jrbug.net` in Google Cloud project
`wise-zephyr-204219`. Cloudflare provides DNS and HTTPS in front of the bucket.

GitHub Actions authenticates to Google Cloud without a stored key, using Workload
Identity Federation and the service account
`github-jrbug-deployer@wise-zephyr-204219.iam.gserviceaccount.com`.

## Deploy locally

Authenticate with Google Cloud, then run:

```powershell
.\scripts\deploy.ps1
```

Preview the upload without changing the bucket:

```powershell
.\scripts\deploy.ps1 -DryRun
```

## Broadcast configuration

Edit `site/config.js` to connect the page to a broadcast:

- `status`: `offline`, `programmed`, or `live`
- `audioStreamUrl`: browser-compatible audio stream URL
- `videoStreamUrl`: optional browser-compatible video stream URL
- `showTitle` and `showSubtitle`: current program information
- `nextShow` and `nextShowNote`: schedule messaging
- `playlist`: programmed-show selections with `title` and `duration` values

The site stays in a complete offline state when stream URLs are empty.
