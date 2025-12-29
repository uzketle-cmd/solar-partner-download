# Solar Partner Download Page

Professional download page for Solar Partner Android application.

## Features
- Modern, responsive design
- Download tracking with Google Analytics
- Installation instructions with screenshots
- Security verification (SHA-256 checksum)
- QR code for easy mobile downloads
- Multi-platform download options

## Deployment

### GitHub Pages
1. Push all files to your repository
2. Go to repository Settings → Pages
3. Select source: `main` branch, `/ (root)` folder
4. Your site will be available at: `https://[username].github.io/[repository-name]`

### Custom Domain
1. Add your domain to `CNAME` file
2. Update `_config.yml` with your domain
3. Configure DNS settings with your registrar

## Customization

### Update Download Link
Edit `index.html`:
```html
<a href="YOUR_NEW_DOWNLOAD_LINK" class="btn-download">
