import axios from "axios";

export default async function processAccount(txHash: string) {
  const tx = await axios.get(
    `https://api.zondax.ch/fil/data/v3/mainnet/transactions/hash/${txHash}?limit=100&remove_internal_txs=1&remove_fee_txs=1&sort_by=height%3Aasc%2Camount%3Adesc`,
    {
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${process.env.BERYX_TOKEN}`,
      },
    }
  );

  return {
    txHash: txHash,
    tx: tx.data,
  };
}
