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

