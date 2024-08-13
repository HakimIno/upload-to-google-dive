// googleDriveService.ts
import { getAccessToken } from './authService';

export async function uploadToGoogleDrive(file: File, fileName: string, env: any): Promise<any> {
    const accessToken = await getAccessToken(env);

    const metadata = {
        name: fileName,
        mimeType: file.type,
    };

    const boundary = 'foo_bar_baz';
    const delimiter = `\r\n--${boundary}\r\n`;
    const closeDelimiter = `\r\n--${boundary}--`;

    const metadataPart =
        delimiter +
        'Content-Type: application/json; charset=UTF-8\r\n\r\n' +
        JSON.stringify(metadata) +
        '\r\n';

    const filePart =
        delimiter +
        `Content-Type: ${file.type}\r\n\r\n`;

    const body = new Blob([metadataPart, filePart, new Uint8Array(await file.arrayBuffer()), closeDelimiter], { type: 'multipart/related; boundary=' + boundary });

    const response = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
        body,
    });

    return await response.json();
}

export async function shareFileWithUser(fileId: string, userEmail: string, env: any) {
    const accessToken = await getAccessToken(env);

    const response = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}/permissions`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            role: 'reader',
            type: 'user',
            emailAddress: userEmail,
        }),
    });

    if (!response.ok) {
        throw new Error(`Failed to share file: ${response.statusText}`);
    }
}

export async function downloadFileFromGoogleDrive(fileId: string, env: any): Promise<Response> {
    const accessToken = await getAccessToken(env);

    const response = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });

    if (!response.ok) {
        throw new Error(`Failed to download file: ${response.statusText}`);
    }

    return response;
}

export async function deleteFileFromGoogleDrive(fileId: string, env: any): Promise<void> {
    const accessToken = await getAccessToken(env);

    const response = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}`, {
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });

    if (!response.ok) {
        throw new Error(`Failed to delete file: ${response.statusText}`);
    }
}
