Eeko-Web
A browser-based tool for encrypting a text message into a PNG card and unlocking it with the correct password.
Features
Encrypt text using the Web Crypto API.
Encode encrypted bytes into a downloadable PNG card.
Decode supported cards in the browser.
Uses AES-GCM 256-bit encryption and PBKDF2-HMAC-SHA-256.
No server-side message processing is required by this page.
Run
Serve the repository through a local static web server or publish it with GitHub Pages. The page loads Tailwind CSS and Google Fonts from external CDNs, so an internet connection is needed for those dependencies.
Project structure
index.html — page structure and external asset references.
css/styles.css — application styles.
js/crypto.js — cryptographic helpers and binary format constants.
js/app.js — UI, PNG generation, and decoding flow.
Security notes
Use a long, unique password. A weak password can be guessed even when strong encryption is used. The project has not been independently security-audited. Keep a backup of important messages and test compatibility before relying on the app for critical data.
License
MIT. See LICENSE.
