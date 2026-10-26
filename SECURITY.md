**Security Policy**

__Overview__

Eeko-Web is an open-source, browser-based application that encrypts text messages and encodes the encrypted data into PNG image cards.

Security is an important part of the project. However, Eeko-Web has not been independently security-audited, and users should evaluate its limitations before relying on it for sensitive information.

__Supported Versions__

The latest version available on the main branch is the primary development version.

Security fixes may not be backported to older versions. Users should use the latest version and review project updates.

__Security Features__

Eeko-Web uses browser cryptography APIs and includes:

- AES-256-GCM authenticated encryption.
- PBKDF2-HMAC-SHA-256 for password-based key derivation.
- Random salts and nonces.
- Authentication checks during decryption.

These mechanisms help protect message confidentiality and detect changes to encrypted data when correctly implemented and used.

__Security Limitations__

Users should understand the following limitations:

- Password strength: Weak passwords may be vulnerable to offline guessing.
- Device security: Malware, compromised browsers, or shared devices may expose messages or passwords.
- Image sharing: Anyone who obtains a PNG card can attempt to guess its password.
- No identity verification: Encryption does not prove who created or sent a card.
- No independent audit: The application has not undergone an independent professional security audit.
- Browser environment: The security of the application also depends on the integrity of the browser and the code being served.

Do not treat Eeko-Web as a substitute for a professionally audited communication system when handling highly sensitive information.

__Reporting a Vulnerability__

If you discover a potential security vulnerability, please report it privately to the project maintainer through a private communication channel before publishing technical details.

Include, where possible:

- A description of the suspected vulnerability.
- The affected file or feature.
- Steps to reproduce the issue.
- The potential security impact.
- Any suggested mitigation.

Please avoid including real passwords, private messages, or other sensitive information in a report.

Do not publish exploit details or sensitive user data before the issue has been assessed.

__Responsible Disclosure__

The project maintainer will make a reasonable effort to review responsible vulnerability reports and address confirmed issues.

As this is an independent open-source project, response and remediation times are not guaranteed.

__Scope__

This policy covers the Eeko-Web source code and the official deployment maintained by the project owner.

Third-party libraries, browser vulnerabilities, and unrelated services may have separate reporting processes.

---

Project: "Eeko-Web" (https://github.com/chiragcreates/Eeko-Web)
License: MIT
