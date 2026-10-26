/* Eeko-Web user interface, card rendering, and encryption/decryption actions. */

"use strict";

function switchTab(mode) {
    const encSection = document.getElementById("encoderSection");
    const decSection = document.getElementById("decoderSection");
    const encTab = document.getElementById("tabEncoder");
    const decTab = document.getElementById("tabDecoder");
    const encoderActive = mode === "encoder";

    encSection.classList.toggle("hidden", !encoderActive);
    decSection.classList.toggle("hidden", encoderActive);
    encTab.classList.toggle("active", encoderActive);
    decTab.classList.toggle("active", !encoderActive);
    encTab.setAttribute("aria-pressed", String(encoderActive));
    decTab.setAttribute("aria-pressed", String(!encoderActive));
}

let toastTimeout;

function showToast(message) {
    const toast = document.getElementById("toast");
    document.getElementById("toastMsg").innerText = message;
    toast.classList.remove("opacity-0");
    toast.classList.add("opacity-100");

    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
        toast.classList.remove("opacity-100");
        toast.classList.add("opacity-0");
    }, 3000);
}

function updateFileName(input) {
    const display = document.getElementById("fileNameDisplay");
    display.innerText = input.files && input.files[0]
        ? input.files[0].name
        : "No image chosen.";
}

async function handleEncrypt() {
    const message = document.getElementById("encMessage").value;
    const password = document.getElementById("encPassword").value;
    const confirmation = document.getElementById("encConfirm").value;

    if (!message) {
        showToast("Please enter a secret message.");
        return;
    }
    if (!password) {
        showToast("Please create a password.");
        return;
    }
    if (password !== confirmation) {
        showToast("Passwords do not match.");
        return;
    }

    const button = document.getElementById("btnEncrypt");
    button.innerText = "Encrypting...";
    button.disabled = true;
    await new Promise(resolve => setTimeout(resolve, 50));

    try {
        const salt = window.crypto.getRandomValues(new Uint8Array(SALT_LEN));
        const nonce = window.crypto.getRandomValues(new Uint8Array(NONCE_LEN));
        const versionBytes = new Uint8Array([VERSION]);
        const iterationBytes = packUint32BE(ITERATIONS);
        const aad = concatUint8Arrays(MAGIC, versionBytes, iterationBytes);

        const key = await deriveKey(password, salt, ITERATIONS);
        const ciphertextBuffer = await window.crypto.subtle.encrypt(
            { name: "AES-GCM", iv: nonce, additionalData: aad },
            key,
            new TextEncoder().encode(message)
        );
        const ciphertext = new Uint8Array(ciphertextBuffer);
        const envelope = concatUint8Arrays(
            MAGIC, versionBytes, iterationBytes, salt, nonce, ciphertext
        );
        const payload = concatUint8Arrays(packUint32BE(envelope.length), envelope);

        renderCard(payload);
        showToast("Card generated successfully!");
    } catch (error) {
        console.error(error);
        showToast("Encryption failed. Please try again.");
    } finally {
        button.innerText = "Encrypt Message";
        button.disabled = false;
    }
}

function renderCard(payload) {
    const bits = bytesToBits(payload);
    const cols = Math.ceil(Math.sqrt(bits.length));
    const rows = Math.ceil(bits.length / cols);
    const width = cols * CELL + 2 * MARGIN;
    const height = rows * CELL + 2 * MARGIN;

    const canvas = document.getElementById("cardCanvas");
    canvas.width = width;
    canvas.height = height;

    const context = canvas.getContext("2d");
    context.fillStyle = "#FFFFFF";
    context.fillRect(0, 0, width, height);

    // Three orientation anchors, matching the original card format.
    const anchorSize = 60;
    context.fillStyle = "#000000";
    context.fillRect(20, 20, anchorSize, anchorSize);
    context.fillRect(width - 20 - anchorSize, 20, anchorSize, anchorSize);
    context.fillRect(20, height - 20 - anchorSize, anchorSize, anchorSize);

    const padding = Math.max(1, Math.floor(CELL / 8));
    for (let i = 0; i < rows * cols; i++) {
        const row = Math.floor(i / cols);
        const col = i % cols;
        const x = MARGIN + col * CELL;
        const y = MARGIN + row * CELL;
        const isOne = i < bits.length && bits[i] === 1;

        if (isOne) {
            context.fillStyle = "#000000";
            context.fillRect(x + padding, y + padding, CELL - 2 * padding, CELL - 2 * padding);
        } else {
            context.strokeStyle = "#DCDCDC";
            context.lineWidth = 1;
            context.strokeRect(x + padding, y + padding, CELL - 2 * padding, CELL - 2 * padding);
        }
    }

    document.getElementById("encPlaceholder").classList.add("hidden");
    canvas.classList.remove("hidden");
    document.getElementById("btnDownload").classList.remove("hidden");
}

