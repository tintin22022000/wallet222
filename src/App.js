import "bootstrap";
import { useState } from "react";
import { Route, Routes } from "react-router-dom";
import "./App.css";
import EnterPassword from "./components/EnterPassword";
import ImportWallet from "./components/ImportWallet";
import Layout from "./components/Layouts/Layout";
import SetPassword from "./components/SetPassword";
import NFT from "./components/Views/NFT";
import Token from "./components/Views/Token";
import Transaction from "./components/Views/Transaction";
import Wallet from "./components/Views/Wallet";

function App() {
  const [wallet, setWallet] = useState(localStorage.getItem("wallet") ?? null);
  const [seedPhrase, setSeedPhrase] = useState(
    localStorage.getItem("encrypt-seedPhrase") ?? null
  );
  const chain = localStorage.getItem("selectedChain");

  if (!chain) {
    localStorage.setItem("selectedChain", "0x1");
  }
  const [selectedChain, setSelectedChain] = useState(chain || "0x1");

  return (
    <div className="body-extension">
      <header>
        <Layout
          setSelectedChain={setSelectedChain}
          selectedChain={selectedChain}
        />
      </header>
      {seedPhrase ? (
        <Routes>
          <Route
            path="/"
            element={
              <Wallet setWallet={setWallet} setSeedPhrase={setSeedPhrase} />
            }
          />
          <Route
            path="/my-wallet"
            element={
              <Wallet
                wallet={wallet}
                setWallet={setWallet}
                seedPhrase={seedPhrase}
                setSeedPhrase={setSeedPhrase}
                selectedChain={selectedChain}
              />
            }
          >
            <Route path="" element={<Token />} />
            <Route path="Tokens" element={<Token />} />
            <Route path="NFTs" element={<NFT />} />
            <Route
              path="Tranfer"
              element={<Transaction selectedChain={selectedChain} />}
            />
          </Route>
          {localStorage.getItem("encrypt-seedPhrase") ? (
            <Route
              path="/enter-password"
              element={<EnterPassword setSeedPhrase={setSeedPhrase} />}
            />
          ) : (
            <Route
              path="/set-password"
              element={
                <SetPassword seedPhrase={seedPhrase} setWallet={setWallet} />
              }
            />
          )}
        </Routes>
      ) : (
        <Routes>
          <Route
            path="/"
            element={<ImportWallet setSeedPhrase={setSeedPhrase} />}
          />
        </Routes>
      )}
    </div>
  );
}

export default App;
