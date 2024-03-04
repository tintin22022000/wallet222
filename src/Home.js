import React, { useState } from "react";
import logo from "./pays.png";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  const [checkAgree, setCheckAgree] = useState(true);
  return (
    <>
      <div className="start-come-to-wallet">
        <div className="">
          <h2 className="text-center">Let's get started</h2>
          <p className="text-center my-3 mx-3">
            Trusted by millions, Prominer is a secure wallet making the world of
            web3 accessible to all.
          </p>
          <div className="text-center">
            <img src={logo} alt="img" />
          </div>
        </div>
        <div className="text-center mt-4">
          <div className="d-flex align-items-center justify-content-center">
            <input
              className="check-box onboarding__terms-checkbox far fa-square"
              id="onboarding__terms-checkbox"
              readOnly=""
              data-testid="onboarding-terms-checkbox"
              type="checkbox"
              style={{
                width: 20,
                height: 20,
                marginRight: 10,
                fontWeight: 400,
                cursor: "pointer",
              }}
              checked={!checkAgree}
              onChange={() => setCheckAgree(!checkAgree)}
            />
            <label
              className="onboarding__terms-label"
              htmlFor="onboarding__terms-checkbox"
            >
              <span className="box mm-text mm-text--body-md box--margin-left-2 box--flex-direction-row box--color-text-default">
                <span>
                  I agree to Prominer'{"  "}
                  <a
                    className="create-new-vault__terms-link"
                    href="https://metamask.io/terms.html"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Terms of use
                  </a>
                </span>
              </span>
            </label>
          </div>
          <div className="my-3" style={{ padding: "0 40px" }}>
            <div>
              <button
                disabled={checkAgree}
                className="btn btn-primary btn-create-wallet btn-custom"
                onClick={() => navigate("/help-us-improve")}
              >
                Create a new wallet
              </button>
            </div>
            <div>
              <button
                disabled={checkAgree}
                className="btn btn-outline-primary btn-import-wallet btn-custom"
                onClick={() => navigate("/import-wallet")}
              >
                Import an existing wallet
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
