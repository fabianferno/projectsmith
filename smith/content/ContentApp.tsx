import React, { useState, useEffect } from "react";
import logo from "../public/logo.webp";
import chromeWindowBg from "../public/chromeWindow.png";
import Layout from "./components/Layout";
import { Providers } from "./Providers";
import Chat from "./components/Chat";
import processAccount from "./utils/processAccount";
import processTx from "./utils/processTx";

async function parseUrlToJson(
  url: string
): Promise<{ type: string; value: any }> {
  try {
    const regex =
      /https:\/\/beryx.io\/search\/fil\/mainnet\/(address|txs)\/([^?]+)/;
    const match = url.match(regex);

    if (match && match.length >= 3) {
      const type = match[1];
      const value = match[2];

      if (type === "txs") {
        const data = await processTx(value);
        return {
          type: "tx",
          value: data,
        };
      } else {
        const data = await processAccount(value);
        return {
          type: "address",
          value: data,
        };
      }
    }
  } catch (error) {
    console.error(error);
    return {
      type: "error",
      value: error,
    };
  }

  return {
    type: "error",
    value: "Invalid URL",
  };
}

export default function ContentApp() {
  const [isdialogOpen, setIsDialogOpen] = useState(true);
  const [chatActive, setChatActive] = useState(false);
  const [currentData, setCurrentData] = useState<any>({});

  async function initSmith() {
    // Get URL of the current tab
    const url = window.location.href;
    const currentItem = await parseUrlToJson(url);
    alert(
      "Smith is ready to help you!: " +
        currentItem.type +
        " " +
        JSON.stringify(currentItem.value)
    );

    setCurrentData(currentItem);
    setChatActive(true);
  }

  if (!isdialogOpen) {
    return (
      <div className="mx-auto p-6">
        <button
          onClick={() => setIsDialogOpen(true)}
          className="bg-white rounded-md p-3 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          Call Smith <span aria-hidden="true">+</span>
        </button>
      </div>
    );
  }

  return (
    <Providers>
      <div className="mx-auto max-w-7xl md:px-0 lg:p-6">
        <Layout>
          <div className="relative isolate overflow-hidden bg-gray-900 px-6 pt-16 shadow-2xl lg:rounded-3xl md:pt-24 md:h-full sm:h-[100vh] lg:flex lg:gap-x-20 lg:px-24 lg:pt-0">
            <div className="mx-auto max-w-md text-center lg:py-12 lg:mx-0 lg:flex-auto lg:text-left">
              <div className="flex items-center justify-start space-x-4 my-4 mx-auto">
                <img
                  alt="logo"
                  src={logo}
                  className="relative inline-block w-20 rounded-xl"
                />
              </div>
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Chat with Smith, the crypto AI assistant
              </h2>
              <p className="mt-6 text-lg leading-8 text-gray-300">
                Smith is a conversational AI assistant that helps you with your
                crypto explorations. You can ask Smith about the tx / address.
              </p>
              {!chatActive ? (
                <button
                  onClick={initSmith}
                  className="bg-zinc-100 py-1 px-2 rounded-lg text-zinc-800 text-md hover:bg-zinc-200 hover:shadow-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white mt-2 font-bold"
                >
                  Call Smith for this tx/address
                </button>
              ) : (
                <Chat data={currentData} />
              )}
              <div>
                <button
                  onClick={() => setIsDialogOpen(false)}
                  className="mt-4 underline hover:no-underline"
                >
                  Click to send smith away.
                </button>
              </div>
            </div>
            <div className="relative mt-16 h-80 lg:mt-8">
              <img
                className="absolute left-0 top-0 w-[57rem] max-w-none rounded-md bg-white/5 ring-1 ring-white/10"
                src={chromeWindowBg}
                alt="Chrome window screenshot"
                width="1824"
                height="1080"
              />
            </div>
          </div>
        </Layout>
      </div>
    </Providers>
  );
}
