import { useState } from 'react';

export default function TodoForm({ todos,setTodos,categoryList,setCategoryList }) {
  const [inputText,setInputText] = useState("");
  const [inputSelect,setInputSelect] = useState("");
  const [inputError,setInputError] = useState(0);
  return (
    <>
      <div id="TodoForm" className="todo-form">
        <div className="todo-category">
          <TodoFormCategorySelect categoryList={categoryList} inputSelect={inputSelect} setInputSelect={setInputSelect} />
          <button className="category-button" type="button" onClick={() => {
            setInputSelect(AddCategory(categoryList,setCategoryList));
          }
          }>カテゴリーを追加する</button>
        </div>
        <input type="text" id="TodoInputText" name="TodoInputText" value={inputText} placeholder="やることを入力してください"
          className="todo-form-input" onChange={(e) => setInputText(e.target.value)} />
        <button type="button" className="todo-form-submit" onClick={() => {
          addTodoContent(todos,setTodos,inputText,setInputText,inputSelect,setInputError);
        }}>追加</button>
      </div >
      {inputError === 1 && <p className="todo-form-error   mt-6 text-red-500">未入力の値があります。</p>
      }
    </>
  );
}

function TodoFormCategorySelect({ categoryList,inputSelect,setInputSelect }) {
  return (
    <>
      <select name="category" id="category-select" className="todo-form-select" value={inputSelect}
        onChange={(e) => setInputSelect(e.target.value)}>
        <option value="">カテゴリーを選択してください</option>
        {categoryList.map(ct =>
          <option value={ct} key={ct}>{ct}</option>
        )}
      </select>
    </>
  );
}

function AddCategory(categoryList,setCategoryList) {
  const userInput = prompt("カテゴリー名を入力してください");
  if (userInput) {
    // 重複確認してセーブ
    const newList = Array.from(new Set([...categoryList,userInput]));
    setCategoryList(newList);
    return userInput;
  } else {
    return "";
  }
}

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
  }
}

