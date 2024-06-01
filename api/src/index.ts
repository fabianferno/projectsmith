import express from 'express';
import cors from 'cors';
import shell from 'shelljs';

const PORT = process.env.PORT || 4000;
const HOSTNAME = process.env.HOSTNAME || 'http://localhost';
const app = express();

app.use(
  cors({
    origin: ['http://localhost:3000'],
  })
);

app.use(express.json());

app.post('/prompt', async (req, res) => {
  const { prompt } = req.body as { prompt: string };
  const finalPrompt = `docker run -e PROMPT="${prompt}" arthh/projectsmith:v0`;
  console.log({ finalPrompt });
  const output = shell.exec(finalPrompt);

  res.send(output);
});

app.listen(PORT, () => {
  console.log(`Running - ${HOSTNAME}:${PORT}`);
});
