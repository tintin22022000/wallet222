import React, { useEffect, useState } from "react";
import { CHAINS_CONFIG } from "./chains";

import { Tooltip } from "antd";
import { useNavigate } from "react-router-dom";

import axios from "axios";
import CryptoJS from "crypto-js";
import { ethers } from "ethers";
import abi from "../../abi.json";
import NFT from "./NFT";
import Token from "./Token";
import Transaction from "./Transaction";
import Swal from "sweetalert2";
import Loading from "../Layouts/Loading";

const Wallet = ({ setWallet, setSeedPhrase }) => {
  const navigate = useNavigate();
  const [tokens, setTokens] = useState(null);
  const [nfts, setNfts] = useState(null);
  const [balance, setBalance] = useState(0);
  const [amountToSend, setAmountToSend] = useState(null);
  const [sendToAddress, setSendToAddress] = useState(null);
  const [fetching, setFetching] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [hash, setHash] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const [selected, setSelected] = useState("tokens");

  const wallet = localStorage.getItem("wallet");
  const seedPhrase = localStorage.getItem("encrypt-seedPhrase");
  const selectedChain = localStorage.getItem("selectedChain");
  const timeExpired = localStorage.getItem("expired");
  const currentTime = new Date().getTime();
  const encryptPass = localStorage.getItem("encrypt-pass");

  useEffect(() => {
    if (!wallet && seedPhrase) {
      navigate("/enter-password");
      return;
    }
    if (!localStorage.getItem("expired")) {
      localStorage.setItem("expired", new Date().getTime() + 600000);
      expiredTime(600000);
    } else {
      const remainTime = timeExpired - currentTime;
      if (remainTime > 0) {
        expiredTime(remainTime);
      } else {
        localStorage.removeItem("wallet");
        localStorage.removeItem("expired");
        navigate("/enter-password");
      }
    }
  }, []);

  const expiredTime = (time) => {
    clearTimeout(logout);
    var logout = setTimeout(() => {
      localStorage.removeItem("wallet");
      localStorage.removeItem("expired");

      navigate("/enter-password");
    }, time);
  };

  const Error = () => {
    return Swal.fire({
      title: "Error",
      text: "Something went wrong, please try again!",
      icon: "error",
      confirmButtonColor: "#3085d6",
      confirmButtonText: "Try again",
    });
  };

  const onClickActive = (e) => {
    setSelected(e.target.id);
    lightingOnClick(e);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(wallet);
  };

  const lightingOnClick = (e) => {
    document.querySelectorAll(`.wallet-item`).forEach((item) => {
      item.classList.remove(`actived`);
    });
    e.target.className += " actived";
  };

  const decryptSeedPhrase = (password) => {
    if (seedPhrase) {
      const decryptedBytes = CryptoJS.AES.decrypt(seedPhrase, password);
      const decryptedSeedPhrase = decryptedBytes.toString(CryptoJS.enc.Utf8);

      return decryptedSeedPhrase;
    }
    return null;
  };

  async function sendToken(
    tokenAddress,
    recipientAddress,
    amount,
    decimals,
    password
  ) {
    const chain = CHAINS_CONFIG[selectedChain];
    const provider = new ethers.JsonRpcProvider(chain.rpcUrl);
    const amountFormatted = ethers.parseUnits(amount.toString(), decimals);

    const tokenAbi = abi;

    try {
      const privateKey = ethers.Wallet.fromPhrase(
        decryptSeedPhrase(password)
      ).privateKey;
      const wallet = new ethers.Wallet(privateKey, provider);

      const tokenContract = new ethers.Contract(tokenAddress, tokenAbi, wallet);
      const tx = {
        to: tokenAddress, // Địa chỉ của hợp đồng token
        from: wallet.address,
        data: tokenContract.interface.encodeFunctionData("transfer", [
          recipientAddress,
          amountFormatted,
        ]),
        // các trường khác như value, gasLimit có thể được bổ sung nếu cần
      };
      const estimatedGas = await provider.estimateGas(tx);
      const gasPrice = await provider.getFeeData();
      const estimatedGasCost = ethers.formatEther(
        estimatedGas * gasPrice.gasPrice
      );

      return {
        contract: tokenContract,
        wallet: wallet,
        estimatedGasCost: estimatedGasCost,
        txhash: tx.data,
      };
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  async function sendTransaction(to, amount, password) {
    const chain = CHAINS_CONFIG[selectedChain];

    const provider = new ethers.JsonRpcProvider(chain.rpcUrl);

    const privateKey = ethers.Wallet.fromPhrase(
      decryptSeedPhrase(seedPhrase, password)
    ).privateKey;

    const wallet = new ethers.Wallet(privateKey, provider);

    const tx = {
      to: to,
      value: ethers.parseEther(amount.toString()),
    };

    setProcessing(true);
    try {
      setIsLoading(true);
      const transaction = await wallet.sendTransaction(tx);

      setHash(transaction.hash);
      const receipt = await transaction.wait();

      console.log("tranfering ");

      if (receipt.status === 1) {
        setIsLoading(false);
        Swal.fire({
          title: "Transfer success!",
          html: `<div class="transfer-success"><p> Data Hash</p>  <p><strong>${transaction.hash} </strong></p> </div>`,
          icon: "success",
        });
        getAccountTokens();
      } else {
        setIsLoading(false);
        Error();
      }
    } catch (err) {
      Error();
      setIsLoading(false);
      setHash(null);
      setProcessing(false);
      setAmountToSend(null);
      setSendToAddress(null);
    }
  }

  async function getAccountTokens() {
    setFetching(true);
    const url =
      selectedChain === "0x144"
        ? "http://192.168.102.65:3001/getTokenszk"
        : "http://192.168.102.65:3001/getTokens";

    const res = await axios.get(url, {
      params: {
        userAddress: wallet,
        chain: selectedChain,
        encryptSeedPhrase: seedPhrase,
        decryptpass: encryptPass,
      },
    });

    const response = res.data;

    if (response.tokens?.length > 0) {
      setTokens(response.tokens);
    }

    if (response.nfts?.length > 0) {
      setNfts(response.nfts);
    }

    setBalance(response.balance);

    setFetching(false);
  }

  function logout() {
    setSeedPhrase(null);
    setNfts(null);
    setTokens(null);
    setBalance(0);
    localStorage.clear();
    localStorage.setItem("selectedChain", selectedChain);

    navigate("/");
  }

  useEffect(() => {
    if (!wallet || !selectedChain) return;
    setNfts(null);
    setTokens(null);
    setBalance(0);
    getAccountTokens();
  }, [wallet, seedPhrase, selectedChain]);
  return (
    <>
      {isLoading && <Loading />}
      <div className="start-come-to-wallet">
        <div className="onboarding-flow__wrapper">
          <div
            className="recovery-phrase__confirm"
            data-testid="confirm-recovery-phrase"
          >
            <>
              <div className="content">
                <div className="logoutButton">
                  <div className="text-end" onClick={logout}>
                    Logout <i className="bi bi-box-arrow-right"></i>
                  </div>
                </div>
                <div
                  className="walletName text-center"
                  style={{ letterSpacing: 5, fontWeight: "bold" }}
                >
                  PROMINER WALLET
                </div>
                <Tooltip
                  className="d-flex justify-content-center"
                  title={wallet}
                >
                  <div>
                    {wallet?.slice(0, 4)}...{wallet?.slice(38)}
                    <div className="copy_address" onClick={handleCopy}>
                      <i className="bi bi-copy"></i>
                    </div>
                  </div>
                </Tooltip>
                <div className="d-flex justify-content-around mt-4">
                  <div
                    onClick={onClickActive}
                    id="tokens"
                    className="wallet-item actived"
                  >
                    Tokens
                  </div>
                  <div
                    onClick={onClickActive}
                    id="nfts"
                    className="wallet-item"
                  >
                    NFTs
                  </div>
                  <div
                    onClick={onClickActive}
                    id="transaction"
                    className="wallet-item"
                  >
                    Tranfers
                  </div>
                </div>
                <div className="wallet-body">
                  <div className="tokens" hidden={selected !== "tokens"}>
                    <Token
                      tokens={tokens}
                      fetching={fetching}
                      sendToken={sendToken}
                      setFetching={setFetching}
                      getAccountTokens={getAccountTokens}
                    />
                  </div>
                  <div className="nfts" hidden={selected !== "nfts"}>
                    <NFT fetching={fetching} nfts={nfts} />
                  </div>
                  <div
                    className="transaction"
                    hidden={selected !== "transaction"}
                  >
                    <Transaction
                      hash={hash}
                      balance={balance}
                      fetching={fetching}
                      processing={processing}
                      selectedChain={selectedChain}
                      sendTransaction={sendTransaction}
                    />
                  </div>
                </div>
              </div>
            </>
          </div>
        </div>
      </div>
    </>
  );
};

export default Wallet;
