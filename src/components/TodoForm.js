import { useState,useEffect,useRef,createRef } from 'react';
export default function TodoForm({ todos,setTodos,categoryList,setCategoryList,setLastAddedId }) {
  const [inputText,setInputText] = useState("");
  const [inputSelect,setInputSelect] = useState("");
  const [inputError,setInputError] = useState(0);

  // フォームの送信ボタンが押されたときの動作
  const handleSubmit = (e) => {
    e.preventDefault();
    // addTodoContentの戻り値として新しく追加したTodoのIDが返ってくる
    const newId = addTodoContent(todos,setTodos,inputText,setInputText,inputSelect,setInputError);

    // 追加した瞬間にblinkクラスを付けて、2秒後に外す挙動
    if (newId) {
      // 追加したTodoのIDをstateに保存します。これがblinkクラスを付ける条件になります。
      setLastAddedId(newId);
      // 2b000ミリ秒後にlastAddedIdをnullに戻して、blinkクラスを外します。
      setTimeout(() => setLastAddedId(null),1000);
    }
  };
  return (
    <>
      {/* Enterで登録できる仕様にするには、formタグとonSubmit指定する。*/}
      <form id="TodoForm" className="todo-form" onSubmit={handleSubmit}>
        <div className="todo-category">
          <TodoFormCategorySelect categoryList={categoryList} inputSelect={inputSelect} setInputSelect={setInputSelect} />
          <button className="category-button" type="button" onClick={() => {
            AddCategory(categoryList,setCategoryList,setInputSelect);
          }
          }>カテゴリーを追加する</button>
        </div>
        <input type="text" id="TodoInputText" name="TodoInputText" value={inputText} placeholder="やることを入力してください"
          className="todo-form-input" onChange={(e) => setInputText(e.target.value)} />
        {/* button type="submit の動作は、formタグのonSubmitで指定する*/}
        <button type="submit" className="todo-form-submit">追加</button>
      </form>
      {inputError === 1 && <p className="todo-form-error   mt-6 text-red-500">未入力の値があります。</p>
      }
    </>
  );
}

// カテゴリー選択のセレクトボックス
function TodoFormCategorySelect({ categoryList,inputSelect,setInputSelect }) {
  return (
    <>
      {/* e.target.valueはHTMLの仕様で文字列のため、parseInt(e.target.value)にして数値にする */}
      <select name="category" id="category-select" className="todo-form-select" value={inputSelect}
        onChange={(e) => setInputSelect(parseInt(e.target.value))}>
        {categoryList.map(ct =>
          <option value={ct.id} key={ct.id} > {ct.name}</option>
        )}
      </select >
    </>
  );
}

// カテゴリーを追加するボタンの動作
function AddCategory(categoryList,setCategoryList,setInputSelect) {
  const userInput = prompt("カテゴリー名を入力してください");
  if (userInput) {
    let maxId = categoryList.length > 0 ? Math.max(...categoryList.map(todo => todo.id)) : 0;
    const newList = [...categoryList,{ id: maxId + 1,name: userInput }];
    setCategoryList(newList);
    setInputSelect(maxId + 1);
    return maxId + 1;
  }
}

// Todoの内容を追加する関数
function addTodoContent(todos,setTodos,inputText,setInputText,inputSelect,setInputError) {
  if (inputText === "" || inputSelect === "") {
    setInputError(1);
    return;
  } else {
    setInputError(0);
    // Math.max()は最大値を返す
    // Math.max() は空の配列を渡すとエラーになるので、todosが空の場合は0をセットする
    let maxId = todos.length > 0 ? Math.max(...todos.map(todo => todo.id)) : 0;
    // map ではなく、スプレッド構文で新しいオブジェクトを追加する形することで、後ろに追加される
    setTodos([...todos,{ id: maxId + 1,name: inputText,category: inputSelect,isCheck: false }]);
    setInputText("");
    return maxId + 1;
  }
}

