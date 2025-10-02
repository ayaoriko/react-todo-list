import { useState } from 'react';

import Header from './components/Header';
import TodoForm from './components/TodoForm';
import TodoList from './components/TodoList';
import Footer from './components/Footer';

import initialTodos from "./data/TodoList.json";
import initialCategoryList from "./data/TodoCategory.json";
export default function App() {

  // チェックの有無を管理するために、initialTodosの配列にisCheck: falseを追加する
  const [todos,setTodos] = useState(initialTodos.map(todo => ({ ...todo,isCheck: false })));

  /** 1行で書くと
   * const allCategories = Array.from(new Set(initialTodos.map(todo => todo.category))); 
   ***/
  /** カテゴリーのみピックアップ **/
  // let allCategories = initialTodos.map(todo => todo.category);
  /** new Set(...) で重複を削除 **/
  /** Array.from(...) で もう一度「配列として扱える形」に戻す **/
  // allCategories = Array.from(new Set(allCategories));
  const [categoryList,setCategoryList] = useState(initialCategoryList);

  return (
    <div className="root-inner">
      <Header />
      <TodoForm todos={todos} setTodos={setTodos} categoryList={categoryList} setCategoryList={setCategoryList} />
      <TodoList todos={todos} setTodos={setTodos} categoryList={categoryList} setCategoryList={setCategoryList} />
      <Footer />
    </div>
  );
}