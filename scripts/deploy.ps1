[CmdletBinding()]
param(
    [string]$Bucket = "www.jrbug.net",
    [switch]$DryRun
)

$ErrorActionPreference = "Stop"

if (-not (Get-Command gcloud -ErrorAction SilentlyContinue)) {
    throw "Google Cloud CLI (gcloud) is required."
}

$siteRoot = (Resolve-Path (Join-Path $PSScriptRoot "..\site")).Path
$destination = "gs://$Bucket"
$arguments = @(
    "storage",
    "rsync",
    $siteRoot,
    $destination,
    "--recursive",
    "--delete-unmatched-destination-objects",
    "--cache-control=public,max-age=300"
)

if ($DryRun) {
    $arguments += "--dry-run"
}

& gcloud @arguments
if ($LASTEXITCODE -ne 0) {
    throw "Deployment failed with exit code $LASTEXITCODE."
}

