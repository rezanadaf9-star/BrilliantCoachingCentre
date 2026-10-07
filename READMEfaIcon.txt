BCC ICON PACK — V2

RULE:
1. NORMAL BROWSER FAVICONS -> CIRCULAR BCC LOGO
   - favicon.ico
   - favicon-16x16.png
   - favicon-32x32.png
   - favicon-48x48.png

2. INSTALLED WEB APP / PHONE / SAFARI APP ICON -> SHIELD/SQUARE APP ICON
   - apple-touch-icon.png
   - android-chrome-192x192.png
   - android-chrome-512x512.png
   - app-icon.png

3. NORMAL BRANDING -> CIRCULAR LOGO
   - logo.png

4. Safari pinned tab -> separate safari-pinned-tab.svg

Use the user's existing favicon HTML unchanged:
<link rel="icon" href="favicon.ico" sizes="any">
<link rel="icon" type="image/png" sizes="16x16" href="favicon-16x16.png">
<link rel="icon" type="image/png" sizes="32x32" href="favicon-32x32.png">
<link rel="icon" type="image/png" sizes="48x48" href="favicon-48x48.png">
<link rel="apple-touch-icon" sizes="180x180" href="apple-touch-icon.png">
<link rel="manifest" href="site.webmanifest">
<meta name="theme-color" content="#fff000">

If you also want Safari pinned tabs:
<link rel="mask-icon" href="safari-pinned-tab.svg" color="#1b1464">