function downloadCard() {
    const canvas = document.getElementById("cardCanvas");
    const link = document.createElement("a");
    link.download = "secure_secret_card.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
}

async function handleDecrypt() {
    const fileInput = document.getElementById("decFile");
    const password = document.getElementById("decPassword").value;

    if (!fileInput.files || !fileInput.files[0]) {
        showToast("Please choose a card image file.");
        return;
    }
    if (!password) {
        showToast("Please enter the password.");
        return;
    }

    const button = document.getElementById("btnDecrypt");
    button.innerText = "Decrypting...";
    button.disabled = true;
    await new Promise(resolve => setTimeout(resolve, 50));

    try {
        const file = fileInput.files[0];
        const image = await loadImage(file);

        // Guard against unexpectedly huge images before allocating canvas memory.
        if (!image.width || !image.height || image.width * image.height > 40000000) {
            throw new Error("Image dimensions are invalid or too large.");
        }

        const rawPayload = readCardFromCanvas(image);
        const minimumLength = 4 + 1 + 4 + SALT_LEN + NONCE_LEN + 16;
        if (rawPayload.length < minimumLength) {
            throw new Error("Encrypted payload is corrupted or too short.");
        }

        for (let i = 0; i < MAGIC.length; i++) {
            if (rawPayload[i] !== MAGIC[i]) {
                throw new Error("Not a supported square card format.");
            }
        }
        if (rawPayload[4] !== VERSION) {
            throw new Error(`Unsupported format version: ${rawPayload[4]}`);
        }

        const iterations = unpackUint32BE(rawPayload, 5);
        if (iterations < MIN_ITERATIONS || iterations > MAX_ITERATIONS) {
            throw new Error("Invalid password derivation settings.");
        }

        const salt = rawPayload.slice(9, 9 + SALT_LEN);
        const nonceStart = 9 + SALT_LEN;
        const nonce = rawPayload.slice(nonceStart, nonceStart + NONCE_LEN);
        const ciphertext = rawPayload.slice(nonceStart + NONCE_LEN);
        const aad = concatUint8Arrays(
            MAGIC, new Uint8Array([VERSION]), packUint32BE(iterations)
        );

        const key = await deriveKey(password, salt, iterations);
        const plaintextBuffer = await window.crypto.subtle.decrypt(
            { name: "AES-GCM", iv: nonce, additionalData: aad },
            key,
            ciphertext
        );

        document.getElementById("decResult").value = new TextDecoder().decode(plaintextBuffer);
        showToast("Message decrypted successfully!");
    } catch (error) {
        console.error(error);
        showToast("Could not decrypt: wrong password, damaged image, or unsupported card.");
    } finally {
        button.innerText = "Decrypt Message";
        button.disabled = false;
    }
}

function loadImage(file) {
    return new Promise((resolve, reject) => {
        const image = new Image();
        const objectUrl = URL.createObjectURL(file);

        image.onload = () => {
            URL.revokeObjectURL(objectUrl);
            resolve(image);
        };
        image.onerror = () => {
            URL.revokeObjectURL(objectUrl);
            reject(new Error("Failed to read image file."));
        };
        image.src = objectUrl;
    });
}

function readCardFromCanvas(image) {
    const canvas = document.getElementById("processingCanvas");
    canvas.width = image.width;
    canvas.height = image.height;

    const context = canvas.getContext("2d", { willReadFrequently: true });
    context.drawImage(image, 0, 0);

    const width = image.width;
    const height = image.height;
    const gridWidth = width - 2 * MARGIN;
    const gridHeight = height - 2 * MARGIN;

    if (gridWidth <= 0 || gridHeight <= 0 ||
        gridWidth % CELL !== 0 || gridHeight % CELL !== 0) {
        throw new Error("Image dimensions do not match the expected card grid.");
    }

    const cols = gridWidth / CELL;
    const rows = gridHeight / CELL;
    const imageData = context.getImageData(0, 0, width, height);
    const data = imageData.data;
    const bits = [];

    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            const centerX = MARGIN + col * CELL + Math.floor(CELL / 2);
            const centerY = MARGIN + row * CELL + Math.floor(CELL / 2);
            let sum = 0;
            let count = 0;

            for (let dy = -1; dy <= 1; dy++) {
                for (let dx = -1; dx <= 1; dx++) {
                    const pixelX = centerX + dx;
                    const pixelY = centerY + dy;
                    const index = (pixelY * width + pixelX) * 4;
                    sum += (data[index] + data[index + 1] + data[index + 2]) / 3;
                    count++;
                }
            }
            bits.push(sum / count < 128 ? 1 : 0);
        }
    }

    const raw = bitsToBytes(bits);
    if (raw.length < 4) {
        throw new Error("Card payload is empty or invalid.");
    }

    const payloadLength = unpackUint32BE(raw, 0);
    if (payloadLength === 0 || payloadLength > raw.length - 4) {
        throw new Error("Invalid payload header length.");
    }
    return raw.slice(4, 4 + payloadLength);
}
