
export const createService = ({ pool }) => {
  const getDbInfo = async () => {
    const r = await pool.query(
      "SELECT current_database() AS db, current_user AS usr, current_schema() AS schema"
    );
    return r.rows[0];
  };

  const getNotes = async () => {
    const result = await pool.query(
      "SELECT * FROM public.notes ORDER BY created_at DESC"
    );
    return result.rows;
  };

  const createNote = async ({ title, body }) => {
    if (!title.trim() || !body.trim()) {
      const msg = "title and body required";
      console.error(msg);
      throw new Error(msg);
    }

    const result = await pool.query(
      "INSERT INTO public.notes (title, body) VALUES ($1, $2) RETURNING *",
      [title, body]
    );
    return result.rows[0];
  };
  const updateNote = async (id, { title, body }) => {
    if (!Number.isFinite(id)) {
      const msg = ("Invalid id");
      console.error(msg);
      throw new Error (msg);
    }
    if (!title.trim() || !body.trim()) {
      const msg = "title and body required";
      console.error(msg);
      throw new Error(msg);
    }

    const result = await pool.query(
      "UPDATE public.notes SET title = $1, body = $2 WHERE id = $3 RETURNING *",
      [title, body, id]
    );
    if (result.rows.length === 0) {
      const msg = "Note not found";
      console.error(msg);
      throw new Error(msg);
    }
    return result.rows[0];
  };

  const deleteNote = async (id) => {
    if (!Number.isFinite(id)) {
      const msg = "Invalid id";
      console.error(msg);
      throw new Error(msg);
    }
    await pool.query(
      "DELETE FROM public.notes WHERE id = $1 RETURNING id",
      [id]);

    if (result.rows.length === 0) {
      const msg = ("Note not found");
      console.error(msg);
      throw new Error(msg);
    }
  }

  return { getDbInfo, getNotes, createNote, updateNote, deleteNote };
};