import { Squid } from "@0xsquid/sdk"; // Import Squid SDK
import { ethers } from "ethers"; // Import ethers library
import * as dotenv from "dotenv"; // Import dotenv for environment variables
dotenv.config(); // Load environment variables from .env file

// Retrieve environment variables
const privateKey =
  "eeada91a80020324fc8fb214966f5f07d15116c48bd44b426564894edd7db0b7";
const integratorId = "agentsmith-bc0bf1d7-976b-4f6a-b5f1-48cb1b4de179";
const FROM_CHAIN_RPC =
  "https://eth-sepolia.g.alchemy.com/v2/kr-U-EklX-f6rPgshbFLoj9SB8kxR1Bi";

if (!privateKey || !integratorId || !FROM_CHAIN_RPC) {
  console.error(
    "Missing environment variables. Ensure PRIVATE_KEY, INTEGRATOR_ID, and FROM_CHAIN_RPC_ENDPOINT are set."
  );
  process.exit(1);
}

const fromChainId = "56"; // BNB chain ID
const toChainId = "42161"; // Arbitrum chain ID
const fromToken = "0x55d398326f99059fF775485246999027B3197955"; // USDT token address on BNB
const toToken = "0xaf88d065e77c8cC2239327C5EDb3A432268e5831"; // USDC token address on Arbitrum

// Define the amount to be sent (in smallest unit, e.g., wei for Ethereum)
const amount = "1000000000000000"; // 0.0001 USDT

// Set up JSON RPC provider and signer using the private key and RPC URL
const provider = new ethers.JsonRpcProvider(FROM_CHAIN_RPC);
const signer = new ethers.Wallet(privateKey, provider);

// Initialize the Squid client with the base URL and integrator ID
const getSDK = () => {
  const squid = new Squid({
    baseUrl: "https://api.squidrouter.com",
    integratorId: integratorId,
  });
  console.log(squid.tokens);
  return squid;
};

// Main function
export async function performSwap() {
  // Initialize Squid SDK
  const squid = getSDK();
  await squid.init();
  console.log("Initialized Squid SDK");

  // Set up parameters for swapping tokens
  const params = {
    fromAddress: signer.address,
    fromChain: fromChainId,
    fromToken: fromToken,
    fromAmount: amount,
    toChain: toChainId,
    toToken: toToken,
    toAddress: signer.address,
    slippageConfig: {
      autoMode: 1,
    },
    enableBoost: true,
  };

  console.log("Parameters:", params); // Printing the parameters for QA

  // Get the swap route using Squid SDK
  const { route, requestId } = await squid.getRoute(params);
  console.log("Calculated route:", route.estimate.toAmount);

  // Execute the swap transaction
  const tx = await squid.executeRoute({
    signer,
    route,
  });
  const txReceipt = await tx.wait();

  // Show the transaction receipt with Axelarscan link
  const axelarScanLink = "https://axelarscan.io/gmp/" + txReceipt?.hash;
  console.log(`Finished! Check Axelarscan for details: ${axelarScanLink}`);

  // Wait a few seconds before checking the status
  await new Promise((resolve) => setTimeout(resolve, 5000));

  // Parameters for checking the status of the transaction
  const getStatusParams = {
    transactionId: txReceipt?.hash,
    requestId: requestId,
    integratorId: integratorId,
    fromChainId: fromChainId,
    toChainId: toChainId,
  };

  const completedStatuses = [
    "success",
    "partial_success",
    "needs_gas",
    "not_found",
  ];
  const maxRetries = 10; // Maximum number of retries for status check
  let retryCount = 0;
  let status = await squid.getStatus(getStatusParams);

  // Loop to check the transaction status until it is completed or max retries are reached
  console.log(`Initial route status: ${status.squidTransactionStatus}`);

  do {
    try {
      // Wait a few seconds before checking the status
      await new Promise((resolve) => setTimeout(resolve, 5000));

      // Retrieve the transaction's route status
      status = await squid.getStatus(getStatusParams);

      // Display the route status
      console.log(`Route status: ${status.squidTransactionStatus}`);
    } catch (error) {
      // Handle error if the transaction status is not found
      if (
        error instanceof Error &&
        error.response &&
        error.response.status === 404
      ) {
        retryCount++;
        if (retryCount >= maxRetries) {
          console.error("Max retries reached. Transaction not found.");
          break;
        }
        console.log("Transaction not found. Retrying...");
        continue;
      } else {
        throw error;
      }
    }
  } while (
    status &&
    !completedStatuses.includes(status?.squidTransactionStatus)
  );

  // Wait for the transaction to be mined
  console.log("Swap transaction executed:", txReceipt?.hash);
}
