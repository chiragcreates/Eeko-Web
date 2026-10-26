__Contributing to Eeko-Web__

Thank you for your interest in contributing to Eeko-Web!

Eeko-Web is an open-source, browser-based application for encrypting text messages and encoding the encrypted data into PNG image cards. Contributions that improve reliability, usability, accessibility, documentation, and security are welcome.

__Ways to Contribute__

You can help by:

- Reporting bugs.
- Suggesting useful features.
- Improving documentation.
- Fixing reproducible issues.
- Improving accessibility and responsive design.
- Adding tests for encryption, decryption, and PNG handling.
- Reviewing code for correctness and maintainability.

__Reporting Bugs__

Before reporting a bug:

1. Check existing issues to avoid duplicates.
2. Confirm that you're using the latest version.
3. Describe the problem and the expected behavior.
4. Include reproducible steps and relevant browser information.

Never include real passwords, private messages, or sensitive personal information in an issue.

For suspected security vulnerabilities, follow the instructions in "SECURITY.md" (SECURITY.md) instead of publicly disclosing sensitive technical details.

__Suggesting Features__

When suggesting a feature, explain:

- The problem it solves.
- How you expect it to work.
- Why it would benefit Eeko-Web.
- Any usability, compatibility, or security considerations.

Features affecting encryption, the binary envelope, or PNG encoding should include a compatibility and testing plan.

__Code Contributions__

For code changes:

1. Fork the repository.
2. Create a branch for your change.
3. Make a focused, clearly scoped change.
4. Test the affected functionality.
5. Update documentation when necessary.
6. Submit a pull request describing the change and its tests.

__Development Guidelines__

- Keep HTML, CSS, and JavaScript organized in their existing folders.
- Follow the current code style where practical.
- Avoid introducing unnecessary dependencies.
- Keep user-facing errors clear and avoid exposing sensitive information.
- Validate untrusted image data and binary metadata before processing.
- Do not weaken cryptographic settings or bypass authentication checks.
- Do not reuse an AES-GCM nonce with the same key.
- Document changes to the card format and consider backward compatibility.

__Testing__

Before submitting changes, test relevant behavior, including:

- Successful encryption and decryption.
- Incorrect passwords.
- Unsupported and malformed images.
- Empty and longer messages.
- Repeated encryption of the same message.
- Compatibility with previously generated cards when changing the format.

Describe which tests you performed and any known limitations. Manual checks are useful but do not replace automated testing or a security audit.

__Pull Requests__

A pull request should include:

- A clear summary of the change.
- The reason for the change.
- Testing performed.
- Screenshots for meaningful interface changes, when helpful.
- Documentation updates, if applicable.

Keep pull requests focused so that changes are easier to review.

__Code of Conduct__

Be respectful, constructive, and considerate. Criticism should focus on the work, not the person.

Thank you for helping improve Eeko-Web!

---

License: MIT
