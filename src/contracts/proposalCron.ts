const Web3 = require('web3');
import { PHNX_PROPOSAL_ABI } from './contracts';
import { Block } from '../proposal/proposal.model';

let web3 = new Web3(
  'https://rinkeby.infura.io/v3/c89f216154d84b83bb9344a7d0a91108',
);
const contract_abi = PHNX_PROPOSAL_ABI;
let contract = new web3.eth.Contract(
  contract_abi,
  '0x5579fBfD5417758Bf276276aFb597b7C6b30786E',
);

export async function getEvents() {
  const result = await this.Block.find();
  contract.getPastEvents(
    'ProposalSubmitted',
    {
      fromBlock: result[0].blockNumber,
      toBlock: 'latest',
    },
    async (err, events) => {
      for (let i = 0; i < events.length; i++) {
        let proposalId = events[i].returnValues[0];
        // await this.BlockService.findOneAndUpdate(
        //   { _id: '60278e16ce40995008177788' },
        //   { $inc: { proposalBlock: 1 } },
        // );
        await this.proposalModel.findByIdAndUpdate(
          proposalId,
          {
            $set: { status: 'Pending' },
          },
          { runValidators: true, new: true },
        );
      }
      let newBlock = events[events.length - 1].blockNumber + 1;

      const result2 = await this.Block.findByIdAndUpdate(result[0]._id, {
        proposalBlock: newBlock,
      });
    },
  );
}
