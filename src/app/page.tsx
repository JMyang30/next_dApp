"use client";
import { useWeb3 } from "./hooks/useWeb3";
import { useEffect, useState } from "react";

export default function Home() {
  const [account, web3] = useWeb3();
  const [isLogin, setIsLogin] = useState<Boolean>();
  const [balance, setBalance] = useState<number>();
  const [amount, setAmount] = useState<string>("");
  const [received, setReceived] = useState<string>("");

  const changeReceived = (e: React.ChangeEvent<HTMLInputElement>) => {
    setReceived(e.target.value);
  };

  const changeAmount = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(e.target.value);
  };

  const fireTx = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    console.log("account:", account, "received:", received, "amount:", amount);

    await web3?.eth.sendTransaction({
      from: account,
      to: received,
      value: web3.utils.toWei(amount, "ether"),
      gasPrice: 10000000000,
    });
  };

  useEffect(() => {
    (async function () {
      const balance = await web3?.eth.getBalance(account);
      if (balance !== undefined) {
        setBalance(Number(balance) / 10 ** 18);
      }
    })();

    if (account === "") {
      setIsLogin(false);
    } else {
      setIsLogin(true);
    }
  }, [account, web3]);

  return (
    <div className="flex flex-col justify-center items-start text-start p-5">
      <h1 className="text-5xl my-5">ETH APP</h1>
      {isLogin ? (
        <>
          <div className="shadow-[0_0_10px_0_rgba(255,255,255,.3)] p-5 my-5">
            <h3 className="text-2xl mb-3">Accounts Info</h3>
            <ul>
              <li>Account : {account}</li>
              <li>Balance : {balance} ETH</li>
            </ul>
          </div>
          <div className="shadow-[0_0_10px_0_rgba(255,255,255,.3)] p-5">
            <h3 className="text-2xl mb-3">Transaction</h3>
            <form onSubmit={fireTx}>
              <ul className="flex flex-col items-start justify-start">
                <li className="mb-3">
                  <input
                    className="text-black"
                    type="text"
                    id="received"
                    placeholder="받을 사람"
                    onChange={changeReceived}
                  />
                  &nbsp;&nbsp;ADRESS
                </li>
                <li className="mb-3">
                  <input
                    className="text-black"
                    type="text"
                    id="amount"
                    placeholder="보낼 금액"
                    onChange={changeAmount}
                  />
                  &nbsp;&nbsp;ETH
                </li>
                <li>
                  <button
                    className="text-white px-4 py-2 bg-slate-700 rounded-md"
                    type="submit"
                  >
                    전송
                  </button>
                </li>
              </ul>
            </form>
          </div>
        </>
      ) : (
        <div>메타마스크 없음</div>
      )}
    </div>
  );
}
