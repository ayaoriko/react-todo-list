import type { RefObject } from 'react';
// DBから取得したデータはスネークケース（例: category_id）なので、Reactで使うためのキャメルケース（例: categoryId）に変換するための型と関数を書く
export interface DbTodo {
    id: number;
    name: string;
    category_id: number;
    is_check: boolean;

}

export interface Todo {
    id: number;
    name: string;
    categoryId: number;
    isCheck: boolean;
    isExiting?: boolean; // アニメーション用のフラグ。Todoが削除されるときにtrueになる。削除アニメーションが終わったら親コンポーネントで本当に削除する。
};

export interface Category {
    id: number;
    name: string;
};

export type TodoRefMap = Record<number, RefObject<HTMLLIElement | null>>;
export type CategoryRefMap = Record<number, RefObject<HTMLDivElement | null>>;