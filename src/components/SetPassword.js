import { ethers, getDefaultProvider } from "ethers";
import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Wallet } from "zksync-web3";
import CryptoJS from "crypto-js";
import logo from "../pays.png";

const SetPassword = ({ seedPhrase, setWallet }) => {
  const Passencrypt = "hungnguyen";
  const navigate = useNavigate();
  const [formPass, setFormPass] = useState({
    password: "",
    confirmPassword: "",
  });
  const [match, setMatch] = useState(true);
  const [isShow, setIsShow] = useState(false);
  const { password, confirmPassword } = formPass;
  const encryptAndStoreSeedPhrase = (seedPhrase, password) => {
    const encryptedText = CryptoJS.AES.encrypt(
      seedPhrase?.toString(),
      password
    );

    return encryptedText;
  };

  const decryptSeedPhrase = (password) => {
    const encryptedSeedPhrase = localStorage.getItem("encrypt-seedPhrase");
    if (encryptedSeedPhrase) {
      const decryptedBytes = CryptoJS.AES.decrypt(
        encryptedSeedPhrase,
        password
      );
      const decryptedSeedPhrase = decryptedBytes.toString(CryptoJS.enc.Utf8);

      return decryptedSeedPhrase;
    }
    return null;
  };

  const onChange = useCallback(
    (e) => {
      setFormPass({ ...formPass, [e.target.name]: e.target.value });
    },
    [password, confirmPassword, formPass]
  );

  useEffect(() => {
    if (
      password !== confirmPassword ||
      !password ||
      !confirmPassword ||
      password?.length < 8 ||
      confirmPassword?.length < 8
    ) {
      setMatch(true);
    } else {
      setMatch(false);
    }
  }, [password, confirmPassword, formPass]);

  const setPassword = () => {
    //let recoveredWallet;
    const encryptPass = encryptAndStoreSeedPhrase(password, Passencrypt);
    localStorage.setItem("encrypt-pass", encryptPass);
    const encryptSeedPhrase = encryptAndStoreSeedPhrase(seedPhrase, password);

    localStorage.setItem("encrypt-seedPhrase", encryptSeedPhrase);

    const decrypt = decryptSeedPhrase(password);
    const zksyncwallet = Wallet.fromMnemonic(decrypt);
    setWallet(zksyncwallet.address);
    localStorage.setItem("wallet", zksyncwallet.address);
    navigate("/my-wallet");
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
                Prominer Wallet
              </h2>
            </div>
            <div className="box box--margin-bottom-4 box--flex-direction-row box--justify-content-center box--text-align-center box--display-flex">
              <h4 className="text-center box box--margin-top-1 box--margin-bottom-1 box--flex-direction-row typography typography--h4 typography--weight-normal typography--style-normal typography--color-text-default">
                Enter Your Password
              </h4>
            </div>
            <form>
              <div
                className="box recovery-phrase__secret box--margin-bottom-4 box--padding-4 box--flex-direction-row box--rounded-md box--border-style-solid box--border-color-border-muted box--border-width-1"
                style={{ padding: 0 }}
              >
                <i
                  className={
                    "eyes-show-pass bi bi-eye" + (!isShow ? "-slash" : "")
                  }
                  onClick={() => setIsShow(!isShow)}
                ></i>
                <input
                  type={isShow ? "text" : "password"}
                  className="input set-password"
                  placeholder="Password"
                  name="password"
                  onChange={onChange}
                />
              </div>
              <div
                className="box recovery-phrase__secret box--margin-bottom-4 box--padding-4 box--flex-direction-row box--rounded-md box--border-style-solid box--border-color-border-muted box--border-width-1"
                style={{ padding: 0 }}
              >
                <i
                  className={
                    "eyes-show-pass bi bi-eye" + (!isShow ? "-slash" : "")
                  }
                  onClick={() => setIsShow(!isShow)}
                ></i>
                <input
                  type={isShow ? "text" : "password"}
                  className="input set-password"
                  placeholder="Confirm password"
                  name="confirmPassword"
                  onChange={onChange}
                />
              </div>

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
                  onClick={setPassword}
                  disabled={match}
                >
                  Confirm
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default SetPassword;
