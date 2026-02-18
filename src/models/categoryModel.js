import { supabase } from '../supabase';
import { reassignTodosToUncategorized } from './todoModel';

// 一覧を取得する関数
export async function fetchAllCategories() {
    const { data,error } = await supabase.from('categories').select('*');
    if (error) {
        console.error(error);
        return [];
    }
    // DBのスネークケースをキャメルケースに変換して返す
    return data;
}

//カテゴリーを挿入する関数
export async function insertCategory(name) {
    // Supabaseにカテゴリーを追加する
    // .single() をつけることで [ {id: 1...} ] ではなく {id: 1...} という 「1つのオブジェクト」 として直接受け取れるようになる
    const { data,error } = await supabase
        .from('categories')
        .insert({ name: name })
        .select()
        .single();

    if (error) {
        console.error(error);
        return null;
    }
    // 1件なので(.single()で指定してあるので)mapではなくそのまま渡す
    return data;
}

export async function updateCategoryName(id,name) {
    const { error } = await supabase.from('categories').update({ name: name }).eq('id',id);
    if (error) {
        console.error(error);
        return false;
    }
    return true;
}

export async function deleteCategory(id) {
    // 1. そのカテゴリーに属するTodoを「未分類」に移動
    const reassignSuccess = await reassignTodosToUncategorized(id);
    if (!reassignSuccess) return false;

    // 2. カテゴリーを削除
    const { error } = await supabase.from('categories').delete().eq('id',id);
    if (error) {
        console.error(error);
        return false;
    }
    return true;
}
