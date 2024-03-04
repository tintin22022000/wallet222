import { Avatar, List, Spin } from "antd";
import { ethers } from "ethers";
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import logo from "../../pays.png";
import Loading from "./../Layouts/Loading";
import ConfirmSendToken from "./ConfirmSendToken";
import ReactDOM from "react-dom";
const Token = ({
  tokens,
  fetching,
  sendToken,
  setFetching,
  getAccountTokens,
}) => {
  const [token, setToken] = useState(null);
  const [isShow, setIsShow] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [recipientAddress, setRecipientAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [infor, setInfor] = useState({ address: "", people: "" });

  useEffect(() => {
    if (!password || !recipientAddress || !amount || amount <= 0) {
      setIsCorrect(false);
    } else {
      setIsCorrect(true);
    }
    if (amount > Number(token?.balance) / 10 ** Number(token?.decimals)) {
      setIsCorrect(false);
      setError("Insufficient tokens.");
    } else {
      setError("");
    }
  }, [password, recipientAddress, amount]);

  const Error = (text) => {
    return Swal.fire({
      title: "Error",
      text: text,
      icon: "error",
      confirmButtonColor: "#3085d6",
      confirmButtonText: "Try again",
    });
  };

  const handleClickSendToken = async (e) => {
    e.preventDefault();

    setIsLoading(true);

    const res = await sendToken(
      token?.token_address,
      recipientAddress,
      amount,
      token?.decimals,
      password
    );

    if (res) {
      setIsLoading(false);
      if (
        res?.message == "Malformed UTF-8 data" ||
        res?.shortMessage == "invalid mnemonic length"
      ) {
        Error("Password is wrong, please try again!");

        setError("Invalid Password");
        return;
      }

      if (res?.shortMessage?.includes("invalid address")) {
        Error("Recipient address is wrong, please try again!");

        setError("Invalid address");
        return;
      }

      if (res?.code == "BAD_DATA") {
        Error("Something went wrong, please try again!");
        return;
      }

      confirmSendToken(res);
    }
    setIsLoading(false);
  };

  const confirmSendToken = async (res) => {
    try {
      const tempDiv = document.createElement("div");
      ReactDOM.render(
        <ConfirmSendToken
          res={res}
          recipientAddress={recipientAddress}
          amount={amount}
          symbol={token?.symbol}
          setInfor={setInfor}
        />,
        tempDiv
      );

      Swal.fire({
        html: tempDiv,
        didClose: () => {
          ReactDOM.unmountComponentAtNode(tempDiv);
        },
        confirmButtonText: "Confirm",
        showDenyButton: true,
        denyButtonText: "Reject",
      }).then(async (result) => {
        if (result.isConfirmed) {
          if (!res) {
            console.log("Nope");
            return;
          }
          try {
            const amountFormatted = ethers.parseUnits(
              amount.toString(),
              token?.decimals
            );

            setIsLoading(true);
            const transfer = await res?.contract.transfer(
              recipientAddress,
              amountFormatted
            );

            if (transfer) {
              setIsLoading(false);
              Swal.fire({
                title: "Transfer success!",
                html: `<div class="transfer-success"><p> Data Hash</p>  <p><strong>${transfer.hash} </strong></p> </div>`,
                icon: "success",
              }).then(() => {
                getAccountTokens();
                setError(null);
                setAmount("");
                setRecipientAddress("");
                setPassword("");
                setFetching(false);
              });
            }
            setIsLoading(false);
            return;
          } catch (error) {
            setIsLoading(false);
            console.log(error);
            Error("Something went wrong, please try again!");
          }
        }
      });
    } catch (error) {
      console.log(error);
    }
  };
  return !fetching ? (
    <>
      {isLoading && <Loading />}
      {tokens ? (
        <>
          <div id="tokens">
            <List
              itemLayout="horizontal"
              dataSource={tokens}
              renderItem={(item, index) => (
                <List.Item
                  className="item-token"
                  data-bs-toggle="modal"
                  data-bs-target="#token"
                  onClick={() => {
                    setToken(item);
                  }}
                >
                  <List.Item.Meta
                    avatar={<Avatar src={item.logo || logo} />}
                    title={
                      item.symbol.length > 12
                        ? item.symbol.substring(0, 12) + "..."
                        : item.symbol
                    }
                    prefixCls=""
                  />

                  <div>
                    {(
                      Number(item.balance) /
                      10 ** Number(item.decimals)
                    ).toFixed(2)}
                  </div>
                </List.Item>
              )}
            />
          </div>
          <div
            className="modal fade"
            id="token"
            aria-labelledby="token"
            aria-hidden="true"
            style={{ zIndex: 1062 }}
          >
            <div
              className="modal-dialog"
              style={{ top: "20%", padding: "0 20px" }}
            >
              <div className="modal-content">
                <div className="modal-header justify-content-center flex-column">
                  <h3 className="modal-title fs-4 fw-bold" id="token">
                    <strong>{`${token?.name} (${token?.symbol})`}</strong>
                  </h3>
                  <hr style={{ width: "100%", margin: "0.5rem 0" }}></hr>
                  <h6>
                    Balance:{" "}
                    <strong>
                      {" "}
                      {`${(
                        Number(token?.balance) /
                        10 ** Number(token?.decimals)
                      ).toFixed(2)} ${token?.symbol}`}
                    </strong>
                  </h6>
                </div>
                <form>
                  <div className="modal-body">
                    <div
                      className="box recovery-phrase__secret box--margin-bottom-4 box--padding-4 box--flex-direction-row box--rounded-md box--border-style-solid box--border-color-border-muted box--border-width-1"
                      style={{ padding: 0 }}
                    >
                      <input
                        autoFocus
                        type="text"
                        className="input recipient-address"
                        placeholder="Recipient address"
                        name="recipientAddress"
                        value={recipientAddress}
                        onChange={(e) => setRecipientAddress(e.target.value)}
                        autoComplete="on"
                      />
                    </div>
                    <div
                      className="box recovery-phrase__secret box--margin-bottom-4 box--padding-4 box--flex-direction-row box--rounded-md box--border-style-solid box--border-color-border-muted box--border-width-1"
                      style={{ padding: 0 }}
                    >
                      <input
                        type="number"
                        className="input amout-token"
                        placeholder="Amount"
                        name="amount"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        autoComplete="on"
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
                        placeholder="Password"
                        name="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        autoComplete="on"
                      />
                    </div>
                    <div style={{ padding: "0px 10px", color: "#ff0606c9" }}>
                      {error}
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button
                      disabled={!isCorrect}
                      type="submit"
                      className="btn btn-primary"
                      data-bs-dismiss="modal"
                      onClick={handleClickSendToken}
                    >
                      Confirm
                    </button>
                    <button
                      type="button"
                      className="btn btn-danger "
                      data-bs-dismiss="modal"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>

          <div
            className="modal fade"
            id="from"
            tabIndex="-1"
            aria-labelledby="from"
            aria-hidden="true"
            style={{ zIndex: 1062 }}
          >
            <div
              className="modal-dialog"
              style={{ top: "30%", padding: "0 20px" }}
            >
              <div className="modal-content">
                <div className="modal-header justify-content-center flex-column">
                  <h5 className="fw-bold">Address {infor.people}</h5>
                </div>

                <div
                  className="modal-body"
                  style={{
                    fontSize: "15px",
                    color: "#00aaff",
                    fontStyle: "italic",
                  }}
                >
                  {infor.address}
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          <span>You seem to not have any tokens yet</span>
          <p className="frontPageBottom">
            About us:{" "}
            <a href="https://prominer.xyz/" target="_blank" rel="noreferrer">
              prominer.xyz
            </a>
          </p>
        </>
      )}
    </>
  ) : (
    <div className="d-flex justify-content-center">
      <Spin />
    </div>
  );
};

export default Token;
