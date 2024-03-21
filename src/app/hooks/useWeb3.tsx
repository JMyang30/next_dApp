import { MetaMaskInpageProvider } from "@metamask/providers";

import { useEffect, useState } from "react";
import Web3 from "web3";

export const useWeb3 = (): [string, Web3 | undefined] => {
  const [account, setAccount] = useState("");
  const [web3, setWeb3] = useState<Web3 | undefined>(undefined);

  const getCurChainId = async () => {
    const eth = window.ethereum as MetaMaskInpageProvider;
    const curChainId = await eth.request({
      method: "eth_chainId",
    });

    return curChainId;
  };

  const addAndConnNetwork = async (chainId: string) => {
    const eth = window.ethereum as MetaMaskInpageProvider;

    const network = {
      chainId,
      chainName: process.env.ALCTEST,
      rpcUrls: [process.env.RPCURLS],
      nativeCurrency: {
        name: "Ethereum",
        symbol: "ETH",
        decimals: 18,
      },
    };

    await eth.request({
      method: "wallet_addEthereumChain",
      params: [network],
    });
  };

  const getAccount = async () => {
    const eth = window.ethereum as any;

    const account = await eth.request({
      method: "eth_requestAccounts",
    });

    return account;
  };

  useEffect(() => {
    (async function () {
      if (window.ethereum !== undefined) {
        const curChainId = await getCurChainId();
        const targetChainId = process.env.CHAINID as string;

        if (curChainId !== targetChainId) {
          await addAndConnNetwork(targetChainId);
        }

        const [account] = (await getAccount()) as string[];

        setAccount(account);
      }

      const web3 = new Web3((window as any).ethereum);
      setWeb3(web3);
    })();
  }, []);

  return [account, web3];
};
