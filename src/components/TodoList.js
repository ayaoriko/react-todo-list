export default function TodoList({ todos,setTodos,categoryList }) {
    return (
        <>
            {categoryList.map(cat =>
                <div className="todo-box" key={cat}>
                    <div className="todo-box-category">{cat}（残り{todos.filter((todo) => todo.category === cat && todo.isCheck === false).length}）</div>
                    <ul className="todo-box-list">
                        <TodoBox todos={todos} setTodos={setTodos} category={cat} />
                    </ul>
                </div>
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
                </li>
            )}
        </>
    );
}
