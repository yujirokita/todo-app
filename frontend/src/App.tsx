import { useEffect, useState } from "react";
import type { Todo } from "./types/todo";
import { fetchTodos, createTodo, updateTodo, deleteTodo } from "./api/todos";
import TodoForm from "./components/TodoForm";
import TodoList from "./components/TodoList";
import "./App.css";

export default function App() {
  const [todos, setTodos] = useState<Todo[]>([]);

  useEffect(() => {
    fetchTodos()
      .then(setTodos)
      .catch((err) => console.error("Failed to fetch todos:", err));
  }, []);

  const handleAdd = async (title: string) => {
    const todo = await createTodo(title);
    setTodos((prev) => [todo, ...prev]);
  };

  const handleToggle = async (id: number, completed: boolean) => {
    const updated = await updateTodo(id, { completed });
    setTodos((prev) => prev.map((t) => (t.id === id ? updated : t)));
  };

  const handleDelete = async (id: number) => {
    await deleteTodo(id);
    setTodos((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <div className="app">
      <h1>TODO App</h1>
      <TodoForm onAdd={handleAdd} />
      <TodoList todos={todos} onToggle={handleToggle} onDelete={handleDelete} />
    </div>
  );
}
