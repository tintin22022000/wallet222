import { Spin } from "antd";
import React from "react";

const NFT = ({ nfts, fetching }) => {
  return !fetching ? (
    <>
      {nfts ? (
        <div id="nfts">
          {nfts.map((e, i) => {
            return (
              <>
                {e && (
                  <img
                    key={i}
                    className="nftImage"
                    alt="nftImage"
                    style={{ width: "-webkit-fill-available", padding: "5px" }}
                    src={e}
                  />
                )}
              </>
            );
          })}
        </div>
      ) : (
        <>
          <span>You seem to not have any NFTs yet</span>
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

export default NFT;
