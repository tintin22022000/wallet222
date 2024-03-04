import { ethers, getDefaultProvider } from "ethers";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Wallet, Provider } from "zksync-web3";
import logo from "../pays.png";
import CryptoJS from "crypto-js";
import Loading from "./Layouts/Loading";
import cookie from "react-cookie";

const EnterPassword = ({ setSeedPhrase }) => {
  const navigate = useNavigate();
  const [password, setPass] = useState("");
  const [invalid, setInvalid] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isShow, setIsShow] = useState(false);
  const selectedChain = localStorage.getItem("selectedChain");

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

  function logout() {
    setSeedPhrase(null);

    localStorage.clear();
    localStorage.setItem("selectedChain", selectedChain);

    navigate("/");
  }

  const submitPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const decrypt = decryptSeedPhrase(password);
      const zksyncwallet = await Wallet.fromMnemonic(decrypt);
      localStorage.setItem("wallet", zksyncwallet.address);
      navigate("/my-wallet");
    } catch (error) {
      setInvalid(true);
      setLoading(false);
      return;
    }
    return;
  };
  return (
    <>
      {loading && <Loading />}
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
                🎊 Welcome back! 🎊
              </h2>
            </div>
            <div className="box box--margin-bottom-4 box--flex-direction-row box--justify-content-center box--text-align-center box--display-flex">
              <h4 className="text-center box box--margin-top-1 box--margin-bottom-1 box--flex-direction-row typography typography--h4 typography--weight-normal typography--style-normal typography--color-text-default">
                Enter Password
              </h4>
            </div>
            <form onSubmit={submitPassword}>
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
                  className="input set-password enter-password"
                  placeholder="Type your password here"
                  value={password}
                  onChange={(e) => setPass(e.target.value)}
                />
              </div>
              {invalid && (
                <p className="text-center" style={{ color: "red" }}>
                  {" "}
                  Invalid Password
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
                  type="submit"
                  onSubmit={() => setLoading(true)}
                >
                  Import
                </button>
              </div>
            </form>
            <div className="text-center">
              <a className="forgot-password" onClick={logout}>
                Forgot Password?
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EnterPassword;
