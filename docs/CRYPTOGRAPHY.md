__Eeko-Web Cryptography__

This document describes the cryptographic design used by Eeko-Web to encrypt text messages and store the encrypted data inside PNG image cards.

__1. Overview__

Eeko-Web uses the browser's Web Crypto API to encrypt messages before encoding the resulting data into an image.

The image is a data carrier. The confidentiality of the message comes from encryption, not from the appearance of the PNG.

The cryptographic components are:

- AES-256-GCM for authenticated encryption.
- PBKDF2-HMAC-SHA-256 for deriving a key from a password.
- A random salt for key derivation.
- A random nonce for AES-GCM encryption.
- An authentication tag to detect incorrect passwords or tampering.

__2. Encryption Process__

The general encryption flow is:

1. The user enters a message and password.
2. Eeko-Web generates a random salt.
3. PBKDF2 derives a 256-bit encryption key from the password and salt.
4. A random nonce is generated for AES-GCM.
5. The message is encrypted using AES-256-GCM.
6. The required metadata and ciphertext are combined into a binary envelope.
7. The binary data is encoded into a PNG image card.
8. The user downloads the resulting image.

__3. AES-256-GCM__

AES-GCM is an authenticated encryption mode.

Eeko-Web uses a 256-bit AES key. GCM provides two important properties:

- Confidentiality: the orig<br>nal message cannot normally be recovered without the correct key.
- Integrity and authenticity: modifications to the encrypted data are detected during decryption.

The authentication tag is included with the ciphertext by the Web Crypto API.

If authentication fails, decryption should fail rather than return unauthenticated plaintext.

__4. Password-Based Key Derivation__

Passwords are not used directly as AES keys.

Eeko-Web uses PBKDF2 with HMAC-SHA-256 to derive a key from the password and a random salt.

For newly created cards, the implementation uses 600,000 PBKDF2 iterations.

The salt is stored with the encrypted data because the recipient needs it to derive the same key during decryption.

The salt does not need to be secret. Its purpose is to make key derivation specific to each encryption.

PBKDF2 increases the computational cost of trying password guesses, but it cannot make a weak password strong. A long, unique password is recommended.

__5. Salt and Nonce__

__Salt__

The salt is 16 bytes long and is generated randomly for each new card.

It is used by PBKDF2 during key derivation.

__Nonce__

The AES-GCM nonce is 12 bytes long and is generated randomly for each encryption.

Nonce reuse with the same AES-GCM key can seriously compromise security. Eeko-Web generates a fresh nonce for each new encryption.

Neither the salt nor the nonce needs to be kept secret.

__6. Additional Authenticated Data__

Eeko-Web authenticates selected envelope metadata as additional authenticated data (AAD).

The AAD includes the format's magic bytes, version, and iteration count.

This binds those fields to the authentication check so that changes to them cause decryption to fail.

__7. Binary Envelope__

The encrypted envelope contains:

| Field | Size |
| :--- | ---: |
| Magic bytes (`SQCR`) | 4 bytes |
| Format version | 1 byte |
| PBKDF2 iteration count | 4 bytes |
| Salt | 16 bytes |
| AES-GCM nonce | 12 bytes |
| Ciphertext and authentication tag | Variable |


The iteration count is stored as a 4-byte big-endian integer.

The AES-GCM authentication tag is included in the ciphertext output returned by Web Crypto.

The decoder validates the supported iteration-count range before attempting key derivation.

__8. Decryption Process__

When a PNG card is opened:

1. Eeko-Web reads the image pixels.
2. It reconstructs the encoded binary payload.
3. It validates the payload length and envelope structure.
4. It extracts the format metadata, salt, nonce, and ciphertext.
5. It derives the key from the supplied password.
6. AES-GCM verifies the authentication tag and decrypts the data.
7. The original message is returned only if authentication succeeds.

A wrong password or modified encrypted payload should result in a decryption failure.

__9. Security Limitations__

Eeko-Web is a small open-source project and has not been independently security-audited.

Important limitations include:

- Weak passwords may be vulnerable to offline guessing.
- Anyone who obtains a card can attempt password guesses without contacting a server.
- Encryption does not protect a message after it has been decrypted on an accessible device.
- A compromised browser, device, or application can expose plaintext or passwords.
- PNG cards can be copied, shared, or modified; the image format itself does not prevent this.
- Secure encryption does not guarantee that the sender's identity is authentic.

Use a strong, unique password and avoid entering sensitive passwords on untrusted devices.

__10. Implementation and Verification__

The implementation uses the browser's Web Crypto API.

Security-sensitive changes should be tested against:

- Successful encryption and decryption.
- Incorrect passwords.
- Modified or truncated image cards.
- Invalid envelope metadata.
- Compatibility with cards produced by earlier supported versions.

This document describes the intended cryptographic design. Actual behavior should always be verified against the current source code and tested implementation.

---

Project: "Eeko-Web" (https://github.com/chiragcreates/Eeko-Web)
License: MIT
