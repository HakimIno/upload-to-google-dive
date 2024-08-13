
import { deleteFileFromGoogleDrive, downloadFileFromGoogleDrive, shareFileWithUser, uploadToGoogleDrive } from '../services/googleDriveService';
import { createJSONResponse } from '../utils/responseUtils';

export async function handleUpload(request: Request, env: any): Promise<Response> {
    if (request.method !== 'POST') {
        return new Response('Method Not Allowed', { status: 405 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
        return new Response('File not found in form data', { status: 400 });
    }

    const fileName = file.name;
    const uploadResult = await uploadToGoogleDrive(file, fileName, env);

    return createJSONResponse(uploadResult);
}

export async function handleShare(request: Request, env: any): Promise<Response> {
    if (request.method !== 'POST') {
        return new Response('Method Not Allowed', { status: 405 });
    }

    const { fileId, userEmail } = (await request.json()) as { fileId: string; userEmail: string };

    if (!fileId || !userEmail) {
        return new Response('fileId and userEmail are required', { status: 400 });
    }

    try {
        await shareFileWithUser(fileId, userEmail, env);
        return new Response('File shared successfully', { status: 200 });
    } catch (error: any) {
        return new Response(`Failed to share file: ${error.message}`, { status: 500 });
    }
}

export async function handleDownload(request: Request, env: any, url: URL): Promise<Response> {
    if (request.method !== 'GET') {
        return new Response('Method Not Allowed', { status: 405 });
    }

    const fileId = url.searchParams.get('fileId');

    if (!fileId) {
        return new Response('fileId is required', { status: 400 });
    }

    try {
        const fileResponse = await downloadFileFromGoogleDrive(fileId, env);
        return new Response(fileResponse.body, {
            headers: {
                'Content-Type': fileResponse.headers.get('Content-Type') || 'application/octet-stream',
                'Content-Disposition': fileResponse.headers.get('Content-Disposition') || 'attachment',
            },
        });
    } catch (error: any) {
        return new Response(`Failed to download file: ${error.message}`, { status: 500 });
    }
}

export async function handleDelete(request: Request, env: any): Promise<Response> {
    if (request.method !== 'DELETE') {
        return new Response('Method Not Allowed', { status: 405 });
    }

    const { fileId } = (await request.json()) as { fileId: string };

    if (!fileId) {
        return new Response('fileId is required', { status: 400 });
    }

    try {
        await deleteFileFromGoogleDrive(fileId, env);
        return new Response('File deleted successfully', { status: 200 });
    } catch (error: any) {
        return new Response(`Failed to delete file: ${error.message}`, { status: 500 });
    }
}

