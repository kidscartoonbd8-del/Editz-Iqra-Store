import express from 'express';
import path from 'path';
import { app } from './server/app.ts';

const PORT = process.env.PORT || 3000;
const distPath = path.resolve(process.cwd(), 'dist');

// Serve static assets from built frontend
app.use(express.static(distPath));

// Fallback to index.html for client-side routing
app.get('*', (_req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
