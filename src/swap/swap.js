import React, { useState, useEffect } from "react";
import "./swap.css";
import logo from "./logo.gif";
import background from "./background.png";
import header from "./header.png";
import { contractAddress, abi, tokenAddres, tokenAbi } from "../utils/constant";
import Web3 from "web3";

function Swap() {
  let accountAd;
  const [account, setAccount] = useState("Connect Wallet");
  const [balance, setBalance] = useState(0);
  const [balanceTwo, setBalanceTwo] = useState(0);
  const [enterAmount, setEnterAmount] = useState(null);
  const [tokenAmount, setTokenAmount] = useState();
  const [actualAccount, setActualAccount] = useState(null);

  let accounts;

  const getAccounts = async () => {
    const web3 = window.web3;
    try {
      accounts = await web3.eth.getAccounts();
      console.log(accounts);
      return accounts;
    } catch (error) {
      console.log("Error while fetching acounts: ", error);
      return null;
    }
  };

  const loadWeb3 = async () => {
    let isConnected = false;
    try {
      if (window.ethereum) {
        window.web3 = new Web3(window.ethereum);
        await window.ethereum.enable();
        isConnected = true;
      } else if (window.web3) {
        window.web3 = new Web3(window.web3.currentProvider);
        isConnected = true;
      } else {
        isConnected = false;
      }
      if (isConnected === true) {
        let accounts = await getAccounts();
        accountAd = accounts[0];
        let blance1 = await window.web3.eth.getBalance(accounts[0]);
        let convertedBalanc = await window.web3.utils.fromWei(blance1);
        let fourPoint = parseFloat(convertedBalanc).toFixed(4);
        setBalance(fourPoint);
        window.ethereum.on("accountsChanged", function (accounts) {});
        accountAd = accounts[0];
        setActualAccount(accountAd);
        let acc =
          accountAd.substring(0, 4) +
          "..." +
          accountAd.substring(accountAd.length - 4);
        setAccount(acc);
        await balanceOf();
      }
    } catch (error) {
      console.log("Error while connecting metamask", error);
    }
  };

  const enterAmountCall = async (e) => {
    try {
      setEnterAmount(e.target.value);
      const web3 = window.web3;
      try {
        let contract = new web3.eth.Contract(abi, contractAddress);

        if (e.target.value) {
          let amount = await contract.methods
            .getTokens(await web3.utils.toWei(e.target.value))
            .call();
          let convertedBalanc = amount / 10 ** 9;
          setTokenAmount(convertedBalanc);
        } else {
          setTokenAmount(0);
        }
      } catch (error) {
        console.log("Error while fetching acounts: ", error);
      }
    } catch (error) {
      console.log("Error while checking locked account", error);
    }
  };

  const maxClc = async (e) => {
    try {
      if (balance >= 3) {
        setEnterAmount(3);
      } else if (balance > 0.01) {
        setEnterAmount(balance);
        const web3 = window.web3;
        try {
          let contract = new web3.eth.Contract(abi, contractAddress);
          let amount = await contract.methods
            .getTokens(await web3.utils.toWei(balance))
            .call();
          let convertedBalanc = await window.web3.utils.fromWei(amount);
          setTokenAmount(convertedBalanc);
        } catch (error) {
          console.log("Error while fetching acounts: ", error);
        }
      } else {
        alert("Balance is not sufficient");
      }
    } catch (error) {
      console.log("Error while checking locked account", error);
    }
  };

  const swapTokens = async () => {
    const web3 = window.web3;
    try {
      let contract = new web3.eth.Contract(abi, contractAddress);
      if (enterAmount >= 0.01 && enterAmount <= 3) {
        await contract.methods
          .swapTokens()
          .send({
            from: actualAccount, // The
            value: web3.utils.toWei(enterAmount),
          })
          .then(async (output) => {
            console.log("Transaction Completed");
          })
          .catch((e) => {
            console.log("response", e);
          });
      } else {
        alert("Minimum 0.01 BNB and Maximum 3 BNB");
      }
    } catch (error) {
      console.log("Error while fetching acounts: ", error);
    }
  };

  const balanceOf = async () => {
    const web3 = window.web3;
    try {
      let accounts = await getAccounts();
      let tokenContract = new web3.eth.Contract(tokenAbi, tokenAddres);
      let blance2 = await tokenContract.methods.balanceOf(accounts[0]).call();
      let convertedBalanc = blance2 / 10 ** 9;
      setBalanceTwo(convertedBalanc);
    } catch (error) {
      console.log("Error while fetching acounts: ", error);
    }
  };

  const addtoMetaMask = async () => {
    const tokenAddress = "0x6f0f83cb5487cc237a1f668f09e7a2f073afc8ca";
    const tokenSymbol = "FastTrk";
    const tokenDecimals = 9;
    // const tokenImage = 'http://placekitten.com/200/300';

    try {
      // wasAdded is a boolean. Like any RPC method, an error may be thrown.
      const wasAdded = window.ethereum.request({
        method: "wallet_watchAsset",
        params: {
          type: "ERC20", // Initially only supports ERC20, but eventually more!
          options: {
            address: tokenAddress, // The address that the token is at.
            symbol: tokenSymbol, // A ticker symbol or shorthand, up to 5 chars.
            decimals: tokenDecimals, // The number of decimals in the token
            // image: tokenImage, // A string url of the token logo
          },
        },
      });

      if (wasAdded) {
        console.log("Thanks for your interest!");
      } else {
        console.log("Your loss!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    setInterval(() => {
      loadWeb3();
    }, 1000);
  });

  return (
    <div className="container-fluid">
      <div className="Header">
        <div className="container">
          <div className="row pt-3">
            <div className="col-md  headerimg">
              <div className="col-md-8 col-sm-4 headerimg1">
                <img src={logo} width="250px" alt="logo" />
                <h1 className="h1">Pre-Sale is Now Live!</h1>
              </div>
              <div>
                <button className="btn btn-warning fw-bold" onClick={loadWeb3}>
                  {account}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="headerbar">
        <div className="container1">
          <div className="headerbar2">
            <div>
              <img
                src={background}
                className="img-responsive"
                alt="background"
              />
            </div>
            <div>
              <div className="card p-3 rounded-3">
                <div className="title">
                  <h5>Exchange Tokens</h5>
                  <p>Minimum 0.01 BNB and Maximum 3 BNB</p>
                </div>
                <div className="input-field">
                  <div className="flex navbar">
                    <small>From</small>
                    <div>
                      <small>Balance: </small>
                      <small>{balance}</small>
                    </div>
                  </div>
                  <div className="nputdv">
                    <input
                      min="0"
                      id="floatingInput"
                      placeholder="Enter amount"
                      onChange={enterAmountCall}
                      value={enterAmount}
                    />
                    <div>
                      <button
                        className="max-button text-warning fw-bold"
                        onClick={maxClc}
                      >
                        MAX
                      </button>
                      <span>BNB</span>
                    </div>
                  </div>
                </div>

                <div className="input-field mt-3">
                  <div className="flex navbar">
                    <small>To</small>
                    <div>
                      <small>Balance: </small>
                      <small>{balanceTwo}</small>
                    </div>
                  </div>
                  <div className="nputdv">
                    <input
                      min="0"
                      id="floatingInput"
                      placeholder=""
                      onChange={enterAmountCall}
                      value={tokenAmount}
                      disabled="disabled"
                    />
                    <div>
                      <span>FastTrk</span>
                    </div>
                  </div>
                </div>
                <button
                  href="#"
                  className="btn btn-warning my-3 py-3 text-dark fw-bold"
                  onClick={swapTokens}
                >
                  Swap
                </button>
                <button
                  href="#"
                  className="btn btn-warning my-3 py-3 text-dark fw-bold"
                  onClick={addtoMetaMask}
                >
                  Add to Metamask
                </button>
              </div>
            </div>
            <img src={header} className="img-header" alt="header" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Swap;
