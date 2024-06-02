import { Contract, ethers, TransactionReceipt, Wallet } from "ethers";
import ABI from "./abis/AgentABI.json" assert { type: "json" };
import * as readline from "readline";
import fs from "fs/promises"; // Use the promise-based version of fs

import { config } from "dotenv";
import path from "path";
config();

async function main() {
  const rpcUrl = "https://devnet.galadriel.com";
  if (!rpcUrl) throw Error("Missing RPC_URL in .env");
  const privateKey =
    "698ffa7b9ef6e9368120761d5e5550b29f12810209efa1c0044c413b8840cdda";
  if (!privateKey) throw Error("Missing PRIVATE_KEY in .env");
  const contractAddress = "0xF757B73165820b1DD00E4F0a36a6ea17aD89A15a";
  if (!contractAddress) throw Error("Missing AGENT_CONTRACT_ADDRESS in .env");
  const prompt = process.env.PROMPT;
  if (!prompt) throw Error("Missing prompt in process args");

  const provider = new ethers.JsonRpcProvider(rpcUrl);
  const wallet = new Wallet(privateKey, provider);
  const contract = new Contract(contractAddress, ABI, wallet);

  // The query you want to start the agent with
  const query = prompt;
  const maxIterations = 1;

  // Call the startChat function
  const transactionResponse = await contract.runAgent(
    query,
    Number(maxIterations)
  );
  const receipt = await transactionResponse.wait();

  // Get the agent run ID from transaction receipt logs
  let agentRunID = getAgentRunId(receipt, contract);
  if (!agentRunID && agentRunID !== 0) {
    return;
  }

  let allMessages = [];
  // Run the chat loop: read messages and send messages
  var exitNextLoop = false;
  while (true) {
    const newMessages = await getNewMessages(
      contract,
      agentRunID,
      allMessages.length
    );
    if (newMessages) {
      for (let message of newMessages) {
        if (message.role === "assistant") {
          console.log(message.content);
          allMessages.push(message);
        }
      }
    }
    await new Promise((resolve) => setTimeout(resolve, 2000));
    if (await contract.isRunFinished(agentRunID)) {
      exitNextLoop = true;
    }

    if (exitNextLoop) {
      break;
    }
  }

  console.log(allMessages);
  await fs
    .writeFile(
      "./outputs/response.json",
      JSON.stringify(allMessages, null, 2),
      "utf-8"
    )
    .then(() => {
      console.log("File has been saved successfully.");
      return fs.readFile("./outputs/response.json", "utf-8");
    })
    .then((data) => {
      console.log("File content:", data);
    })
    .catch((error) => {
      console.error("Error reading file:", error);
    });
  // console.log("File has been saved successfully.");
}

function getAgentRunId(receipt, contract) {
  let agentRunID;
  for (const log of receipt.logs) {
    try {
      const parsedLog = contract.interface.parseLog(log);
      if (parsedLog && parsedLog.name === "AgentRunCreated") {
        // Second event argument
        agentRunID = ethers.toNumber(parsedLog.args[1]);
      }
    } catch (error) {
      // This log might not have been from your contract, or it might be an anonymous log
    }
  }
  return agentRunID;
}

async function getNewMessages(contract, agentRunID, currentMessagesCount) {
  const messages = await contract.getMessageHistoryContents(agentRunID);
  const roles = await contract.getMessageHistoryRoles(agentRunID);

  const newMessages = [];
  messages.forEach((message, i) => {
    if (i >= currentMessagesCount) {
      newMessages.push({
        role: roles[i],
        content: messages[i],
      });
    }
  });
  return newMessages;
}

main().then();
