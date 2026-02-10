export const createService = ({ pool }) => {
  const getDbInfo = async () => {
    const r = await pool.query(
      "SELECT current_database() AS db, current_user AS usr, current_schema() AS schema",
    );
    return r.rows[0];
  };

  const getNotes = async () => {
    const result = await pool.query(
      "SELECT * FROM public.notes ORDER BY created_at DESC",
    );
    return result.rows;
  };

  const createNote = async (raw) => {
    const title = String(raw?.title ?? raw?.noteName ?? "").trim();
    const body = String(raw?.body ?? raw?.noteContents ?? "").trim();

    if (!title || !body) {
      const err = new Error("title and body required");
      err.status = 400;
      throw err;
    }

    const result = await pool.query(
      "INSERT INTO public.notes (title, body) VALUES ($1, $2) RETURNING *",
      [title, body],
    );
    return result.rows[0];
  };

  const updateNote = async (id, raw) => {
    if (!Number.isFinite(id)) {
      const err = new Error("Invalid id");
      err.status = 400;
      throw err;
    }

    const title = String(raw?.title ?? raw?.noteName ?? "").trim();
    const body = String(raw?.body ?? raw?.noteContents ?? "").trim();

    if (!title || !body) {
      const err = new Error("title and body required");
      err.status = 400;
      throw err;
    }

    const result = await pool.query(
      "UPDATE public.notes SET title = $1, body = $2 WHERE id = $3 RETURNING *",
      [title, body, id],
    );

    if (result.rows.length === 0) {
      const err = new Error("Note not found");
      err.status = 404;
      throw err;
    }

    return result.rows[0];
  };

  const deleteNote = async (id) => {
    if (!Number.isFinite(id)) {
      const err = new Error("Invalid id");
      err.status = 400;
      throw err;
    }

    const result = await pool.query(
      "DELETE FROM public.notes WHERE id = $1 RETURNING id",
      [id],
    );

    if (result.rows.length === 0) {
      const err = new Error("Note not found");
      err.status = 404;
      throw err;
    }

    return result.rows[0];
  };

  return { getDbInfo, getNotes, createNote, updateNote, deleteNote };
};
