Deployment Guide — GitHub Pages

This repo is ready to deploy as a static site to GitHub Pages using the included GitHub Actions workflow. Follow these steps to publish it under your GitHub account.

What’s included
- .github/workflows/deploy-pages.yml — Deploys the static site on every push to the main branch.
- .nojekyll — Disables Jekyll processing so all files are served as-is.
- CNAME (optional) — If present, configures a custom domain for Pages (see below).

Choose your Pages type
1) User site (recommended for a primary portfolio)
   - Repository name: <your-username>.github.io
   - URL: https://<your-username>.github.io
   - Only one user site is allowed per account.

2) Project site
   - Repository name: any (e.g., portfolio)
   - URL: https://<your-username>.github.io/<repo-name>

Create the repository
Option A: GitHub Web UI
1. Create a new public repository (user site or project site).
2. Do NOT initialize with a README; you’ll push this codebase.

Option B: GitHub CLI (if installed)
1. gh auth login
2. gh repo create <your-username>.github.io --public --source . --remote origin --push

Push the code (if you didn’t use the CLI push)
```
git init
git add -A
git commit -m "Initial deploy"
git branch -M main
git remote add origin https://github.com/<your-username>/<repo-name>.git
git push -u origin main
```

Using a Personal Access Token (PAT)
- When prompted by Git for username/password, enter your GitHub username and paste your PAT as the password.
- Do NOT hardcode your PAT into commands or files.

Enable GitHub Pages
1. In your repository on GitHub: Settings → Pages.
2. Under “Build and deployment”, set Source to “GitHub Actions”.
3. The included workflow (.github/workflows/deploy-pages.yml) will publish automatically on push to main.

Custom domain (optional)
- This repo currently contains a CNAME file with a placeholder domain. Before your first deploy:
  - If you don’t want a custom domain yet: delete the CNAME file.
  - If you do: replace its content with your domain (e.g., deepak-rambarki.com).
- Configure your DNS: create a CNAME record for your domain pointing to <your-username>.github.io.
- In Settings → Pages, add your custom domain and enable “Enforce HTTPS” after the certificate is issued.

Verifying the deployment
1. Go to the Actions tab and open the “Deploy to GitHub Pages” workflow run.
2. Ensure all steps pass; the summary shows the deployed URL.
3. Visit the site URL:
   - User site: https://<your-username>.github.io
   - Project site: https://<your-username>.github.io/<repo-name>

Notes & Tips
- This site is static (no build step), so the workflow uploads the repository root as the artifact.
- Paths are relative (e.g., assets/...); they work for both user and project sites.
- If you change the default branch name, update the workflow trigger branches in deploy-pages.yml.
- For SEO polish, consider adding robots.txt, sitemap.xml, and meta tags.

Rollback / disable Pages
- Settings → Pages → Set Source to “Disabled”.
- To fully remove a published site, delete the gh-pages environment in Settings → Environments.

