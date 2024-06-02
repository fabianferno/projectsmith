import { Contract, Wallet, TransactionReceipt } from "ethers";
import { ethers } from "ethers";
import { performSwap } from "./swapHelper.js";
import { ABI } from "./consts.js";
import axios from "axios";

const GALARIEL_RPC_URL = "https://devnet.galadriel.com";

let chatId = null;
let messages = [];

async function getGasInfo() {
  // Gives gas used in txs for all addresses at fixed frequency
  const token =
    "eyJhbGciOiJFUzI1NiIsImtpZCI6ImtleS1iZXJ5eC0wMDEiLCJ0eXAiOiJKV1QifQ.eyJyb2xlcyI6W10sImlzcyI6IlpvbmRheCIsImF1ZCI6WyJiZXJ5eCJdLCJleHAiOjE3MjI0NTcwNzcsImp0aSI6IkZhYmlhbiBGZXJubyxoZWxsb0BmYWJpYW5mZXJuby5jb20ifQ.J6JRiHmB7TGfuKa0I_2Gatix8MsT1UpqNbZa6UuBzzFLUPQViTk1I7bcj-FcVp5TsYMFNvpFTImzzmPkQFAMKw";

  const gasData = await axios.get(
    `https://api.zondax.ch/fil/data/v3/mainnet/stats/gas-used/global/weekly?sort_by=bucket%3Aasc`,
    {
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return gasData.data;
}

const initializeChat = async (contract, input) => {
  const gasData = await getGasInfo();

  if (chatId === null) {
    console.log("Starting chat with current context...");
    const transactionResponse = await contract.startChat(`
          You are a blockchain data  analyst and your task is to analyze the following data:

            ${JSON.stringify(gasData)} ${input}

            Use the context and return only yes or no. Is it advisable to make a swap this week? 
      `);
    const receipt = await transactionResponse.wait();
    const newChatId = getChatId(receipt, contract);
    chatId = newChatId;
    console.log(`Chat started with ID: ${newChatId}`);
  }
};

function getChatId(receipt, contract) {
  for (const log of receipt.logs) {
    try {
      const parsedLog = contract.interface.parseLog(log);
      if (parsedLog && parsedLog.name === "ChatCreated") {
        return parseInt(parsedLog.args[1]);
      }
    } catch (error) {
      console.error("Could not parse log:", log);
    }
  }
  return null;
}

const fetchMessages = async (contract) => {
  console.log("Fetching messages...");
  try {
    const messagesHistory = await contract.getMessageHistoryContents(chatId);
    const roles = await contract.getMessageHistoryRoles(chatId);
    const newMessages = messagesHistory.map((message, i) => ({
      role: roles[i],
      content: message,
    }));

    console.log("Messages fetched:", newMessages);
    messages = newMessages;
    return newMessages;
  } catch (error) {
    console.error("Error fetching messages:", error);
  }
};

const addMessage = async (contract, input, setInput) => {
  console.log("Sending message...");

  if (!input.trim()) return;
  const transactionResponse = await contract.addMessage(input, chatId);
  const receipt = await transactionResponse.wait();
  console.log(`Message sent, tx hash: ${receipt.transactionHash}`);
  await fetchMessages(contract);
};

const input = process.env.INPUT;
if (!input) throw Error("Missing INPUT in process args");

async function main() {
  const privateKey =
    "eeada91a80020324fc8fb214966f5f07d15116c48bd44b426564894edd7db0b7";
  const contractAddress = "0xbb28197bccAA45A19dBedC67eFf63c86Ac92Fd2b";

  const provider = new ethers.JsonRpcProvider(GALARIEL_RPC_URL);
  const wallet = new Wallet(privateKey, provider);
  const contract = new Contract(contractAddress, ABI, wallet);

  let iterations = 5;

  await initializeChat(contract, input);

  // TODO: AI Agent to run the swap if the based on the gas data from getGasInfo
  while (true) {
    iterations--;
    if (iterations === 0) {
      break;
    }

    const messages = await fetchMessages(contract);
    if (messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.role === "user") {
        const message = lastMessage.content;
        if (message.toLowerCase() === "yes") {
          await performSwap();
          break;
        }
      }
    }

    // Analyze again
    await addMessage(
      contract,
      `
            Can you analyze the gas data again and provide a recommendation? - Only return yes/no
        `,
      () => {}
    );

    await new Promise((r) => setTimeout(r, 5000));
  }
}

main();
