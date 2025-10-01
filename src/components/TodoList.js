import { useState } from 'react';

export default function TodoList({ todos,setTodos,categoryList }) {
    const [showCompleteList,setShowCompleteList] = useState(true);
    let notCompleteTodos = todos.filter(todo => todo.isCheck === false);
    if (!showCompleteList) {
        todos = notCompleteTodos;
    }
    let lastItemCount = 0;
    return (
        <>
            <ShowCompleteButton showCompleteList={showCompleteList} setShowCompleteList={setShowCompleteList} />
            {categoryList.map(cat => {
                lastItemCount = todos.filter(todo => todo.category === cat && !todo.isCheck).length;
                return (
                    <div className="todo-box" key={cat}>
                        <div className="todo-box-category">{cat}（残り{lastItemCount}）
                            <div className="todo-box-category-edit-area">
                                <button className="todo-box-category-edit">編集</button> |
                                <button className="todo-box-category-delete">削除</button>
                            </div>
                        </div>
                        <ul className="todo-box-list">
                            {lastItemCount > 0 || showCompleteList ?
                                <TodoBox todos={todos} setTodos={setTodos} category={cat} />
                                :
                                !showCompleteList && <li className="todo-box-list-item"><span>完了しました！</span></li>
                            }
                        </ul>
                    </div>
                )
            }
            )}
        </>
    );
}

function TodoBox({ todos,setTodos,category }) {
    let CategoryTodos = todos.filter((todo) => todo.category === category);
    return (
        <>
            {CategoryTodos.map(ct =>
                <li className="todo-box-list-item" key={ct.id}>
                    <label htmlFor={ct.id}>
                        <input type="checkbox" id={ct.id} checked={ct.isCheck} className="todo-box-checkbox" onChange={() => {
                            setTodos(prev =>
                                prev.map(todo =>
                                    todo.id === ct.id ? { ...todo,isCheck: !todo.isCheck } : todo
                                )
                            );
                        }}
                        />
                        <svg xmlns="http://www.w3.org/2000/svg" height="14px" viewBox="0 -960 960 960" width="14px" fill="#4B3A30"><path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z" /></svg>
                        <span className="todo-box-list-item-label">{ct.name}</span>
                    </label>
                    <div className="todo-box-list-item-edit-area">
                        <button className="todo-box-list-item-edit">編集</button>
                        <button className="todo-box-list-item-delete">削除</button>
                    </div>
                </li>
            )}
        </>
    );
}
function ShowCompleteButton({ showCompleteList,setShowCompleteList }) {
    return (
        <div className="todo-complete-wrapper">
            <button type="button" className="todo-complete" onClick={() => setShowCompleteList(prev => !prev)}>
                {showCompleteList ?
                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#1f1f1f"><path d="M0 0h24v24H0zm0 0h24v24H0zm0 0h24v24H0zm0 0h24v24H0z" fill="none" /><path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z" /></svg>
                    :
                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#1f1f1f"><path d="M0 0h24v24H0z" fill="none" /><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" /></svg>}
                {showCompleteList ? '完了済みを隠す' : '完了済みを表示'}</button>
        </div>
    );
}