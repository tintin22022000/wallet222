import { ethers, getDefaultProvider } from "ethers";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Wallet, Provider } from "zksync-web3";
import logo from "../pays.png";
import axios from "axios";

const ImportWallet = ({ setSeedPhrase }) => {
  const navigate = useNavigate();
  const [secretKey, setSecretKey] = useState("");
  const [nonValid, setNonValid] = useState(false);

  const importWallet = async () => {
    try {
      const res = await axios.post("http://192.168.102.65:3001/import-wallet", {
        secretKey: secretKey,
      });
      console.log(res);
      if (res?.data) {
        setSeedPhrase(secretKey);
        navigate("/set-password");

        console.log(res);
      }
    } catch (error) {
      setNonValid(true);
      console.log(error);
    }

    return;
  };

  return (
    <>
      <div className="start-come-to-wallet">
        <div className="onboarding-flow__wrapper">
          <div
            className="recovery-phrase__confirm"
            data-testid="confirm-recovery-phrase"
          >
            <div className="box box--margin-bottom-4 box--flex-direction-row"></div>
            <div className="text-center box box--margin-bottom-4 box--flex-direction-row box--justify-content-center box--text-align-center box--display-flex">
              <img src={logo} width={70} />
            </div>
            <div className="box box--margin-bottom-4 box--flex-direction-row box--justify-content-center box--text-align-center box--display-flex">
              <h2 className="text-center box box--margin-top-1 box--margin-bottom-1 box--flex-direction-row typography typography--h2 typography--weight-bold typography--style-normal typography--color-text-default">
                Import Wallet
              </h2>
            </div>
            <div className="box box--margin-bottom-4 box--flex-direction-row box--justify-content-center box--text-align-center box--display-flex">
              <h4 className="text-center box box--margin-top-1 box--margin-bottom-1 box--flex-direction-row typography typography--h4 typography--weight-normal typography--style-normal typography--color-text-default">
                Enter Your Secret Recovery Phrase
              </h4>
            </div>
            <div
              className="box recovery-phrase__secret box--margin-bottom-4 box--padding-4 box--flex-direction-row box--rounded-md box--border-style-solid box--border-color-border-muted box--border-width-1"
              style={{ padding: 0 }}
            >
              <textarea
                type="text"
                className="input-confirm-secret-key"
                placeholder="Type your secret key here..."
                value={secretKey}
                onChange={(e) => setSecretKey(e.target.value)}
              />
            </div>
            {nonValid && (
              <p className="text-center" style={{ color: "red" }}>
                {" "}
                Invalid Seed Phrase
              </p>
            )}
            <div className="recovery-phrase__footer__confirm">
              <button
                className="btn btn-primary btn-custom"
                style={{
                  minHeight: "54px",
                  alignSelf: "center",
                  width: "100%",
                  maxWidth: "300px",
                  letterSpacing: "2px",
                }}
                onClick={importWallet}
              >
                Import
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ImportWallet;
