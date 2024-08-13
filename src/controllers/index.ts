import { createTextResponse } from '../utils/responseUtils';
import { handleDelete, handleDownload, handleShare, handleUpload } from './driveController';

export async function controller(request: Request, env: any, url: URL): Promise<Response> {
    let response: Response;

    switch (url.pathname) {
        case '/upload':
            response = await handleUpload(request, env);
            break;
        case '/share':
            response = await handleShare(request, env);
            break;
        case '/download':
            response = await handleDownload(request, env, url);
            break;
        case '/delete':
            response = await handleDelete(request, env);
            break;
        default:
            response = new Response('Not found', { status: 404 });
            break;
    }

    return response;
}
