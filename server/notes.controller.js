import { createService } from "./notes.service.js";

export const createController = (app, deps) => {
  const service = createService(deps);

  app.get("/api/notes", async (req, res) => {
    try {
      const notes = await service.getNotes();
      res.json(notes);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "DB error loading notes" });
    }
  });

  app.post("/api/notes", async (req, res) => {
    try {
      const note = await service.createNote(req.body);
      res.status(201).json(note);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });

  app.put("/api/notes/:id", async (req, res) => {
    try {
      const id = Number(req.params.id);
      const note = await service.updateNote(id, req.body);
      res.json(note);
    } catch (err) {
      const status =
        err.message === "Note not found" ? 404 :
        err.message === "Invalid id" ? 400 :
        400;

      res.status(status).json({ error: err.message });
    }
  });

  app.delete("/api/notes/:id", async (req, res) => {
    try {
      const id = Number(req.params.id);
      await service.deleteNote(id);
      res.json({ ok: true });
    } catch (err) {
      const status =
        err.message === "Note not found" ? 404 :
        err.message === "Invalid id" ? 400 :
        400;

      res.status(status).json({ error: err.message });
    }
  });
};
