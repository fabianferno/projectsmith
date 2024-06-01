"use client";
import Image from "next/image";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import { FormEvent, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { Badge } from "@/components/ui/badge";

export default function Home() {
  const account = useAccount();

  useEffect(() => {}, []);
  const [userInput, setUserInput] = useState<string>("");

  // State for storing the URL of the generated image
  const [output, setOutput] = useState<string>("");

  // State to track loading status
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Function to handle the form submission
  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ): Promise<void> => {
    event.preventDefault();
    setIsLoading(true); // Start loading
    try {
      const response = await fetch("http://localhost:3001/api/cliWrapper", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userInput }),
      });
      const data = await response.json();
      console.log(data.response);
      setOutput(data.response);
    } catch (error) {
      console.error("Error:", error);
    }
    setIsLoading(false); // End loading
  };

  return (
    <main className="container flex min-h-screen flex-col items-center justify-between p-10">
      <div className="absolute top-5 right-5">
        <ModeToggle />
      </div>
      <div className="relative flex place-items-center">
        <Image
          className="relative mr-10"
          src="/giphy.gif"
          alt="Karma Logo"
          width={180}
          height={180}
          priority
        />
        <div className="mr-10">
          <div className="text-3xl font-bold">some app</div>
          <div className="text-lg ">this app does something</div>
        </div>
      </div>

      <section className="lg:max-w-5xl lg:w-full ">
        <div className="ring-1 ring-zinc-700 rounded-xl p-8 w-full">
          {!account?.address ? (
            <div className="flex justify-center items-center flex-col">
              <h3 className="text-md mb-5">
                Connect your wallet to get started
              </h3>
              <ConnectButton />
            </div>
          ) : (
            <div className="flex justify-center items-start flex-col">
              <div className="flex w-full justify-between items-center">
                <ConnectButton />
              </div>

              {account?.address && (
                <div className="mt-10 flex justify-center items-between flex-col w-full"></div>
              )}
            </div>
          )}
        </div>
      </section>
      <section className="lg:max-w-5xl lg:w-full ">
        <form onSubmit={handleSubmit} className="w-full mt-2">
          {/* Textarea for user input */}
          <textarea
            className="w-full p-2 text-white bg-zinc-700 rounded-xl"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Enter your prompt"
            rows={4}
          />
          <div className="w-full flex justify-end">
            {/* Submit button for the form */}
            <button type="submit" className="mt-4">
              Submit
            </button>
          </div>
        </form>
        {isLoading && <>Processing the Data</>}
        {
          // If the output is not empty, display the output
          output && (
            <div className="w-full mt-4">
              <div className="w-full p-2 text-white">{output}</div>
            </div>
          )
        }
      </section>
    </main>
  );
}
