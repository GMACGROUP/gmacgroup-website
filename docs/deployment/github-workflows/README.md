# GitHub automation files to install

These two files belong in `.github/workflows/`. They are kept here because the access token used to push this branch is not allowed to change workflow files. Someone with admin access should copy them across in one commit:

```bash
cp docs/deployment/github-workflows/ci.yml docs/deployment/github-workflows/uptime.yml .github/workflows/
git add .github/workflows && git commit -m "CI on real migrations; uptime check" && git push
```

* `ci.yml`: the existing test workflow, updated to build the database from the real migration files (the old version skipped them, so the event and catalogue tests would fail).
* `uptime.yml`: checks the API and website every 10 minutes and keeps the free Render API awake. Set the repository variables `API_URL` and `SITE_URL` (see GO-LIVE.md, step 3c).
