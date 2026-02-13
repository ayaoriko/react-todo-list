import { useState,createRef,useRef,} from 'react';
import { CSSTransition,TransitionGroup } from 'react-transition-group';

export default function TodoList({ todos,setTodos,categoryList,setCategoryList,lastAddedId,lastAddedRef,todoRefs }) {
    const [showCompleteList,setShowCompleteList] = useState(true);
    // { カテゴリーID: true or false } の形で編集モードかどうかを管理
    const [categoryMap,setCategoryMap] = useState({});
    // 完了済みを非表示にする場合、todosから完了済みを除外する
    let notCompleteTodos = todos.filter(todo => todo.isCheck === false);
    if (!showCompleteList) {
        todos = notCompleteTodos;
    }
    return (
        <>
            {/* 完了済みを非表示/表示するボタン */}
            <ShowCompleteButton showCompleteList={showCompleteList} setShowCompleteList={setShowCompleteList} />

            {categoryList.map(cat => {
                // そのカテゴリーに属する、未完了のTodoの数を数える
                const lastItemCount = todos.filter(todo => todo.category === cat.id && !todo.isCheck).length;

                // 「未分類」カテゴリーで、かつ、未完了のTodoが0件の場合は表示しない
                if (cat.id === 0 && lastItemCount === 0) {
                    return null;
                }

                // 完了済みを非表示にしていて、かつ、そのカテゴリーに未完了のTodoが0件の場合は表示しない
                if (showCompleteList === false && lastItemCount === 0) {
                    return null
                }
                // 編集モードかどうかを判定
                // editCategoryMap[cat.id] は存在しなければ undefined、存在すれば true か false が入るので、
                // !! をつけてundefinedの時にfalseになるようにしている
                const isEdit = !!categoryMap[cat.id];

                return (
                    <div className="todo-box" key={cat.id}>
                        <div className="todo-box-category">{isEdit ? <input id={'todo-box-category-' + cat.id} value={cat.name} onChange={(e) => setCategoryList(categoryList.map(c => c.id === cat.id ? { ...c,name: e.target.value } : c))} /> : cat.name}{!isEdit && <span>（残り{lastItemCount}）</span>}
                            <TodoBoxCategoryEditArea cat={cat} categoryList={categoryList} setCategoryList={setCategoryList} setTodos={setTodos} setCategoryMap={setCategoryMap} isEdit={isEdit} />
                        </div >
                        <ul className="todo-box-list">
                            {/* Todoが1件もない場合は、「完了しました！」と表示する */}
                            {lastItemCount > 0 || showCompleteList ?
                                <TodoBoxList todos={todos} setTodos={setTodos} categoryId={cat.id} lastAddedId={lastAddedId} lastAddedRef={lastAddedRef} todoRefs={todoRefs} />
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

function TodoBoxCategoryEditArea({ cat,setCategoryList,setTodos,setCategoryMap,isEdit }) {
    return (
        <div className="todo-box-category-edit-area">
            <button className="todo-box-category-edit" onClick={() =>
                setCategoryMap(prev => ({
                    ...prev,
                    [cat.id]: !prev[cat.id] // トグル
                }))
            }>{isEdit ? '保存' : '編集'} </button>
            {!isEdit && <span className="separator"> | </span>}
            {!isEdit &&
                <button className="todo-box-category-delete"
                    onClick={() => {
                        if (window.confirm("本当に削除しますか？残ったタスクは「未分類」カテゴリーに移動します。")) {
                            setCategoryList(prev => prev.filter(t => t.id !== cat.id));
                            if (cat.id !== 0) {
                                // カテゴリー削除時に、そのカテゴリーに属するTodoを「未分類」に変更する
                                setTodos(prev => prev.map(todo => todo.category === cat.id ? { ...todo,category: 0 } : todo));
                            } else {
                                alert("「未分類」カテゴリーは削除できません。");
                            }
                        }
                    }}>削除</button>
            }
        </div >
    )
}

// 完了済みを非表示/表示するボタン
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

// Todoのリスト部分
function TodoBoxList({ todos,setTodos,categoryId,lastAddedId,lastAddedRef,todoRefs }) {
    let CategoryTodos = todos.filter((todo) => todo.category === categoryId);
    // react-transition-groupのライブラリを使って、Todoの追加・削除時にフェードイン・フェードアウトのアニメーションをつける
    // React 19とreact-transition-groupの相性問題で、nodeRefを渡す必要がある
    return (
        <TransitionGroup component={null}>
            {CategoryTodos.map(todoItem => (
                <CSSTransition key={todoItem.id} timeout={1000} classNames="fade" nodeRef={todoRefs[todoItem.id]}>
                    <TodoBoxListItem todoItem={todoItem} setTodos={setTodos} lastAddedId={lastAddedId} lastAddedRef={lastAddedRef} nodeRef={todoRefs[todoItem.id]} />
                </CSSTransition>
            ))}
        </TransitionGroup>
    );
}
// Todoのリスト部分の各アイテム
// 子コンポーネントに分割して、useState を局所的に持たせることで、
// 各Todoごとに個別の state を持てるようにする
function TodoBoxListItem({ todoItem,setTodos,lastAddedId,lastAddedRef,nodeRef }) {
    const [isEditTodoItem,setIsEditTodoItem] = useState(false);
    const [todoText,setTodoText] = useState(todoItem.name);
    return (
        // 追加したTodoにだけblinkクラスを付ける
        // lastAddedRef：liをDOMに配置した瞬間にlastAddedRef.currentにそのDOM要素が入ります。（App.js参照）
        <li ref={nodeRef} className={`todo-box-list-item ${todoItem.id === lastAddedId ? "blink" : ""}`}>
            <label htmlFor={'todo-item-' + todoItem.id}>
                {/* 編集モードでなければチェックボックスを表示 */}
                {!isEditTodoItem && <>
                    <input type="checkbox" id={'todo-item-' + todoItem.id} checked={todoItem.isCheck} className="todo-box-checkbox" onChange={() => {
                        if (!todoItem.isCheck) {
                            setTodos(prev =>
                                prev.map(todo =>
                                    todo.id === todoItem.id ? { ...todo,isExiting: true } : todo
                                )
                            );
                            setTimeout(() => {
                                setTodos(prev =>
                                    prev.map(todo =>
                                        todo.id === todoItem.id ? { ...todo,isCheck: true,isExiting: false } : todo
                                    )
                                );
                            },300);
                        } else {
                            setTodos(prev =>
                                prev.map(todo =>
                                    todo.id === todoItem.id ? { ...todo,isCheck: false } : todo
                                )
                            );
                        }
                    }}
                    />
                </>
                }
                <svg xmlns="http://www.w3.org/2000/svg" height="14px" viewBox="0 -960 960 960" width="14px" fill="#4B3A30"><path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z" /></svg>
                <span className="todo-box-list-item-label">{isEditTodoItem ?
                    <input Id={'todo-item-' + todoItem.id + '-input'} value={todoText} onChange={(e) => setTodoText(e.target.value)}
                    /> : todoItem.name}</span>
            </label>
            <div className="todo-box-list-item-edit-area">
                <button className="todo-box-list-item-edit"
                    onClick={() => {
                        if (isEditTodoItem) {
                            if (!todoText) {
                                alert("Todoの内容を空にすることはできません。");
                                return;
                            }
                            setTodos(prev =>
                                prev.map(t =>
                                    t.id === todoItem.id ? { ...t,name: todoText } : t
                                )
                            );
                        }
                        setIsEditTodoItem(prev => !prev);
                    }}>{isEditTodoItem ? '確定' : '編集'} </button>
                {/* 編集モードでなければ削除ボタンを表示 */}
                {
                    <button className={`todo-box-list-item-delete ${isEditTodoItem ? 'hidden' : ''}`}
                        onClick={() => {
                            if (window.confirm("本当に削除しますか？")) {
                                setTodos(prev => prev.filter(t => t.id !== todoItem.id));
                            }
                        }}
                    >削除</button>
                }
            </div>
        </li >
    )
}