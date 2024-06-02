import axios from "axios";

export default async function processAccount(address: string) {
  const balance = await axios.get(
    `https://api.zondax.ch/fil/data/v3/mainnet/account/balance/${address}`,
    {
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${process.env.BERYX_TOKEN}`,
      },
    }
  );

  const info = await axios.get(
    `https://api.zondax.ch/fil/data/v3/mainnet/account/info/${address}`,
    {
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${process.env.BERYX_TOKEN}`,
      },
    }
  );

  const transactions = await axios.get(
    `https://api.zondax.ch/fil/data/v3/mainnet/transactions/address/${address}/receiver?limit=100&remove_internal_txs=1`,
    {
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${process.env.BERYX_TOKEN}`,
      },
    }
  );

  return {
    address: address,
    balance: balance.data,
    info: info.data,
    transactions: transactions.data,
  };
}
