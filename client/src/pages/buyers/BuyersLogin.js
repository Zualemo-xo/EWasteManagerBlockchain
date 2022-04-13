import React, { Component } from 'react';
import { Navigate } from "react-router-dom";
import CompanyContract from "../../contracts/CompanyContract.json";
import getWeb3 from "../../getWeb3";
import "./BuyersLogin.css";

let web3 = null; // Will hold the web3 instance

class Login extends Component {
    state = { web3: null, accounts: null, CompanyContract: null, loading: false, isaddr: "" };

    componentDidMount = async () => {
        try {
            // Get network provider and web3 instance.
            web3 = await getWeb3();
            // // Use web3 to get the user's accounts.
            const accounts = await web3.eth.getAccounts();
            // Get the contract instance.
            const networkId = await web3.eth.net.getId();
            const deployedNetwork = CompanyContract.networks[networkId];
            const instance = new web3.eth.Contract(
                CompanyContract.abi,
                deployedNetwork && deployedNetwork.address,
            );

            this.setState({ web3, accounts, CompanyContract: instance });
        } catch (error) {
            // Catch any errors for any of the above operations.
            alert(
                `Failed to load web3, accounts, or contract. Check console for details.`,
            );
            console.error(error);
        }
    };

    handlesignIn = async () => {
        const metamaskAddr = this.state.accounts[0];
        console.log(metamaskAddr)
        const contract = this.state.CompanyContract;

        //Verify MetaMask account holder
        const nonce = Math.floor(Math.random() * 10000);
        var message = web3.utils.fromUtf8("One-time nonce: " + nonce);
        var acc = await web3.eth.getAccounts()
        var signature = await web3.eth.personal.sign(message, acc[0])

        var hash = web3.utils.fromUtf8("One-time nonce: " + nonce)
        var signing_address = await web3.eth.personal.ecRecover(hash, signature)

        if (signing_address !== metamaskAddr.toLowerCase()) {
            window.alert("Account verification failed. Try again.")
            return;
        }

        const response = await contract.methods.getUserID(metamaskAddr).call();

        console.log(response);

        if (response === "") {
            window.alert("User does not exist. Please sign up");
            return;
        }

        const companyID = response;

        console.log(companyID);

        localStorage.setItem('CompanyID', companyID);

        window.alert("Welcome back!");

        //window.location.reload();
        // window.alert(localStorage.getItem('UserName'));

    }


    handlesignUp = async (event) => {
        event.preventDefault();
        const name = event.target[0].value;
        const email = event.target[1].value;
        const phone = event.target[2].value;
        const Haddr = event.target[3].value;
        const area_code = event.target[4].value;
        const addr = event.target[5].value;
        console.log(name, email, phone, Haddr, addr);

        const metamaskAddr = this.state.accounts[0];

        //Verify MetaMask account holder
        const nonce = Math.floor(Math.random() * 10000);
        var message = web3.utils.fromUtf8("One-time nonce: " + nonce);
        var acc = await web3.eth.getAccounts()
        var signature = await web3.eth.personal.sign(message, acc[0])

        var hash = web3.utils.fromUtf8("One-time nonce: " + nonce)
        var signing_address = await web3.eth.personal.ecRecover(hash, signature)

        if (signing_address !== metamaskAddr.toLowerCase() || metamaskAddr !== addr) {
            window.alert("Account verification failed. Try again.")
            return;
        }

        const contract = this.state.CompanyContract;

        const response = await contract.methods.getUser(metamaskAddr).call();
        console.log(response);
        if (response !== "") {
            window.alert("User already exists. Log in with your MetaMask.");
            return;
        }

        await contract.methods.registerCompany(metamaskAddr, name, email, phone, Haddr, area_code).send({ from: metamaskAddr });

        window.alert("User successfully created");

    }

    render() {
        if (localStorage.getItem('CompanyID')) {
            return <Navigate to="../../buyers/profile" />;
        }
        if (!this.state.web3) {
            return <div>Loading Web3, accounts, and contract...</div>;
        }
        // return <Navigate to="/" />;

        return (
            // <div className="auth-wrapper">
            //   <h1>E-Waste Manager</h1>
            <div className="App">
                <h1 className="user-h1-font">Buyers Login</h1>
                <div className="appAside" />
                <div className="appForm">
                    <div className="pageSwitcher">
                        <div className="formTitle">
                            <div className="formCenter">
                                <div id="button" >
                                    <button type="submit" className="formFieldButton" onClick={this.handlesignIn}>Login with Metamask</button>
                                </div>
                                <div >
                                    <h4 className="h4-auth-or">&nbsp;&nbsp; Or &nbsp;&nbsp;</h4>
                                </div>
                                {/* <h3 className="formFieldLabel">Sign Up</h3> */}
                                <label className="formTitleLink-active">Sign Up</label>
                                <br /><br /><br />
                                <form onSubmit={this.handlesignUp} className="formFields">
                                    <div class="formField" >
                                        <label className="formFieldLabel">Name</label>
                                        <input type="text" className="formFieldInput" placeholder="Enter name" />
                                    </div>

                                    <div class="formField" >
                                        <label className="formFieldLabel">Email Address</label>
                                        <input type="email" className="formFieldInput" placeholder="Enter email" />
                                    </div>

                                    <div class="formField" >
                                        <label className="formFieldLabel">Phone Number</label>
                                        <input type="text" className="formFieldInput" placeholder="Enter phone number" />
                                    </div>

                                    <div class="formField" >
                                        <label className="formFieldLabel">Home Address</label>

                                        <textarea placeholder="Enter home address" className="formFieldInput" rows="4" cols="50" />
                                    </div>

                                    <div class="formField" >
                                        <label className="formFieldLabel">Area Code</label>
                                        <input type="text" className="formFieldInput" placeholder="Enter area code" />
                                    </div>

                                    <div class="formField">
                                        <label className="formFieldLabel">  Metamask Address: </label>

                                        <input type="text" id="addr" className="formFieldInput" value={this.state.accounts[0] ? this.state.accounts[0] : 'Connect to metamask'} disabled />
                                    </div>


                                    {/* <div className="formField">
            <label className="formFieldCheckboxLabel">
              <input
                className="formFieldCheckbox"
                type="checkbox"
                name="hasAgreed"
                value={this.state.hasAgreed}
                onChange={this.handleChange}
              />{" "}
              I agree all statements in{" "}
              <a href="null" className="formFieldTermsLink">
                the Terms Of Service
              </a>
            </label>
          </div> */}


                                    <div id="newbutton" class="row-auth" >
                                        <button type="submit" className="formFieldButton">Submit</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            // </div>

        );
    }
}

export default Login;