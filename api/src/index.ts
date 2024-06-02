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
  // let finalPrompt = `docker run -e PROMPT="${prompt}" arthh/projectsmith:v0`;
  let finalPrompt = `hive run github.com/arthh/coophive-module:v2 -i PromptEnv="PROMPT=${prompt}" `;
  console.log({ finalPrompt });
  let output = shell.exec(finalPrompt);
  const regex = /(?<=Start of reply - ).*?(?= - end of reply)/;
  let match = output.match(regex)?.[0];

  if (!match) {
    finalPrompt = `lilypad run github.com/arthh/coophive-module:v2 -i PromptEnv="PROMPT=${prompt}"`;
    match =
      output.match(regex)?.[0] ||
      'Was not possible to resolve this, failed to run using CoopHive and Lilypad';
  }

  res.send(match);
});

app.listen(PORT, () => {
  console.log(`Running - ${HOSTNAME}:${PORT}`);
});
