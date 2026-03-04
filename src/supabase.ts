import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_KEY;

//  エラーを防ぐために、SupabaseのURLとKeyが存在しない場合はここでエラーを投げるようにする
if (!supabaseUrl || !supabaseKey) throw new Error('Supabase URL or Key not found');
export const supabase = createClient(supabaseUrl, supabaseKey);