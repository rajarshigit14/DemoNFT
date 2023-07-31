require("dotenv").config();
const API_URL = process.env.API_URL;

const PUBLIC_KEY = process.env.PUBLIC_KEY;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const web3 = createAlchemyWeb3(API_URL);
const contract = require("../artifacts/contracts/MyNFT.sol/MyNFT.json");

//console.log(JSON.stringify(contract.abi));

const contractAddress = "0x618c725E966Ff4c7C7474b18793d3bb7C4F382C4";
const nftContract = new web3.eth.Contract(contract.abi,contractAddress);

//TRANSACTION

async function mintNFT(tokenURI){
    const nonce = await web3.eth.getTransactionCount(PUBLIC_KEY,"latest");//create transaction

    const tx={
        'from':PUBLIC_KEY,
        'to': contractAddress,
        'nonce': nonce,
        'gas': 500000,
        'data':nftContract.methods.mintNFT(PUBLIC_KEY,tokenURI).encodeABI(),
    };
    
    const signPromise = web3.eth.accounts.signTransaction(tx, PRIVATE_KEY);
    signPromise.then((signedTx) => {
      web3.eth.sendSignedTransaction(
        signedTx.rawTransaction,
        function (err, hash) {
          if (!err) {
            console.log("The hash of your transaction is: ",hash,"\nCheck Alchemy's Mempool to view the status of your transaction!");
          } 
          else {
            console.log(
              "Something went wrong when submitting your transaction:",err);
          }
        }
      );
    })
    .catch((err) => {
      console.log(" Promise failed:", err);
    });
}
mintNFT("https://gateway.pinata.cloud/ipfs/QmXAB4xCwvmCuZ4miGCAgSDGPVj7ufkVYeLDHSMemarfCV")

//hash of transaction:0xcb7787401f5fcb642f28deba2263f3884a98b922cada1a6c2d65b43fcb038b75 