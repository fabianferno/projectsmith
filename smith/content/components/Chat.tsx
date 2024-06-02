import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import ABI from "../utils/ChatGPTABI.json";
import { Contract, Wallet, TransactionReceipt } from "ethers";

const galadriel = {
  id: 696969,
  name: "Galadriel Devnet",
  iconUrl:
    "https://framerusercontent.com/images/cm2XdkhbP9YP9hqP2vt72ByxUI.png",
  iconBackground: "#1d4ed8",
  nativeCurrency: { name: "Galadriel", symbol: "GAL", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://devnet.galadriel.com"] },
  },
  blockExplorers: {
    default: { name: "explorer", url: "https://explorer.galadriel.com" },
  },
};

interface Message {
  role: string;
  content: string;
}

const ChatComponent = ({ data }: { data: any }) => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [chatId, setChatId] = useState<number | null>(null);

  const privateKey = process.env.PRIVATE_KEY;
  const contractAddress = "0xbb28197bccAA45A19dBedC67eFf63c86Ac92Fd2b";

  const provider = new ethers.JsonRpcProvider(
    galadriel.rpcUrls.default.http[0]
  );
  const wallet = new Wallet(privateKey!, provider);
  const contract = new Contract(contractAddress, ABI, wallet);

  useEffect(() => {
    const initializeChat = async () => {
      if (chatId === null) {
        alert("Starting chat with current context...");
        const transactionResponse = await contract.startChat(`
            You are a blockchain data analyst and your task is to analyze the following data:

            ${JSON.stringify(data)}

            Use the context and answer my following questions:
        `);
        const receipt = await transactionResponse.wait();
        const newChatId = getChatId(receipt, contract);
        setChatId(newChatId);
        console.log(`Chat started with ID: ${newChatId}`);
      }
    };
    initializeChat();
  }, [chatId]);

  const handleMessageSubmit = async (e: React.FormEvent) => {
    console.log("Sending message...");
    e.preventDefault();
    if (!input.trim()) return;
    const transactionResponse = await contract.addMessage(input, chatId!);
    const receipt = await transactionResponse.wait();
    console.log(`Message sent, tx hash: ${receipt.transactionHash}`);
    await fetchMessages();
    setInput("");
  };

  const fetchMessages = async () => {
    console.log("Fetching messages...");
    try {
      const messages = await contract.getMessageHistoryContents(chatId!);
      const roles = await contract.getMessageHistoryRoles(chatId!);
      const newMessages = messages.map((message: string, i: number) => ({
        role: roles[i],
        content: message,
      }));

      setMessages(newMessages);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <form onSubmit={handleMessageSubmit} className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={handleInputChange}
          placeholder="Type your message here..."
          className="flex-1 p-2 border rounded-lg"
        />
        <button
          onClick={fetchMessages}
          className="bg-blue-500 hover:bg-sky-500 text-white font-bold py-2 px-4 rounded mx-1"
        >
          🔃
        </button>
        <button
          type="submit"
          className="bg-blue-500 hover:bg-sky-500 text-white font-bold py-2 px-4 rounded"
        >
          Send Message
        </button>
      </form>
      <ul
        className="mt-4 space-y-2 h-[30vh] overflow-y-auto"
        style={{ maxHeight: "30vh" }}
      >
        {messages.map((msg, index) => (
          <li
            key={index}
            className={`p-3 overflow-hidden rounded ${
              msg.role === "user" ? "bg-blue-900" : "bg-slate-700"
            }`}
          >
            <strong>{msg.role}:</strong> {msg.content}
          </li>
        ))}
      </ul>
    </div>
  );
};

function getChatId(
  receipt: TransactionReceipt,
  contract: Contract
): number | null {
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

export default ChatComponent;
