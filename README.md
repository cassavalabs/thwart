# Thwart Protocol

![dApp usage screenshot](docs/ui.PNG)

## Use Cases

When users interact with decentralized applications (dApps) like Forge, EvmoSwap, Li.finance, Orbit market, Tofu NFT and the rest, they may be required to grant them permission to spend their tokens and NFTs.

According to the ERC20 and ERC721 standards these are called allowance and approvals respectively. The EVMOS blockchain also recently introduced a new stateful precompile which introduces a new form of allowance called authorization and generic authorization.

If users fail to revoke this authorizations, allowances or approvals, the dApp or spender can continue to spend their tokens even when they no longer interact with the dApp. To help users revoke these authorizations, allowances, and approvals, the Thwart protocol was created.

The Thwart protocol presents an intuitive user interface to view all token approvals and authorizations granted to dApps or accounts on the EVMOS blockchain and offers an easy approach to revoke them. To use Thwart protocol, users will need to connect their wallet to the app. Once their wallet is connected, they can view all of the allowances and approvals that have been granted to their account. They can then revoke any allowances or approvals that they no longer want to be active.

Revoking allowances and approvals is an important security measure. By revoking these permissions, users can help to protect their assets from being stolen. If users are concerned about the security of their assets, they should revoke any allowances and approvals that they no longer need.

To revoke an approval on EVMOS blockchain using Thwart protocol, users will need to follow these steps:

- Go to the Thwart protocol website.
- Click on the "Connect Wallet" button.
- Select your wallet from the list of supported wallets.
- Once your wallet is connected, you will be able to see all of the authorizations, allowances and approvals that have been granted by your account.
- To revoke an allowance or approval, click on the "Revoke" button next to the authorization, allowance or approval that you want to revoke.
- Confirm the transaction in your wallet.

Once users have revoked an authorization, allowance or approval, the dApp or spender will no longer be able to spend their tokens.

## How We Built It

We have developed a custom backend using NestJS that enables us to retrieve all events relevant to the topics of our interest. These events are then filtered and stored in a MongoDB database. Subsequently, we serve this data through a straightforward HTTP API.

Initially, we considered utilizing Subquery for our backend implementation. However, we encountered performance issues with Subquery as it was not efficient in utilizing public RPC nodes. The process of fetching transactions and logs starting from the genesis block proved to be slow and lacked gracefulness. Consequently, we opted for an alternative approach.

Instead, we leveraged the EVM's `eth_getLogs` RPC endpoint to filter events based on the specific topics we were interested in. We retrieved the logs in batches of 10,000 blocks, gradually reducing the batch size if errors occurred due to an excessive number of results. This method significantly improved efficiency compared to Subquery.

However, this approach presented another challenge: the logs retrieved through `eth_getLogs` did not include the timestamp of the corresponding event block, which we required. To address this issue, we implemented a cron job that periodically scans our database for data rows with null timestamps. The job groups these rows based on unique block numbers, retrieves the corresponding blocks using the `eth_getBlockByNumber` RPC endpoint, and performs a bulk update to add the missing timestamps.

By adopting this approach, we have successfully operated using public node infrastructure for the time being. However, our plan is to transition to utilizing the Subquery indexer in our production environment.

## Experience Developing On EVMOS
Building on the EVMOS blockchain has been an exciting journey. We have encountered numerous opportunities and challenges while developing our project. However, during the testing phase, we realized the importance of having a broader network of public test RPC nodes for a seamless testing experience.

At present, chainlist.org provides a valuable resource for discovering EVM compatible chain configs. However, it appears that only one public RPC testnet is currently available for EVMOS. This limitation poses certain constraints on our testing process.
