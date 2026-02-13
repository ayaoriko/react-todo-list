import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://snjhkthimhahomncxxvy.supabase.co';
const supabaseKey = 'sb_publishable_Sn1RUWiO3T2hQcO2UFY27w_HTyz-TrZ';

export const supabase = createClient(supabaseUrl,supabaseKey);