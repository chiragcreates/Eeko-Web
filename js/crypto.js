/*
 * Eeko-Web cryptographic and binary-format helpers.
 *
 * Format compatibility:
 * MAGIC (4) | VERSION (1) | ITERATIONS (4, big-endian) |
 * SALT (16) | NONCE (12) | AES-GCM ciphertext + authentication tag
 */

"use strict";

const MAGIC = new Uint8Array([0x53, 0x51, 0x43, 0x52]); // "SQCR"
const VERSION = 1;
const ITERATIONS = 600000;
const SALT_LEN = 16;
const NONCE_LEN = 12;
const CELL = 16;
const MARGIN = 120;
const MIN_ITERATIONS = 100000;
const MAX_ITERATIONS = 2000000;

async function deriveKey(password, salt, iterations) {
    const enc = new TextEncoder();
    const keyMaterial = await window.crypto.subtle.importKey(
        "raw",
        enc.encode(password),
        "PBKDF2",
        false,
        ["deriveKey"]
    );

    return window.crypto.subtle.deriveKey(
        {
            name: "PBKDF2",
            salt,
            iterations,
            hash: "SHA-256"
        },
        keyMaterial,
        { name: "AES-GCM", length: 256 },
        false,
        ["encrypt", "decrypt"]
    );
}

function bytesToBits(bytes) {
    const bits = [];
    for (let i = 0; i < bytes.length; i++) {
        for (let shift = 7; shift >= 0; shift--) {
            bits.push((bytes[i] >> shift) & 1);
        }
    }
    return bits;
}

function bitsToBytes(bits) {
    const usable = bits.length - (bits.length % 8);
    const out = new Uint8Array(usable / 8);

    for (let i = 0; i < usable; i += 8) {
        let value = 0;
        for (let bit = 0; bit < 8; bit++) {
            value = (value << 1) | bits[i + bit];
        }
        out[i / 8] = value;
    }
    return out;
}

function packUint32BE(value) {
    const buffer = new ArrayBuffer(4);
    new DataView(buffer).setUint32(0, value, false);
    return new Uint8Array(buffer);
}

function unpackUint32BE(bytes, offset = 0) {
    if (offset < 0 || offset + 4 > bytes.length) {
        throw new Error("Not enough bytes to read a 32-bit integer.");
    }
    const view = new DataView(bytes.buffer, bytes.byteOffset + offset, 4);
    return view.getUint32(0, false);
}

function concatUint8Arrays(...arrays) {
    const totalLength = arrays.reduce((sum, array) => sum + array.length, 0);
    const result = new Uint8Array(totalLength);
    let offset = 0;

    for (const array of arrays) {
        result.set(array, offset);
        offset += array.length;
    }
    return result;
}
