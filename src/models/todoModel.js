import { supabase } from '../supabase';
// 変換ヘルパーを書く
// モデル内だけで書くのでexport はしない
// DBから取得したデータをReact用に変換する関数。
// 例: { id: 1, name: '買い物', category_id: 2, is_check: false }
//   → { id: 1, name: '買い物', categoryId: 2, isCheck: false }
function toClientTodo(dbTodo) {
    // 分割代入で、is_check と category_id を取り出し、restに残りのプロパティをまとめる
    const { is_check,category_id,...rest } = dbTodo;
    // 変換して返す。is_check → isCheck、category_id → categoryId に変換する
    return {
        ...rest,
        isCheck: is_check,
        categoryId: category_id,
    };
}

// 次にCRUD関数を書く
// state操作はコンポーネントの仕事なので、ここではSupabaseにアクセスしてデータを取得・更新する関数だけを書く

// TODO一覧を取得する関数
export async function fetchAllTodos() {
    const { data,error } = await supabase.from('todos').select('*');
    if (error) {
        console.error(error);
        return [];
    }
    // DBのスネークケースをキャメルケースに変換して返す
    return data.map(todo => toClientTodo(todo));
}

//TODOを挿入する関数
export async function insertTodo(name,categoryId) {
    // SupabaseにTodoを追加する
    // .single() をつけることで [ {id: 1...} ] ではなく {id: 1...} という 「1つのオブジェクト」 として直接受け取れるようになる
    const { data,error } = await supabase
        .from('todos')
        .insert({ name: name,category_id: categoryId,is_check: false })
        .select()
        .single();

    if (error) {
        console.error(error);
        return null;
    }
    // 1件なので(.single()で指定してあるので)mapではなくそのまま渡す
    return toClientTodo(data);
}

// Todoのチェックを切り替える関数。isCheckはtrue/falseで渡す
export async function updateTodoCheck(id,isCheck) {
    // Supabaseのis_checkをfalseに更新する
    const { error } = await supabase.from('todos').update({ is_check: isCheck }).eq('id',id);
    // この関数はデータを返す必要がない（チェックを切り替えるだけ）ので、返すのはtrue/falseの成功失敗だけにする
    // データが欲しい関数（fetch, insert）は、成功したらデータを返す。失敗したらnullを返す。
    // 更新・削除だけの関数（update, delete）は、成功したかどうかだけ返す形にする
    if (error) {
        console.error(error);
        return false;
    }
    return true;
}

export async function updateTodoName(id,name) {
    const { error } = await supabase.from('todos').update({ name: name }).eq('id',id);
    if (error) {
        console.error(error);
        return false;
    }
    return true;
}

export async function deleteTodo(id) {
    const { error } = await supabase.from('todos').delete().eq('id',id);
    if (error) {
        console.error(error);
        return false;
    }
    return true;
}

// reassignは再割り当て：カテゴリー削除時にTodoを未分類(category_id=0)に移動する関数
export async function reassignTodosToUncategorized(categoryId) {
    const { error } = await supabase.from('todos').update({ category_id: 0 }).eq('category_id',categoryId);
    if (error) {
        console.error(error);
        return false;
    }
    return true;
}


