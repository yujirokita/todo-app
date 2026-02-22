import type { Todo } from "../types/todo";

const STORAGE_KEY = "todos";

const SAMPLE_TODOS: Todo[] = [
  {
    id: 1,
    title: "Learn React",
    completed: true,
    created_at: "2025-01-01T00:00:00.000Z",
  },
  {
    id: 2,
    title: "Build a Todo App",
    completed: false,
    created_at: "2025-01-02T00:00:00.000Z",
  },
];

function loadTodos(): Todo[] {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw) return JSON.parse(raw);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(SAMPLE_TODOS));
  return SAMPLE_TODOS;
}

function saveTodos(todos: Todo[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}

function nextId(todos: Todo[]): number {
  return todos.length === 0 ? 1 : Math.max(...todos.map((t) => t.id)) + 1;
}

export async function fetchTodos(): Promise<Todo[]> {
  return loadTodos();
}

export async function createTodo(title: string): Promise<Todo> {
  const todos = loadTodos();
  const todo: Todo = {
    id: nextId(todos),
    title,
    completed: false,
    created_at: new Date().toISOString(),
  };
  todos.push(todo);
  saveTodos(todos);
  return todo;
}

export async function updateTodo(
  id: number,
  data: { title?: string; completed?: boolean }
): Promise<Todo> {
  const todos = loadTodos();
  const index = todos.findIndex((t) => t.id === id);
  if (index === -1) throw new Error(`Todo ${id} not found`);
  todos[index] = { ...todos[index], ...data };
  saveTodos(todos);
  return todos[index];
}

export async function deleteTodo(id: number): Promise<void> {
  const todos = loadTodos();
  saveTodos(todos.filter((t) => t.id !== id));
}
