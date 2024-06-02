import express from "express";
import cors from "cors";
import shell from "shelljs";
import fs from "fs";

const PORT = process.env.PORT || 4000;
const HOSTNAME = process.env.HOSTNAME || "http://localhost";
const app = express();

app.use(
  cors({
    origin: ["http://localhost:3000"],
  })
);

app.use(express.json());

async function readFileContent(filePath: string): Promise<any> {
  try {
    const data = await fs.readFileSync(filePath, "utf8");
    return data;
  } catch (err) {
    console.error(`Error reading file from path: ${filePath}`, err);
    return undefined;
  }
}

app.post("/prompt", async (req, res) => {
  const { prompt } = req.body;

  shell.exec(
    `export WEB3_PRIVATE_KEY=6bec59d4979fdaaf7f4b7174b84332246fb89e42b159e930bf7ea2351483b5a0`
  );

  let finalPrompt = `export WEB3_PRIVATE_KEY=6bec59d4979fdaaf7f4b7174b84332246fb89e42b159e930bf7ea2351483b5a0 && hive run github.com/LeoFranklin015/coophiveAgent:2f6236e0379eb112adfcb96dea2c66bbf71fc42c -i PromptEnv="INPUT${prompt}"`;

  console.log({ finalPrompt });

  let output = shell.exec(finalPrompt);
  // let regex = /cat (.*?)cat/gs;
  // let match = output.stdout.match(regex)?.[1]?.trim();
  let regex = /open (\/tmp\/coophive\/data\/downloaded-files\/[^\s]+)/;
  let match = output.stdout.match(regex)?.[1]?.trim();

  console.log(match);

  let fileContent;
  if (match) {
    try {
      fileContent = await readFileContent(match);
      if (!fileContent) match = undefined;
    } catch (error) {
      console.log("Coophive error");
      match = undefined;
    }
  }

  if (!match) {
    finalPrompt = `export WEB3_PRIVATE_KEY=6bec59d4979fdaaf7f4b7174b84332246fb89e42b159e930bf7ea2351483b5a0 && lilypad run github.com/LeoFranklin015/coophiveAgent:34c3403f4cafd7247294fafecdc9a770e319f661 -i PromptEnv="INPUT=${prompt}"`;
    output = shell.exec(finalPrompt);
    regex = /open (\/tmp\/lilypad\/data\/downloaded-files\/[^\s]+)/;
    match = output.stdout.match(regex)?.[1]?.trim();
    if (match) {
      try {
        fileContent = await readFileContent(match);
        if (!fileContent) match = undefined;
      } catch (error) {
        match = undefined;
        console.log("Lilypad error");
      }
    }
  }

  if (!match) {
    finalPrompt = `docker run -e PROMPT="${prompt}" leofranklin1509/projectsmith@leofranklin1509/projectsmith@sha256:7848605ef95ea76153125316360cba1d909bbdeec834b9652f2f456ee837df1b`;
    output = shell.exec(finalPrompt);
    regex = /(?<=Start of reply - ).*?(?= - end of reply)/;
    console.log(output.stdout);
    match = output.stdout.split("allMessages")[0] || "No match found";
  }

  res.send(match);
});

app.listen(PORT, () => {
  console.log(`Running - ${HOSTNAME}:${PORT}`);
});
