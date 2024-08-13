export function createTextResponse(text: string): Response {
    return new Response(text, {
        headers: { 'Content-Type': 'text/plain' },
    });
}

export function createJSONResponse(data: any): Response {
    return new Response(JSON.stringify(data), {
        headers: { 'Content-Type': 'application/json' },
    });
}

export function addCORSHeaders(response: Response): void {
    response.headers.set('Access-Control-Allow-Origin', '*'); // หรือกำหนดเป็นโดเมนที่ต้องการ
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type');
}
