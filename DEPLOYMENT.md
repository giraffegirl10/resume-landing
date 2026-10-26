# Deploy the portfolio to your Nginx VPS

These instructions deploy the Astro portfolio alongside the existing FastAPI blog. They assume the VPS follows the [FastAPI VPS deployment guide](https://github.com/CoreyMSchafer/FastAPI-18-Deployment-VPS/blob/main/vps_setup.txt) and already has Nginx and Certbot installed.

The examples use `hschoonmaker.com` for the portfolio and leave `blog.hschoonmaker.com` serving the existing blog. If you choose a different portfolio domain, replace `hschoonmaker.com` throughout these instructions.

Replace `SSH_USER` and `SERVER_IP` with your SSH username and server address. If you use a custom SSH port, add `-p PORT` to `ssh` and `-P PORT` to `scp`.

## 1. Create the directory on the server

Connect from your computer:

```powershell
ssh SSH_USER@SERVER_IP
```

Run these commands in the SSH session:

```bash
sudo mkdir -p /var/www/heather-portfolio
sudo chown "$USER":"$(id -gn)" /var/www/heather-portfolio
sudo chmod 755 /var/www/heather-portfolio
```

Use this directory only for the portfolio's built public files.

## 2. Build and upload from Windows

Open a local PowerShell terminal and run:

```powershell
cd H:\projects\resume-landing
$env:SITE_URL = 'https://hschoonmaker.com'
npm run verify
```

If dependencies are missing, run `npm ci` first. Node.js is needed on your computer for the build. The VPS serves static files and does not need a Node.js process for this site.

The verification command builds the site into `dist` and checks its content, links, and local assets. Continue only if it succeeds.

Upload the built files:

```powershell
scp -r ./dist/* SSH_USER@SERVER_IP:/var/www/heather-portfolio/
```

Upload the contents of `dist`, so the server directory contains:

```text
/var/www/heather-portfolio/
  index.html
  _astro/
  images/
  Heather_Schoonmaker_Resume.pdf
```

Do not upload the source project, `node_modules`, or environment files into the web directory.

## 3. Check the existing Nginx domains

In the SSH session, run:

```bash
sudo grep -R "server_name" /etc/nginx/sites-enabled/
```

If `hschoonmaker.com` already appears, inspect that configuration before adding another block for the same hostname. An existing root-domain configuration may need to be updated instead. Keep the blog's configuration and its `blog.hschoonmaker.com` hostname.

The remaining setup assumes no enabled configuration already handles the portfolio domain.

## 4. Configure Nginx for the portfolio

Create a separate configuration:

```bash
sudo nano /etc/nginx/sites-available/heather-portfolio
```

Paste and save:

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name hschoonmaker.com;

    root /var/www/heather-portfolio;
    index index.html;

    location / {
        try_files $uri $uri/ =404;
    }
}
```

Enable the configuration once:

```bash
sudo ln -s /etc/nginx/sites-available/heather-portfolio /etc/nginx/sites-enabled/heather-portfolio
```

If that link already exists, inspect it instead of replacing it:

```bash
ls -l /etc/nginx/sites-enabled/heather-portfolio
```

Test the configuration:

```bash
sudo nginx -t
```

Only after the test succeeds, reload Nginx:

```bash
sudo systemctl reload nginx
```

## 5. Configure DNS and HTTPS

At your DNS provider, point the A record for `@` at the VPS's IPv4 address. Leave the blog's DNS record in place. If the portfolio domain has an AAAA record, it must point to the VPS's correct IPv6 address as well.

Check DNS from the server:

```bash
dig +short hschoonmaker.com A
dig +short hschoonmaker.com AAAA
```

Once DNS resolves to your VPS, obtain the certificate using the existing Certbot installation:

```bash
sudo certbot --nginx -d hschoonmaker.com
```

Follow the prompts and enable the HTTP-to-HTTPS redirect if asked. Certbot updates the Nginx configuration for HTTPS. On later deployments, retain those certificate settings rather than replacing the file with the initial HTTP-only configuration above.

Check certificate renewal:

```bash
sudo certbot renew --dry-run
```

These steps configure the root domain only. To support `www.hschoonmaker.com`, also configure its DNS, Nginx hostname or redirect, and certificate coverage.

## 6. Check the deployed site

Open `https://hschoonmaker.com` and verify:

- The portfolio and all three project images load.
- The resume downloads as a PDF.
- The header's Blog link opens `https://blog.hschoonmaker.com/`.
- The FastAPI Blog project has working source and demo links.
- The existing blog still loads.

If Nginx reports a permission error, check that the uploaded files are readable by its worker user and that the containing directories are traversable.

## Deploy future updates

After editing the profile, project Markdown, images, or styles, run locally:

```powershell
cd H:\projects\resume-landing
$env:SITE_URL = 'https://hschoonmaker.com'
npm run verify
```

After verification succeeds, upload again:

```powershell
scp -r ./dist/* SSH_USER@SERVER_IP:/var/www/heather-portfolio/
```

Nginx does not need a reload when only static files change. Reload it only after changing its configuration and passing `sudo nginx -t`.

This upload replaces matching files but does not delete old files from the server. If you remove a public file from the project, remove that exact obsolete file from the server too when you want its old URL to stop working.
