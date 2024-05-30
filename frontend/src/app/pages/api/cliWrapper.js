require("dotenv").config({ path: __dirname + "/../../../.env" });
const fs = require("fs");
// This will allow us to run code in our CLI.
const { exec } = require("child_process");

// The function we will call on the front end, to run a lilypad job.
function runCliCommand(userInput, callback) {
  console.log("Lilypad Starting...");
  console.log(userInput);

  const web3PrivateKey =
    process.env.WEB3_PRIVATE_KEY ||
    "6bec59d4979fdaaf7f4b7174b84332246fb89e42b159e930bf7ea2351483b5a0";

  if (!web3PrivateKey) {
    console.error("WEB3_PRIVATE_KEY is not set in the environment variables.");
    return;
  }

  // This command will first export our private key, and then run the Lilypad SDXL module with the prompt provided by the user.

  //prompt for llm : lilypad run ollama-pipeline:llama3-8b-lilypad1 -i Prompt='Something awesome this way comes'

  // const command = `export WEB3_PRIVATE_KEY=${web3PrivateKey} && lilypad run sdxl:v0.9-lilypad1 -i PromptEnv="PROMPT=${userInput}"`;
  // const command = `export WEB3_PRIVATE_KEY=${web3PrivateKey} && lilypad run ollama-pipeline:llama3-8b-lilypad2 -i PromptEnv="PROMPT=${userInput}"`;
  const command = `export WEB3_PRIVATE_KEY=${web3PrivateKey} && lilypad run ollama-pipeline:llama3-8b-lilypad2 -i Prompt='${userInput}'`;

  // const command = `export WEB3_PRIVATE_KEY=${web3PrivateKey} && hive run cowsay:v0.0.1 -i Message="hello world"`;

  exec(command, async (error, stdout, stderr) => {
    if (error) {
      console.error(`Error: ${error.message}`);
      return callback(error);
    }
    if (stderr) {
      console.error(`Stderr: ${stderr}`);
      return callback(stderr);
    }

    // When Lilypad runs successfully, it returns the relative path to the files it generated, and the IPFS url. Here we are grabbing the relative path in local storage to serve the image to our front end.
    const lines = stdout.trim().split("\n");
    const path = lines[lines.length - 4].trim(); // Trim any extra whitespace
    const filePath = path.replace("open ", "") + "/outputs/response.json";
    const cid = path.replace(" open /tmp/lilypad/data/downloaded-files/", "");

    console.log("filepath" + ":" + filePath);

    // This console log will confirm that Lilypad ran successfully.
    console.log(stdout);

    // This will return our output to the front end.
    if (callback) {
      callback(null, filePath, cid);
    }
  });
}

module.exports = { runCliCommand };
