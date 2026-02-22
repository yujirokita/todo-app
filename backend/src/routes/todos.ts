import { Router, Request, Response } from "express";
import db from "../database";

const router = Router();

// GET /api/todos
router.get("/", (_req: Request, res: Response) => {
  const todos = db.prepare("SELECT * FROM todos ORDER BY created_at DESC").all();
  const mapped = (todos as any[]).map((t) => ({
    ...t,
    completed: t.completed === 1,
  }));
  res.json(mapped);
});

// POST /api/todos
router.post("/", (req: Request, res: Response) => {
  const { title } = req.body;
  if (!title || typeof title !== "string" || title.trim() === "") {
    res.status(400).json({ error: "title is required" });
    return;
  }
  const result = db
    .prepare("INSERT INTO todos (title) VALUES (?)")
    .run(title.trim());
  const todo = db.prepare("SELECT * FROM todos WHERE id = ?").get(result.lastInsertRowid) as any;
  res.status(201).json({ ...todo, completed: todo.completed === 1 });
});

// PATCH /api/todos/:id
router.patch("/:id", (req: Request, res: Response) => {
  const { id } = req.params;
  const existing = db.prepare("SELECT * FROM todos WHERE id = ?").get(id) as any;
  if (!existing) {
    res.status(404).json({ error: "todo not found" });
    return;
  }

  const { title, completed } = req.body;
  const newTitle = title !== undefined ? String(title).trim() : existing.title;
  const newCompleted =
    completed !== undefined ? (completed ? 1 : 0) : existing.completed;

  db.prepare("UPDATE todos SET title = ?, completed = ? WHERE id = ?").run(
    newTitle,
    newCompleted,
    id
  );

  const updated = db.prepare("SELECT * FROM todos WHERE id = ?").get(id) as any;
  res.json({ ...updated, completed: updated.completed === 1 });
});

// DELETE /api/todos/:id
router.delete("/:id", (req: Request, res: Response) => {
  const { id } = req.params;
  const result = db.prepare("DELETE FROM todos WHERE id = ?").run(id);
  if (result.changes === 0) {
    res.status(404).json({ error: "todo not found" });
    return;
  }
  res.json({ deleted: true });
});

export default router;
