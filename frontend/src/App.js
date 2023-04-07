import "./App.css";
import { PeraWalletConnect } from "@perawallet/connect";
import algosdk, { waitForConfirmation } from "algosdk";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { useEffect, useState } from "react";

//const crypto = require("crypto");



const peraWallet = new PeraWalletConnect();

// The app ID on testnet
// RPS app
const appIndex = 176071044;
const appAddress = "OZVJEJXKARVL4CODXDXIKEWWGB6XCC7KK3CCBBC2UJ672RJOSXBT2CLDOM";

// connect to the algorand node
// token, address(server), port
const algod = new algosdk.Algodv2(
  "",
  "https://testnet-api.algonode.cloud",
  443
);

function App() {
  const [accountAddress, setAccountAddress] = useState(null);
  const [owner, setOwner] = useState(null);
  const [realhand, setRealHand] = useState(null);
  const [realsum, setRealSum] = useState(null);
  const [hashedhand, setHashedHand] = useState(null);
  const [hashedsum, setHashedSum] = useState(null);
  const isConnectedToPeraWallet = !!accountAddress; //convert string to boolean

  useEffect(() => {
    // Reconnect to the session when the component is mounted
    peraWallet
      .reconnectSession()
      .then((accounts) => {
        peraWallet.connector.on("disconnect", handleDisconnectWalletClick);
        console.log(accounts);
        if (accounts.length) {
          setAccountAddress(accounts[0]);
        }
      })
      .catch((e) => console.log(e));
  }, []);

  return (
    <Container>
      <meta name="name" content="Testing frontend for PyTeal" />
      <h1> Test frontend for PyTeal</h1>
      <Row>
        <Col>
          <Button
            onClick={
              isConnectedToPeraWallet
                ? handleDisconnectWalletClick
                : handleConnectWalletClick
            }
          >
            {isConnectedToPeraWallet ? "Disconnect" : "Connect to Pera Wallet"}
          </Button>
        </Col>
      </Row>
      <br />
      <Row>
        <Col>
          <Button onClick={() => optInRpsApp()}>OptIn</Button>
        </Col>
      </Row>
      <br />
      <Row>
        <Col>
          <Button onClick={() => setOwner(true)}>Start Game</Button>
        </Col>
        <Col>
          <Button onClick={() => setOwner(false)}>Join Game</Button>
        </Col>
        <Col>
          <Button onClick={() => resolveRpsApplication()}>Resolve Game</Button>
        </Col>
      </Row>
      <br />
      <Row>
        <Col>
        <h4> Choose number of your fingers:</h4>
          <Button
           onClick={
            !!owner === true

            ? () =>{
            
              setHashedHand("a4ayc/80/OGda4BO/1o/V0etpOqiLx1JwB5S3beHW0s=");
              setRealHand(1);
            
          }
          : () => setRealHand(1)
        }
           >
            1
          </Button>
        
        
        <br />
        <br />
        
        
          <Button
            onClick={
              !!owner === true
              ? () =>{
            
                setHashedHand("1HNeOiZeFu7gP1lxi5tdAwGcB9i2xR+Q2jpmbuwTqzU=");
                setRealHand(2);
              
            }
            : () => setRealHand(2)
            }
          >
            2
          </Button>
        
          
          <br />
          <br />
          
          <Button
            onClick={
              !!owner === true
              ? () =>{
            
                setHashedHand("TgdAhWK+24tgzgXB3s/jrRa3IjCWfeAfZAt+Rym0n84=");
                setRealHand(3);
              
            }
            : () => setRealHand(3)
            }
          >
            3
          </Button>
        
        <br />
        <br />
        
          <Button
            onClick={
              !!owner === true
              ? () =>{
            
                setHashedHand("SyJ3d9TdH8Ycb4hPSGQdArTRIdP9Moywi1Ux/Kzav4o=");
                setRealHand(4);
              
            }
            : () => setRealHand(4)
            }
          >
            4
          </Button>
        
        <br />
        <br />
        
          <Button
            onClick={
              !!owner === true
              ? () =>{
            
                setHashedHand("7y0SfeN7lCuq0GFF5UsMYZofIjJ7LrvPvsePVWSv450=");
                setRealHand(5);
              
            }
            : () => setRealHand(5)
            }
          >
            5
          </Button>
        
        <br />
        
        </Col>

        <Col>
        <h4> Choose number of your sum:</h4>
          <Button
            onClick={
              !!owner === true
                ? () =>
                    startRpsApplication(
                      "1HNeOiZeFu7gP1lxi5tdAwGcB9i2xR+Q2jpmbuwTqzU=",
                      2,
                     
                    )
                : () => joinRpsApplication(2)
            }
          >
            2
          </Button>
          <br />
        <br />
        
        
          <Button
            onClick={
              !!owner === true
              ? () =>
              startRpsApplication(
                "TgdAhWK+24tgzgXB3s/jrRa3IjCWfeAfZAt+Rym0n84=",
                3,
               
              )
          : () => joinRpsApplication(3)
            }
          >
            3
          </Button>
        
          
          <br />
          <br />
          
          <Button
            onClick={
              !!owner === true
              ? () =>
              startRpsApplication(
                "SyJ3d9TdH8Ycb4hPSGQdArTRIdP9Moywi1Ux/Kzav4o=",
                4,
               
              )
          : () => joinRpsApplication(4)
            }
          >
            4
          </Button>
        
        <br />
        <br />
        
          <Button
            onClick={
              !!owner === true
              ? () =>
              startRpsApplication(
                "7y0SfeN7lCuq0GFF5UsMYZofIjJ7LrvPvsePVWSv450=",
                5,
               
              )
          : () => joinRpsApplication(5)
            }
          >
            5
          </Button>
        
        <br />
        <br />
        
          <Button
            onClick={
              !!owner === true
              ? () =>
              startRpsApplication(
                "5/bAEXdujbfNMwtUF0/Xb30CFrYSOHpf/PuB5vCRloM=",
                6,
               
              )
          : () => joinRpsApplication(6)
            }
          >
            6
          </Button>
        
        <br />
        <br />
  
 
          <Button
            onClick={
              !!owner === true
              ? () =>
              startRpsApplication(
                "eQJpm+Qsio5G+7tFAXJlF+hrIsVqGJ92JabaSQgbJFE=",
                7,
               
              )
          : () => joinRpsApplication(7)
            }
          >
            7
          </Button>
        
          
          <br />
          <br />
          
          <Button
            onClick={
              !!owner === true
              ? () =>
              startRpsApplication(
                "LGJCMs3SIXcSlN+7MQrKAAoN9qyLZraW2Q7wb977ZKM=",
                8,
               
              )
          : () => joinRpsApplication(8)
            }
          >
            8
          </Button>
        
        <br />
        <br />
        
          <Button
            onClick={
              !!owner === true
              ? () =>
              startRpsApplication(
                "GVgeJ9587QD/HOULIEfnpWfHaxy666vl7wP3wwF7tbc=",
                9,
               
              )
          : () => joinRpsApplication(9)
            }
          >
            9
          </Button>
        
        <br />
        <br />
        
          <Button
            onClick={
              !!owner === true
              ? () =>
              startRpsApplication(
                "SkTcFTZCBKgP6A6QOUVcwWCCgYIP4rJPHlIzreavHdU=",
                10,
               
              )
          : () => joinRpsApplication(10)
            }
          >
            10
          </Button>
        
        <br />
        <br />

        </Col>
    
        </Row>
    </Container>
  );

  function handleConnectWalletClick() {
    peraWallet
      .connect()
      .then((newAccounts) => {
        peraWallet.connector.on("disconnect", handleDisconnectWalletClick);
        setAccountAddress(newAccounts[0]);
      })
      .catch((error) => {
        if (error?.data?.type !== "CONNECT_MODAL_CLOSED") {
          console.log(error);
        }
      });
  }

  function handleDisconnectWalletClick() {
    peraWallet.disconnect();
    setAccountAddress(null);
  }

  async function optInRpsApp() {
    try {
      // get suggested params
      const suggestedParams = await algod.getTransactionParams().do();

      const actionTx = algosdk.makeApplicationOptInTxn(
        accountAddress,
        suggestedParams,
        appIndex
      );

      const actionTxGroup = [{ txn: actionTx, signers: [accountAddress] }];

      const signedTx = await peraWallet.signTransaction([actionTxGroup]);
      console.log(signedTx);
      const { txId } = await algod.sendRawTransaction(signedTx).do();
      const result = await waitForConfirmation(algod, txId, 2);
    } catch (e) {
      console.error(`There was an error calling the rps app: ${e}`);
    }
  }

 

  async function startRpsApplication(

    hashedsum="1HNeOiZeFu7gP1lxi5tdAwGcB9i2xR+Q2jpmbuwTqzU=",
    sum="2"
  ) {
    try {
      
      setRealSum(sum);
      // get suggested params
      const suggestedParams = await algod.getTransactionParams().do();
      const appArgs = [
        new Uint8Array(Buffer.from("start")),
        new Uint8Array(Buffer.from(hashedhand, "base64")),
        new Uint8Array(Buffer.from(hashedsum, "base64"))
      ];

      const accounts = [
        "2NZW55ALJPUDJXYB3HVO4HOSIB4YYBOMZP5FI2NENA6OLQD22WK23SYZ34",
      ];

      let actionTx = algosdk.makeApplicationNoOpTxn(
        accountAddress,
        suggestedParams,
        appIndex,
        appArgs,
        accounts
      );

      let payTx = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
        from: accountAddress,
        to: appAddress,
        amount: 100000,
        suggestedParams: suggestedParams,
      });

      let txns = [actionTx, payTx];
      algosdk.assignGroupID(txns);

      const actionTxGroup = [
        { txn: actionTx, signers: [accountAddress] },
        { txn: payTx, signers: [accountAddress] },
      ];

      const signedTxns = await peraWallet.signTransaction([actionTxGroup]);

      console.log(signedTxns);
      const { txId } = await algod.sendRawTransaction(signedTxns).do();
      const result = await waitForConfirmation(algod, txId, 4);
      // checkCounterState();
    } catch (e) {
      console.error(`There was an error calling the rps app: ${e}`);
    }
  }

  //prosledjujemo sad dva parametra za igraca dva prava ruka i prava suma
  async function joinRpsApplication(sum) {
    try {
      const prvi = new Uint8Array(1);
      prvi[0] = realhand;
      const drugi = new Uint8Array(1);
      drugi[0] = sum;
      // get suggested params
      const suggestedParams = await algod.getTransactionParams().do();
      const appArgs = [
        new Uint8Array(Buffer.from("accept")),
        prvi,
        drugi
        //dodale sumu
      ];

      //ovo nam je sada prvi igrac akaunt 1.
      const accounts = [
        "NMYTHRR3XTG3ZANUUPM35P3BJ35OZVLDYGFYM57K55X3XZTGPEWZ2EP24U",
      ];

      let actionTx = algosdk.makeApplicationNoOpTxn(
        accountAddress,
        suggestedParams,
        appIndex,
        appArgs,
        accounts
      );

      let payTx = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
        from: accountAddress,
        to: appAddress,
        amount: 100000,
        suggestedParams: suggestedParams,
      });

      let txns = [actionTx, payTx];
      algosdk.assignGroupID(txns);

      const actionTxGroup = [
        { txn: actionTx, signers: [accountAddress] },
        { txn: payTx, signers: [accountAddress] },
      ];

      const signedTxns = await peraWallet.signTransaction([actionTxGroup]);

      console.log(signedTxns);
      const { txId } = await algod.sendRawTransaction(signedTxns).do();
      const result = await waitForConfirmation(algod, txId, 4);
      // checkCounterState();
    } catch (e) {
      console.error(`There was an error calling the rps app: ${e}`);
    }
  }

  // RESOLVE RPS WINNER
  async function resolveRpsApplication() {
    try {

      console.log(realhand);
      console.log(realsum);
      
      // get suggested params
      const suggestedParams = await algod.getTransactionParams().do();
      const appArgs = [
        new Uint8Array(Buffer.from("resolve")),
        new Uint8Array(Buffer.from(realhand.toString())),
        new Uint8Array(Buffer.from(realsum.toString()))
        
        //dodale smo real sum za prvog igraca

      ];

      //ovde je protivnik 2.igrac
      const accounts = [
        "2NZW55ALJPUDJXYB3HVO4HOSIB4YYBOMZP5FI2NENA6OLQD22WK23SYZ34",
      ];

      let actionTx = algosdk.makeApplicationNoOpTxn(
        accountAddress,
        suggestedParams,
        appIndex,
        appArgs,
        accounts
      );

      const actionTxGroup = [{ txn: actionTx, signers: [accountAddress] }];

      const signedTxns = await peraWallet.signTransaction([actionTxGroup]);
      const txns = [signedTxns];

      console.log(signedTxns);

      //const dr = algosdk.createDryrun(algod, txns);

      //test debugging
      //const dryRunResult = await algod.dryrun(dr).do();
      //console.log(dryRunResult);

      const { txId } = await algod.sendRawTransaction(signedTxns).do();
      const result = await waitForConfirmation(algod, txId, 4);
      console.log(result);
    } catch (e) {
      console.error(`There was an error calling the rps app: ${e}`);
    }
  }

  // Clear state
  // {
  //   "txn": {
  //     "apan": 3,
  //     "apid": 51,
  //     "fee": 1000,
  //     "fv": 13231,
  //     "gh": "ALXYc8IX90hlq7olIdloOUZjWfbnA3Ix1N5vLn81zI8=",
  //     "lv": 14231,
  //     "note": "U93ZQy24zJ0=",
  //     "snd": "LNTMAFSF43V7RQ7FBBRAWPXYZPVEBGKPNUELHHRFMCAWSARPFUYD2A623I",
  //     "type": "appl"
  //   }
  // }
}

export default App;