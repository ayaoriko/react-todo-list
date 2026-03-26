
// Laravel移行に伴いコメントアウト
//import { supabase } from '../supabase';

// カテゴリー削除時にTodoを未分類(category_id=0)に移動する処理はLaravel側で行うためコメントアウト
//import { reassignTodosToUncategorized } from './todoModel';

import type { Category } from '../types/index';

const BASE_URL = process.env.REACT_APP_LARAVEL_API_URL;
const CATEGORY_URL = `${BASE_URL}/categories`;

// 一覧を取得する関数
export async function fetchAllCategories(): Promise<Category[]> {
    try {
        // Supabaseからカテゴリーを全件取得する
        // Supabaseはどのカラムを取得するか指定する必要があるのでselect('*')が必要だが、LaravelはAPIはLaravel側のコントローラーで返すデータを制御しているので、単純にfetchするだけでOK
        // const { data, error } = await supabase.from('categories').select('*');
        const response = await fetch(CATEGORY_URL);
        const data = await response.json();
        //  型アサーション。「data  の戻り値は Category[] だよ」と断言。
        // Promise<Category[]> としているので、指定しなくてもOKだが、明示的に指定することで、コードを読む人に「この関数はCategoryの配列を返すんだな」とわかりやすくなる。
        return data as Category[];
    } catch (error) {
        console.error(error);
        return [];
    }
}

//カテゴリーを挿入する関数
export async function insertCategory(name: string): Promise<any> {
    // Supabaseにカテゴリーを追加する
    // .single() をつけることで [ {id: 1...} ] ではなく {id: 1...} という 「1つのオブジェクト」 として直接受け取れるようになる
    //const { data, error } = await supabase
    //    .from('categories')
    //    .insert({ name: name })
    //    .select()
    //    .single();
    // 1件なので(.single()で指定してあるので)mapではなくそのまま渡す
    //return data;
    try {
        const response = await fetch(CATEGORY_URL,
            {
                method: 'POST', headers: { 'Content-Type': 'application/json', },
                body: JSON.stringify({ name: name }),
            });
        const data = await response.json(); return data;
    } catch (error) {
        console.error(error);
        return null;
    }
}

// Category 型が他に createdAt とか slug とか持っていたとしても、名前の更新には不要なプロパティなので、引数の型は Category ではなく、更新に必要な id と name のみに絞った方が、この関数の目的が明確になる
export async function updateCategoryName(id: number, name: string): Promise<boolean> {
    try {
        //const { error } = await supabase.from('categories').update({ name: name }).eq('id', id);
        //if (error) {
        //    console.error(error);
        //    return false;
        //}
        const response = await fetch(`${CATEGORY_URL}/${id}`,
            {
                method: 'PUT', headers: { 'Content-Type': 'application/json', },
                body: JSON.stringify({ name: name }),
            });
        // レスポンスの中身を使わない場合はresponse.json()は不要
        //const data = await response.json(); return true;
        return true;
    } catch (error) {
        console.error(error);
        return false;
    }
}

// async 関数がついている場合、TypeScriptでは Promise<...> の形で返り値の型を指定することが一般的です。
// ここでは、削除が成功したかどうかを boolean 型で返すため、Promise<boolean> としています。
export async function deleteCategory(id: number): Promise<boolean> {
    // 1. そのカテゴリーに属するTodoを「未分類」に移動
    // laravelのAPI側で、カテゴリーを削除する前に、そのカテゴリーに属するTodoを「未分類」に移動する処理が入っているので、フロント側では特に何もする必要はない。
    //const reassignSuccess = await reassignTodosToUncategorized(id);
    //if (!reassignSuccess) return false;

    // 2. カテゴリーを削除
    //const { error } = await supabase.from('categories').delete().eq('id', id);
    //if (error) {
    //    console.error(error);
    //    return false;
    //}
    try {
        const response = await fetch(`${CATEGORY_URL}/${id}`,
            {
                method: 'DELETE', headers: { 'Content-Type': 'application/json', }
            });
        return true;
    } catch (error) {
        console.error(error);
        return false;
    }
}
