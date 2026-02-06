import { createService } from "./notes.service.js";

export const createController = (app, deps) => {
  const service = createService(deps);

  // Full page 

  app.get("/", (req, res) => {
    res.render("index");
  });

  // Diagnostic endpoints
  app.get("/health", (req, res) => res.json({ ok: true }));

  app.get("/dbinfo", async (req, res) => {
    try {
      const info = await service.getDbInfo();
      res.json(info);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "dbinfo failed" });
    }
  });

  // HTMX fragment: render the notes list partial
  app.get("/notes", async (req, res) => {
    try {
      const notes = await service.getNotes();
      res.render("partials/notes-list", { notes });
    } catch (err) {
      console.error(err);
      res.status(500).send("<p>DB error loading notes</p>");
    }
  });

  // HTMX create: render one note item partial
  app.post("/notes", async (req, res) => {
    try {
      const note = await service.createNote(req.body);
      res.status(201).render("partials/note-item", { note });
    } catch (err) {
      res.status(400).send(`<p>${err.message}</p>`);
    }
  });

  // HTMX update: render updated note item partial 
  app.put("/notes/:id", async (req, res) => {
    try {
      const id = Number(req.params.id);
      const note = await service.updateNote(id, req.body);
      res.render("partials/note-item", { note });
    } catch (err) {
      const status =
        err.message === "Note not found" ? 404 :
        err.message === "Invalid id" ? 400 :
        400;
      res.status(status).send(`<p>${err.message}</p>`);
    }
  });

  // HTMX delete: return empty so the element can disappear
  app.delete("/notes/:id", async (req, res) => {
    try {
      const id = Number(req.params.id);
      await service.deleteNote(id);

      res.status(200).send("");
    } catch (err) {
      const status =
        err.message === "Note not found" ? 404 :
        err.message === "Invalid id" ? 400 :
        400;
      res.status(status).send(`<p>${err.message}</p>`);
    }
  });


        //-- JSON endpoints for react --//
        
       app.get("/api/notes", async (req, res) => {
    res.json(await service.getNotes());
  });
};
