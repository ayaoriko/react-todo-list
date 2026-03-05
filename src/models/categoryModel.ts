import { supabase } from '../supabase';
import { reassignTodosToUncategorized } from './todoModel';
import type { Category } from '../types/index';

// 一覧を取得する関数
export async function fetchAllCategories(): Promise<Category[]> {
    const { data, error } = await supabase.from('categories').select('*');
    if (error) {
        console.error(error);
        return [];
    }
    // DBのスネークケースをキャメルケースに変換して返す
    return data as Category[]; // //  型アサーション。「data  の戻り値は Category[] だよ」と断言
}

//カテゴリーを挿入する関数
export async function insertCategory(name: string): Promise<any> {
    // Supabaseにカテゴリーを追加する
    // .single() をつけることで [ {id: 1...} ] ではなく {id: 1...} という 「1つのオブジェクト」 として直接受け取れるようになる
    const { data, error } = await supabase
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

// Category 型が他に createdAt とか slug とか持っていたとしても、名前の更新には不要なプロパティなので、引数の型は Category ではなく、更新に必要な id と name のみに絞った方が、この関数の目的が明確になる
export async function updateCategoryName(id: number, name: string): Promise<boolean> {
    const { error } = await supabase.from('categories').update({ name: name }).eq('id', id);
    if (error) {
        console.error(error);
        return false;
    }
    return true;
}

// async 関数がついている場合、TypeScriptでは Promise<...> の形で返り値の型を指定することが一般的です。
// ここでは、削除が成功したかどうかを boolean 型で返すため、Promise<boolean> としています。
export async function deleteCategory(id: number): Promise<boolean> {
    // 1. そのカテゴリーに属するTodoを「未分類」に移動
    const reassignSuccess = await reassignTodosToUncategorized(id);
    if (!reassignSuccess) return false;

    // 2. カテゴリーを削除
    const { error } = await supabase.from('categories').delete().eq('id', id);
    if (error) {
        console.error(error);
        return false;
    }
    return true;
}
