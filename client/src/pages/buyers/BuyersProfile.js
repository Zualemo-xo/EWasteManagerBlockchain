import React from "react";
import Navbar from "./Navbar/Navbar";
import "./BuyersProfile.css";

import getWeb3 from "../../getWeb3";
import CompanyContract from "../../contracts/CompanyContract.json";

let web3 = null;

class Profile extends React.Component {

  state = {
    web3: null, accounts: null, loading: false, buffer: null, tableData: null,
    storedsize: 0, fileuploaded:0,fileshared:0
  };

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

      this.setState({ web3, accounts, storagecontract: instance });

      let currentComponent = this;
      //Get uploaded files
      instance.methods.getFiles(accounts[0]).call()
        .then(function (response) {
          if (response.length !== 0) {

            var storesize=0,filenos=0,fileshare=0;
            for (var i = 0; i < response.length; i++) {

              console.log(response[i])
              filenos+=1;
              storesize+=parseInt(response[i]['filesize']);
              if(response[i]['shared']===true)
                fileshare+=1;
            }
            storesize=Number(storesize/1024).toFixed(2);
            currentComponent.setState({ storedsize: storesize, fileuploaded: filenos, fileshared: fileshare })
          }
        })

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
    alert(metamaskAddr)
    const contract = this.state.storagecontract;

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

    const contract2 = this.state.logincontract;
    const response = await contract2.methods.getUser(metamaskAddr).call();

    if (response['username'] === "" ||
      response['email'] === "") {
      window.alert("User does not exist. Please sign up");
      return;
    }

    const username = response['username'];
    const email = response['email'];

    console.log(username, email);
    alert(username)

    // let currentComponent = this;
    // //Get uploaded files
    // contract.methods.getFiles(metamaskAddr).call()
    //   .then(function (response) {
    //     if (response.length !== 0) {

    //       var storesize=0,filenos=0,fileshare=0;
    //       for (var i = 0; i < response.length; i++) {

    //         console.log(response[i])
    //         filenos+=1;
    //         storesize+=parseInt(response[i]['filesize']);
    //         if(response[i]['shared']===true)
    //           fileshare+=1;
    //       }
    //       storesize=Number(storesize/1024).toFixed(2);
    //       alert(storesize);
    //     }
    //   })

  }

  render() {
    return (
      <div>
        <Navbar />
        <div class="left">
          <div class="dcontainer">
            <div class="cover-photo">
              <img src="https://cdn.pixabay.com/photo/2019/08/11/18/59/icon-4399701_1280.png" class="profile" />
            </div>
            <div class="profile-name">{localStorage.getItem('UserName')}</div>

            <p class="about">
              Email: <br />{localStorage.getItem('Email')}<br /><br />
              Address: <br />{localStorage.getItem('MetamaskAddr')}
            </p>

          </div>
        </div>

        
      </div>
    );
  }
}

export default Profile;