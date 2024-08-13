import { encode as base64Encode } from 'base64-arraybuffer';

export function base64ToArrayBuffer(base64: string): ArrayBuffer {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
}

export function importPrivateKey(pem: string): Promise<CryptoKey> {
    const binaryDerString = pem.replace(/(-----(BEGIN|END) PRIVATE KEY-----|\n|\r)/g, '');
    const binaryDer = base64ToArrayBuffer(binaryDerString);

    return crypto.subtle.importKey(
        'pkcs8',
        binaryDer,
        {
            name: 'RSASSA-PKCS1-v1_5',
            hash: 'SHA-256',
        },
        true,
        ['sign']
    );
}

export async function createJWT(header: object, payload: object, privateKey: CryptoKey): Promise<string> {
    // Encode header and payload to base64
    const encodedHeader = base64Encode(new TextEncoder().encode(JSON.stringify(header)));
    const encodedPayload = base64Encode(new TextEncoder().encode(JSON.stringify(payload)));

    // Sign the JWT using the private key
    const unsignedToken = `${encodedHeader}.${encodedPayload}`;
    const signature = await crypto.subtle.sign(
        {
            name: 'RSASSA-PKCS1-v1_5',
            hash: 'SHA-256',
        },
        privateKey,
        new TextEncoder().encode(unsignedToken)
    );
    const encodedSignature = base64Encode(signature);

    return `${unsignedToken}.${encodedSignature}`;
}
