/* eslint-disable @typescript-eslint/no-var-requires */

const Web3=require('web3');
const axios=require('axios')

const OPTIONS = {
  // defaultBlock: "latest",
  transactionConfirmationBlocks: 1,
  transactionBlockTimeout: 5,
};
const web3 = new Web3(
  'https://rinkeby.infura.io/v3/e3c9ab0b78e946b486fa9c7b5f26c3c1',
  null,
  OPTIONS,
);

export class BlockChainFunctions{
  // constructor( ) {
        
  //   }
    getTxHash = async () => {
      try {
        const txNonce = await web3.eth.getTransactionCount(
          '0x231DCab22B8E1BC8c3CA604731880F3B49E70371',
          'pending',
        );
        const gasPrices = await this.getCurrentGasPrices();
        const transaction = {
          to: '0x231DCab22B8E1BC8c3CA604731880F3B49E70371',
          from: '0x231DCab22B8E1BC8c3CA604731880F3B49E70371',
          gasLimit: web3.utils.toHex(70000),
          gasPrice: web3.utils.toHex(gasPrices.high * 1000000000),
          nonce: txNonce,
          value: 0,
          chainId: 4, //EIP 155 chainId - mainnet: 1, rinkeby: 4
        };
        // Send the transaction
        const signed = await web3.eth.accounts.signTransaction(
          transaction,
          process.env.private_key,
        );
        const tx = await web3.eth
          .sendSignedTransaction(signed.rawTransaction)
          .on('confirmation', (confirmationNumber, receipt) => {
            if (confirmationNumber === 1) {
              console.log("RECIPIENT IS =====> ",receipt);
            }
          });
        return tx.transactionHash;
      } catch (error) {
        console.log('Error in getTxHash || receiving error in this ====>  ', error);
        return false;
      }
    };

    getCurrentGasPrices = async () => {
      try {
        const response = await axios.get(
          'https://ethgasstation.info/json/ethgasAPI.json',
        );
        const prices = {
          low: response.data.safeLow / 10,
          medium: response.data.average / 10,
          high: response.data.fast / 10,
        };
        return prices;
      } catch (error) {
        console.log("Error in getGurrentGasPrices ===> ",error);
      }
    };
    
}

