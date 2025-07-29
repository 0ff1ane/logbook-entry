import { useCallback, useMemo, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  type TodoSchema,
  appsTodosRoutesAddTodo,
  appsTodosRoutesListTodos,
  appsTodosRoutesUpdateTodo,
} from "../../generated/client";

function Todos(props) {
  const [todos, setTodos] = useState([
    { text: "Complete react tutorial", complete: true },
    { text: "Build todo app", complete: true },
    { text: "Read TypeScript documentation", complete: false },
    { text: "Write unit tests", complete: false },
    { text: "Deploy to production", complete: false },
  ]);
  const [newTodoText, setNewTodoText] = useState("");
  const isValidTodoText = useMemo(() => newTodoText.length > 5, [newTodoText]);

  const fetchTodos = useQuery({
    queryKey: ["todos"],
    queryFn: () => appsTodosRoutesListTodos(),
  });

  const addTodoMutation = useMutation({
    mutationFn: () =>
      appsTodosRoutesAddTodo({
        body: { text: newTodoText },
        headers: { "X-XSRF-TOKEN": window.csrftoken },
      }),
    onSuccess: (data) => {
      console.log(data);
      if (data?.data?.id) {
        setNewTodoText("");
        fetchTodos.refetch();
      } else {
        alert("Unable to create todo");
      }
    },
  });

  const updateTodoMutation = useMutation({
    mutationFn: ({
      todo_id,
      is_complete,
    }: {
      todo_id: number;
      is_complete: boolean;
    }) =>
      appsTodosRoutesUpdateTodo({
        body: { todo_id, is_complete },
        headers: { "X-XSRF-TOKEN": window.csrftoken },
      }),
    onSuccess: (data) => {
      console.log(data);
      if (data?.data?.id) {
        fetchTodos.refetch();
      } else {
        alert("Unable to update todo");
      }
    },
  });

  const addTodo = useCallback(() => {
    addTodoMutation.mutate();
  }, [addTodoMutation]);

  const toggleTodo = useCallback(
    (todo: TodoSchema) => {
      if (todo.id && todo.is_complete !== undefined) {
        updateTodoMutation.mutate({
          todo_id: todo.id,
          is_complete: !todo.is_complete,
        });
      }
    },
    [updateTodoMutation],
  );

  const deleteTodo = useCallback(
    (deleteIdx: number) => {
      setTodos(todos.filter((todo, idx) => idx !== deleteIdx));
    },
    [todos],
  );

  return (
    <>
      <div className="relative py-12 max-w-md mx-auto">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full flex flex-col gap-4">
          <h1 className="text-2xl text-gray-800 mb-6 text-center">Todo App</h1>

          <div>
            <div className="flex">
              <input
                type="text"
                placeholder="Add a new todo"
                className="flex-grow p-3 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={newTodoText}
                onChange={(e) => setNewTodoText(e.currentTarget.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") addTodo();
                }}
              />
              <button
                onClick={addTodo}
                disabled={!isValidTodoText}
                className={`bg-gray-600 text-white p-3 rounded-r-lg hover:bg-gray-700 transition-colors duration-200 text-sm ${isValidTodoText ? "cursor-pointer" : "cursor-not-allowed"}`}
              >
                Add
              </button>
            </div>
            {newTodoText.length > 0 && !isValidTodoText ? (
              <span className="text-red-500 text-xs">
                Must be atleast 5 letters long
              </span>
            ) : null}
          </div>

          {fetchTodos.isFetching ? (
            <p className="text-gray-500 text-center">Loading..</p>
          ) : fetchTodos.data?.data?.length === 0 ? (
            <p className="text-gray-500 text-center">
              No todos yet. Add one above!
            </p>
          ) : (
            <ul>
              {fetchTodos.data?.data?.map((todo, index) => (
                <li
                  key={index}
                  className="flex items-center justify-between bg-gray-50 p-3 rounded-lg mb-2 shadow-sm"
                >
                  <input
                    type="checkbox"
                    checked={todo.is_complete}
                    onChange={() => toggleTodo(todo)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer"
                  />
                  <span
                    className={`ml-2 flex-grow text-lg ${todo.is_complete ? "line-through text-gray-500" : "text-gray-800"}`}
                  >
                    {todo.text}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="mx-auto max-w-2xl text-center pb-12">
        inertia props = {JSON.stringify(props)}
      </div>
    </>
  );
}

export default Todos;
