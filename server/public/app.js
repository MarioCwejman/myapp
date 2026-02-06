fetch("/api/notes")
  .then(r => r.json())
  .then(console.log);
