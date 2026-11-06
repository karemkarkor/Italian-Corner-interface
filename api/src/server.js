import express from 'express';

const app = express();
const port = Number(process.env.PORT || 5000);

app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'italian-corner-api',
  });
});

app.listen(port, () => {
  console.log(`API running at http://localhost:${port}`);
});