import { encode as base64Encode } from 'base64-arraybuffer';
import { importPrivateKey } from '../utils/jwtUtils';

interface GoogleTokenResponse {
    access_token: string;
    token_type: string;
    expires_in: number;
}

export async function getAccessToken(env: any): Promise<string> {
    const privateKey = env.PRIVATE_KEY || "";
    const clientEmail = env.CLIENT_EMAIL || "";

    if (!privateKey || !clientEmail) {
        throw new Error('Environment variables for Google Service Account are missing.');
    }

    const iat = Math.floor(Date.now() / 1000);
    const exp = iat + 3600; // Token valid for 1 hour

    const header = {
        alg: 'RS256',
        typ: 'JWT',
    };

    const payload = {
        iss: clientEmail,
        scope: 'https://www.googleapis.com/auth/drive.file',
        aud: 'https://oauth2.googleapis.com/token',
        exp: exp,
        iat: iat,
    };

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
        await importPrivateKey(privateKey),
        new TextEncoder().encode(unsignedToken)
    );
    const encodedSignature = base64Encode(signature);

    const jwt = `${unsignedToken}.${encodedSignature}`;

    // Exchange JWT for access token
    const response = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
            assertion: jwt,
        }),
    });

    const data = await response.json() as GoogleTokenResponse;

    if (!data || !data.access_token) {
        throw new Error('Failed to obtain access token.');
    }

    return data.access_token; // คืนค่า access_token ที่ได้รับจาก Google
}
