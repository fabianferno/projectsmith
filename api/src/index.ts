import express from 'express';
import cors from 'cors';
import shell from 'shelljs';
import fs from 'fs';

const PORT = process.env.PORT || 4000;
const HOSTNAME = process.env.HOSTNAME || 'http://localhost';
const app = express();

app.use(
  cors({
    origin: ['http://localhost:3000'],
  })
);

app.use(express.json());

async function readFileContent(filePath: string): Promise<any> {
  try {
    const data = await fs.readFileSync(filePath, 'utf8');
    return data;
  } catch (err) {
    console.error(`Error reading file from path: ${filePath}`, err);
    return undefined;
  }
}

app.post('/prompt', async (req, res) => {
  const { prompt } = req.body;

  shell.exec(
    `export WEB3_PRIVATE_KEY=6bec59d4979fdaaf7f4b7174b84332246fb89e42b159e930bf7ea2351483b5a0`
  );

  let finalPrompt = `hive run github.com/arthh/coophive-module:v2 -i PromptEnv="PROMPT=${prompt}" `;

  console.log({ finalPrompt });

  let output = shell.exec(finalPrompt);
  let regex = /cat (.*?)cat/gs;
  let match = output.stdout.match(regex)?.[1]?.trim();

  let fileContent;
  if (match) {
    fileContent = await readFileContent(match);
    if (!fileContent) match = undefined;
  }

  if (!match) {
    finalPrompt = `lilypad run github.com/arthh/coophive-module:v2 -i PromptEnv="PROMPT=${prompt}"`;
    output = shell.exec(finalPrompt);
    match = output.stdout.match(regex)?.[1]?.trim();
    if (match) {
      fileContent = await readFileContent(match);
      if (!fileContent) match = undefined;
    }
  }

  if (!match) {
    finalPrompt = `docker run -e PROMPT="${prompt}" leofranklin1509/projectsmith@sha256:7192a0f26a073747547d8f04a63df13c93596a0bea15bccc10ef88244fc89242`;
    output = shell.exec(finalPrompt);
    regex = /(?<=Start of reply - ).*?(?= - end of reply)/;
    match = output.stdout.split('allMessages')[0] || 'No match found';
  }

  res.send(match);
});

app.listen(PORT, () => {
  console.log(`Running - ${HOSTNAME}:${PORT}`);
});
