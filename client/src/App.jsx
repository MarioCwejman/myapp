import { useEffect, useState } from "react";
import "./App.css";

export default function App() {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  async function loadNotes() {
    setLoading(true);
    try {
      const res = await fetch("/api/notes");
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setNotes(data);
    } catch (err) {
      console.error("Failed to load notes:", err);
    }
    setLoading(false);
  }

  useEffect(() => {
    loadNotes();
  }, []);

  async function addNote() {
    setLoading(true);

    if (!title.trim() || !body.trim()) return;

    try {
      const res = await fetch("/api/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, body }),
      });

      const created = await res.json();

      loadNotes(async (prev) => [...prev, created]);

      setBody("");
      setTitle("");
      setLoading(false);
    } catch (err) {
      console.error("Failed to add note:", err);
      setLoading(false);
    }
  }

  async function deleteNote(id) {
    setLoading(true);
    try {
      const res = await fetch(`/api/notes/${id}`, { method: "DELETE" });
      loadNotes((prev) => prev.filter((n) => n.id !== id));
    } catch (err) {
      console.error("Failed to delete note:", err);
      setLoading(false);
    }

    setLoading(false);
  }

  return (
    <main className="page">
      <header className="header">
        <h1 className="title">Notes</h1>
        <p className="subtitle">Create, view, and delete notes. M.Cwejman</p>
      </header>

      <section className="card">
        <h2 className="sectionTitle">Add a note</h2>

        <div className="form">
          <label className="label">
            Title
            <input
              className="input"
              placeholder="e.g. Gym plan"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </label>

          <label className="label">
            Body
            <textarea
              className="textarea"
              placeholder="Write the note…"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={4}
            />
          </label>

          <button className="button" onClick={addNote}>
            Add
          </button>
        </div>
      </section>

      <section className="card">
        <div className="listHeader">
          <h2 className="sectionTitle">Your notes</h2>
          {loading ? <span className="pill">Loading…</span> : null}
        </div>

        <ul className="list">
          {notes.map((note) => (
            <li className="note" key={note.id}>
              <div className="noteTop">
                <span className="badge">#{note.id}</span>
                <strong className="noteTitle">{note.title}</strong>

                <button
                  className="button danger"
                  onClick={() => deleteNote(note.id)}
                >
                  Delete
                </button>
              </div>

              <p className="noteBody">{note.body}</p>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
