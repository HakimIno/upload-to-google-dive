import { verifySupabaseToken } from '../services/supabaseService';

export async function supabaseAuth(request: Request): Promise<void> {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new Error('Unauthorized');
    }

    const token = authHeader.split(' ')[1];
    await verifySupabaseToken(token); // ตรวจสอบ JWT token
}
