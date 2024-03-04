import { Select } from "antd";
import React from "react";
import logo from "../../pays.png";
const Header = ({ selectedChain, setSelectedChain }) => {
  return (
    <div className="header">
      <div className="logon-wallet">
        <img src={logo} width={30} />
      </div>
      <div className="network">
        <Select
          onChange={(val) => {
            localStorage.setItem("selectedChain", val || selectedChain);
            setSelectedChain(val);
          }}
          value={selectedChain}
          style={{ width: "170px" }}
          options={[
            {
              label: "Ethereum",
              value: "0x1",
            },
            {
              label: "Mumbai Testnet",
              value: "0x13881",
            },
            {
              label: "Polygon",
              value: "0x89",
            },
            {
              label: "Binance Smart Chain",
              value: "0x38",
            },
            {
              label: "zkSync Mainnet",
              value: "0x144",
            },
          ]}
          className="dropdown"
        ></Select>
      </div>
    </div>
  );
};

export default Header;
