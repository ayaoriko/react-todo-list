import { useState,useEffect,useRef,createRef } from 'react';

import Header from './components/Header';
import TodoForm from './components/TodoForm';
import TodoList from './components/TodoList';
import Footer from './components/Footer';

import initialTodos from "./data/TodoList.json";
import initialCategoryList from "./data/TodoCategory.json";

export default function App() {
  // チェックの有無を管理するために、initialTodosの配列にisCheck: falseを追加する
  // useStateのtodosは「データとしてのTodoリスト」
  const [todos,setTodos] = useState(initialTodos.map(todo => ({ ...todo,isCheck: false })));

  // todoRefsはDOM要素としてのTodoリスト」
  // 最初の1回しかアニメーションが効かない問題を解決するために、useRef({})で作ったtodoRefsに一度作ったrefを保存しておくことで、毎回新しいrefが作られないようにする
  // todoRefsはあくまで「どのDOM要素がどのtodoに対応しているか」を管理するための対応表で、画面に表示する内容とは別物
  const todoRefs = useRef({});

  // refがなければ作る
  todos.forEach(todo => {
    if (!todoRefs.current[todo.id]) {
      todoRefs.current[todo.id] = createRef();
    }
  });


  /** 1行で書くと
   * const allCategories = Array.from(new Set(initialTodos.map(todo => todo.category))); 
   ***/
  /** カテゴリーのみピックアップ **/
  // let allCategories = initialTodos.map(todo => todo.category);
  /** new Set(...) で重複を削除 **/
  /** Array.from(...) で もう一度「配列として扱える形」に戻す **/
  // allCategories = Array.from(new Set(allCategories));
  const [categoryList,setCategoryList] = useState(initialCategoryList);
  // 追加したTodoのIDを保存するstate
  const [lastAddedId,setLastAddedId] = useState(null);

  // カテゴリーもtodoRefsと同様にrefを管理する
  const categoryRefs = useRef({});
  categoryList.forEach(cat => {
    if (!categoryRefs.current[cat.id]) {
      categoryRefs.current[cat.id] = createRef();
    }
  });

  // これを使って、追加したTodoまでスクロールする
  // useRef(null)で初期化したlastAddedRef 
  // <li ref={lastAddedRef}>のようにHTML上で指定することで、
  // liをDOMに配置した瞬間にlastAddedRef.currentにそのDOM要素が入ります。
  const lastAddedRef = useRef(null);
  // useEffectはlastAddedIdが変わるたびに実行されるので、
  useEffect(() => {
    // 新しいアイテムが追加されてlastAddedIdが更新されるとscrollIntoViewが走って追加したアイテムまでスムーズにスクロールする
    if (lastAddedRef.current) {
      lastAddedRef.current.scrollIntoView({ behavior: "smooth",block: "center" });
    }
  },[lastAddedId]);

  return (
    <div className="root-inner">
      <Header />
      <TodoForm todos={todos} setTodos={setTodos} categoryList={categoryList} setCategoryList={setCategoryList} setLastAddedId={setLastAddedId} />
      <TodoList todos={todos} setTodos={setTodos} categoryList={categoryList} setCategoryList={setCategoryList} lastAddedId={lastAddedId} lastAddedRef={lastAddedRef} todoRefs={todoRefs.current} categoryRefs={categoryRefs.current} />
      <Footer />
    </div>
  );
}