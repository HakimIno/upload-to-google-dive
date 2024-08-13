import { controller } from '../controllers';
import { supabaseAuth } from '../controllers/supabaseController';
import { createTextResponse } from '../utils/responseUtils';

export function addCORSHeaders(response: Response): Response {
    response.headers.set('Access-Control-Allow-Origin', '*'); // หรือกำหนดเป็นโดเมนที่ต้องการ
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS'); // อนุญาต DELETE ด้วย
    response.headers.set('Access-Control-Allow-Headers', 'Authorization, Content-Type, x-refresh-token'); // เพิ่ม x-refresh-token
    return response;
}

export async function handleRequest(request: Request, env: any): Promise<Response> {
    const url = new URL(request.url);
    // ตอบสนองกับ preflight request
    if (request.method === 'OPTIONS') {
        const preflightResponse = new Response(null, { status: 204 });
        return addCORSHeaders(preflightResponse);
    }

    if (url.pathname === "/") {
        return createTextResponse('Upload to Google Drive');
    }

    try {
        await supabaseAuth(request); // ตรวจสอบ JWT token จาก Supabase
    } catch {
        const response = new Response('Invalid token', { status: 401 });
        return addCORSHeaders(response);
    }

    let response = await controller(request, env, url);

    // เพิ่ม CORS headers ให้กับ response
    return addCORSHeaders(response);
}
