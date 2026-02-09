const form = document.getElementById("note-form");
const titleInput = document.getElementById("title");
const bodyInput = document.getElementById("body");
const notesEl = document.getElementById("notes");
const errorEl = document.getElementById("error");

// state, array of { id, title, body }

let notes = [];

function setError(msg) {
  errorEl.textContent = msg || "";
}

function render() {
  // clear list
  notesEl.innerHTML = "";

  if (notes.length === 0) {
    const p = document.createElement("p");
    p.textContent = "No notes yet.";
    notesEl.appendChild(p);
    return;
  }

  for (const note of notes) {
    const card = document.createElement("div");
    card.style.border = "1px solid #979797";
    card.style.padding = "8px";
    card.style.margin = "8px 0";

    const title = document.createElement("strong");
    title.textContent = note.title;
    title.style.fontSize = "1.3em";

    const body = document.createElement("div");
    body.textContent = note.body;
    body.style.margin = "4px 0"; 

    const meta = document.createElement("small");
    meta.textContent = `id: ${note.id}`;

    const delBtn = document.createElement("button");
    delBtn.textContent = "Delete";
    delBtn.dataset.id = String(note.id); // store id on the button

    card.appendChild(title);
    card.appendChild(body);
    card.appendChild(meta);
    card.appendChild(document.createElement("br"));
    card.appendChild(delBtn);

    notesEl.appendChild(card);
  }
}

async function loadNotes() {
  setError("");

  const res = await fetch("/api/notes");
  if (!res.ok) {
    setError("Failed to load notes");
    return;
  }

  notes = await res.json();
  render();
}

async function createNote(title, body) {
  setError("");

  const res = await fetch("/api/notes", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, body }),
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    setError(data?.error || "Failed to create note");
    return;
  }

  // add new note to the top 
  notes.unshift(data);
  render();

  // reload page to clear form
  form.reset();
  titleInput.focus();
}

async function deleteNote(id) {
  setError("");

  const res = await fetch(`/api/notes/${id}`, { method: "DELETE" });
  const data = await res.json().catch(() => null);

  if (!res.ok) {
    setError(data?.error || "Failed to delete note");
    return;
  }

  notes = notes.filter((note) => note.id !== id);
  render();
}

// Handle form submit
form.addEventListener("submit", (event) => {
  event.preventDefault(); // stops page reload

  const title = titleInput.value.trim();
  const body = bodyInput.value.trim();

  createNote(title, body);
});

// Handle delete clicks 
notesEl.addEventListener("click", (e) => {
  const btn = e.target.closest("button");
  if (!btn) return;

  const idStr = btn.dataset.id;
  if (!idStr) return;

  const id = Number(idStr);
  if (!Number.isFinite(id)) return;

  deleteNote(id);
});

// Start the app

loadNotes();

// Hej Jona!