import { createClient } from '@supabase/supabase-js';

const supabaseUrl = '';
const supabaseKey = '';
const supabase = createClient(supabaseUrl, supabaseKey);

// ฟังก์ชันตรวจสอบ JWT token และดึงข้อมูลผู้ใช้
export async function verifySupabaseToken(token: string) {

    try {
        // เรียก Supabase API เพื่อตรวจสอบ token และดึงข้อมูลผู้ใช้
        const { data: user, error } = await supabase.auth.getUser(token);

        if (error || !user) {
            throw new Error('User not found');
        }

        return user; // ส่งข้อมูลผู้ใช้กลับไป
    } catch (error) {
        console.error('Token verification failed:', error);
        throw new Error('Invalid token');
    }
}
