**Eeko-Web 🔐**

Turn your secret messages into PNG image cards.

Eeko-Web is a browser-based application that encrypts text with a password and encodes the encrypted data into a PNG image card. The recipient can upload the image and enter the correct password to recover the original message.

**🌐 Live Demo:**
"Launch Eeko-Web" (https://chiragcreates.github.io/Eeko-Web/)

**✨ Features**

- 🔒 Password-based encryption — protect messages with a password.
- 🖼️ PNG message cards — encode encrypted data into downloadable images.
- 🔓 Message decryption — recover messages using the original password and image card.
- 🌐 Browser-based — use the application in a compatible modern web browser.
- 📱 Responsive interface — designed for convenient use across screen sizes.
- 🧩 Separated source files — HTML, CSS, and JavaScript are organized for easier maintenance.
- 🆓 Open source — available under the MIT License.

**🛠️ Technologies**

- HTML5
- CSS3
- JavaScript
- Web Crypto API
- AES-GCM authenticated encryption
- PBKDF2 key derivation with HMAC-SHA-256
- HTML Canvas API for PNG card generation and decoding

**🚀 Getting Started**

Use the live application

Visit the "Eeko-Web live demo" (https://chiragcreates.github.io/Eeko-Web/).

**Run locally**

1. Download or clone this repository.
2. Keep the original folder structure intact.
3. Open "index.html" in a modern browser, or serve the project using a local web server.
4. Enter a message and password to create a card.
5. Download the PNG and test decryption by uploading it and entering the same password.

A secure browser context may be required for Web Crypto API functionality. GitHub Pages provides HTTPS.

**📁 Project Structure**

Eeko-Web/
├── index.html
├── CSS/
│   └── styles.css
├── js/
│   ├── crypto.js
│   └── app.js
├── README.md
└── LICENSE

**🔐 Security Overview**

Eeko-Web uses established browser cryptography APIs:

- AES-GCM provides encryption and authentication.
- PBKDF2-HMAC-SHA-256 derives an encryption key from the user's password.
- A random salt helps prevent identical passwords from deriving identical keys across independently created cards.
- A random nonce is used for AES-GCM encryption.
- Authentication helps detect incorrect passwords and modified encrypted data.

The PNG image is a carrier for encrypted data; the image itself is not the encryption mechanism.

**Important security notes**

- Choose a strong, unique password and share it securely with the intended recipient.
- Anyone who obtains a card may attempt to guess its password offline.
- Do not assume that a password-protected image is impossible to crack.
- Keep backups of important messages and test the decryption process before relying on a card.
- The project has not been independently security-audited.

__🤝 Contributing__

Contributions, bug reports, and suggestions are welcome.

1. Fork the repository.
2. Create a branch for your change.
3. Make and test your changes.
4. Submit a pull request describing the improvement.

Please report potential security issues responsibly rather than publishing sensitive exploit details.

**📜 License**

This project is distributed under the MIT License. See the "LICENSE" (LICENSE) file for details.

**👨‍💻 Project**

Eeko-Web — an open-source experiment in password-based message encryption and image-based data encoding.

- Repository: "chiragcreates/Eeko-Web" (https://github.com/chiragcreates/Eeko-Web)
- Live Demo: "chiragcreates.github.io/Eeko-Web" (https://chiragcreates.github.io/Eeko-Web/)

---

Built to explore encryption, browser APIs, and creative ways to carry encrypted messages.
