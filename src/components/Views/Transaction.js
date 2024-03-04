import { ethers } from "ethers";
import React, { useState } from "react";
import { CHAINS_CONFIG } from "./chains";
import { Button, Input, Spin, Tooltip } from "antd";
import axios from "axios";

const Transaction = ({
  sendTransaction,
  balance,
  selectedChain,
  processing,
  hash,
  fetching,
}) => {
  const [amountToSend, setAmountToSend] = useState(null);
  const [sendToAddress, setSendToAddress] = useState(null);
  const [password, setPassword] = useState("");
  const [isShow, setIsShow] = useState(false);

  return !fetching ? (
    <>
      <h4>Native Balance </h4>
      <h2>
        {balance ? balance?.toFixed(4) : 0}{" "}
        {CHAINS_CONFIG[selectedChain]?.ticker}
      </h2>
      <div className="sendRow">
        <p style={{ textAlign: "left", marginBottom: 5 }}> To:</p>
        <Input
          value={sendToAddress}
          onChange={(e) => setSendToAddress(e.target.value)}
          placeholder="0x..."
        />
      </div>
      <div className="sendRow">
        <p style={{ textAlign: "left", margin: "15px 0 5px" }}> Amount:</p>
        <Input
          value={amountToSend}
          onChange={(e) => setAmountToSend(e.target.value)}
          placeholder="Native tokens you wish to send..."
        />
      </div>
      <Button
        style={{ width: "100%", marginTop: "20px", marginBottom: "20px" }}
        type="primary"
        data-bs-toggle="modal"
        data-bs-target="#transfer"
      >
        Send
      </Button>
      {processing && (
        <>
          <Spin />
          {hash && (
            <Tooltip title={hash}>
              <p>Hover For Tx Hash</p>
            </Tooltip>
          )}
        </>
      )}

      <div
        className="modal fade"
        id="transfer"
        tabIndex="-1"
        aria-labelledby="transfer"
        aria-hidden="true"
        style={{ zIndex: 1061 }}
      >
        <div className="modal-dialog" style={{ top: "30%", padding: "0 20px" }}>
          <div className="modal-content">
            <div className="modal-header justify-content-center">
              <h1 className="modal-title fs-4 fw-bold" id="transfer">
                Type Your Password
              </h1>
            </div>
            <form>
              <div className="modal-body">
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
                    className="input enter-password"
                    placeholder="Password"
                    name="password"
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="on"
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-primary"
                  data-bs-dismiss="modal"
                  onClick={() =>
                    sendTransaction(sendToAddress, amountToSend, password)
                  }
                >
                  Confirm
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  ) : (
    <div className="d-flex justify-content-center">
      <Spin />
    </div>
  );
};

export default Transaction;
