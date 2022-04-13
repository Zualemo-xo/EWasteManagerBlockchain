var LoginContract = artifacts.require("./LoginContract.sol");
var UserContract = artifacts.require("./UserContract.sol");
var CenterContract = artifacts.require("./CenterContract.sol");
var AnalystContract = artifacts.require("./AnalystContract.sol");
var CompanyContract = artifacts.require("./CompanyContract.sol");
var SellingContract = artifacts.require("./SellingContract.sol");
var SellingDismantlingBuying = artifacts.require("./SellingDismantlingBuying.sol");

module.exports = function(deployer) {
  deployer.deploy(LoginContract);
  deployer.deploy(UserContract);
  deployer.deploy(CenterContract);
  deployer.deploy(CompanyContract);
  deployer.deploy(AnalystContract);
  deployer.deploy(SellingContract);
  deployer.deploy(SellingDismantlingBuying);
};
