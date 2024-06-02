// import { Contract, ethers, TransactionReceipt, Wallet } from "ethers";

// import ABI from "./ChatGPTABI.json";

// interface Message {
//   role: string;
//   content: string;
// }
// export const galadriel = {
//   id: 696969,
//   name: "Galadriel Devnet",
//   iconUrl:
//     "https://framerusercontent.com/images/cm2XdkhbP9YP9hqP2vt72ByxUI.png",
//   iconBackground: "#1d4ed8",
//   nativeCurrency: { name: "Galadriel", symbol: "GAL", decimals: 18 },
//   rpcUrls: {
//     default: { http: ["https://devnet.galadriel.com"] },
//   },
//   blockExplorers: {
//     default: { name: "explorer", url: "https://explorer.galadriel.com" },
//   },
// };
// async function main() {
//   const rpcUrl = galadriel.rpcUrls.default.http[0];
//   if (!rpcUrl) throw Error("Missing RPC_URL in .env");
//   const privateKey = process.env.PRIVATE_KEY;
//   if (!privateKey) throw Error("Missing PRIVATE_KEY in .env");
//   const contractAddress = "0xbb28197bccAA45A19dBedC67eFf63c86Ac92Fd2b";
//   if (!contractAddress) throw Error("Missing CHAT_CONTRACT_ADDRESS in .env");

//   const provider = new ethers.JsonRpcProvider(rpcUrl);
//   const wallet = new Wallet(privateKey, provider);
//   const contract = new Contract(contractAddress, ABI, wallet);

//   // The message you want to start the chat with
//   const message = await getUserInput();

//   // Call the startChat function
//   const transactionResponse = await contract.startChat(message);
//   const receipt = await transactionResponse.wait();
//   console.log(`Message sent, tx hash: ${receipt.hash}`);
//   console.log(`Chat started with message: "${message}"`);

//   // Get the chat ID from transaction receipt logs
//   let chatId = getChatId(receipt, contract);
//   console.log(`Created chat ID: ${chatId}`);
//   if (!chatId && chatId !== 0) {
//     return;
//   }

//   let allMessages: Message[] = [];
//   // Run the chat loop: read messages and send messages
//   while (true) {
//     const newMessages: Message[] = await getNewMessages(
//       contract,
//       chatId,
//       allMessages.length
//     );
//     if (newMessages) {
//       for (let message of newMessages) {
//         console.log(`${message.role}: ${message.content}`);
//         allMessages.push(message);
//         if (allMessages.at(-1)?.role == "assistant") {
//           const message = getUserInput();
//           const transactionResponse = await contract.addMessage(
//             message,
//             chatId
//           );
//           const receipt = await transactionResponse.wait();
//           console.log(`Message sent, tx hash: ${receipt.hash}`);
//         }
//       }
//     }
//     await new Promise((resolve) => setTimeout(resolve, 2000));
//   }
// }

// async function getUserInput(): Promise<string | undefined> {
//   const rl = readline.createInterface({
//     input: process.stdin,
//     output: process.stdout,
//   });

//   const question = (query: string): Promise<string> => {
//     return new Promise((resolve) => {
//       rl.question(query, (answer) => {
//         resolve(answer);
//       });
//     });
//   };

//   try {
//     const input = await question("Message ChatGPT: ");
//     rl.close();
//     return input;
//   } catch (err) {
//     console.error("Error getting user input:", err);
//     rl.close();
//   }
// }

// function getChatId(receipt: TransactionReceipt, contract: Contract) {
//   let chatId;
//   for (const log of receipt.logs) {
//     try {
//       const parsedLog = contract.interface.parseLog(log);
//       if (parsedLog && parsedLog.name === "ChatCreated") {
//         // Second event argument
//         chatId = ethers.toNumber(parsedLog.args[1]);
//       }
//     } catch (error) {
//       // This log might not have been from your contract, or it might be an anonymous log
//       console.log("Could not parse log:", log);
//     }
//   }
//   return chatId;
// }

// async function getNewMessages(
//   contract: Contract,
//   chatId: number,
//   currentMessagesCount: number
// ): Promise<Message[]> {
//   const messages = await contract.getMessageHistoryContents(chatId);
//   const roles = await contract.getMessageHistoryRoles(chatId);

//   const newMessages: Message[] = [];
//   messages.forEach((message: any, i: number) => {
//     if (i >= currentMessagesCount) {
//       newMessages.push({
//         role: roles[i],
//         content: messages[i],
//       });
//     }
//   });
//   return newMessages;
// }
