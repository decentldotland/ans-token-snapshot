import { ethers } from "ethers";
import dotenv from "dotenv";
import Everpay from "everpay";
import { ANS_TOKEN_EP_TAG } from "./constants.js";
import { getRewards } from "./exm.js";
dotenv.config();

export async function distributeRewards() {
  try {
    const provider = new ethers.providers.JsonRpcProvider(
      "https://eth.llamarpc.com"
    );
    const signer = new ethers.Wallet(process.env.ANS_WALLET_PK, provider);
    const everpay = new Everpay.default({
      account: "0x14825447060fC05826226d8695f690fdC795960D",
      chainType: "ethereum",
      ethConnectedSigner: signer,
    });
    const eligibleUsers = await getRewards();

    for (const user of eligibleUsers) {
      const tx = await everpay.transfer({
        tag: ANS_TOKEN_EP_TAG,
        amount: user.ans_balance.toFixed(6),
        to: user.address,
        data: {
          ans_airdrop_user: user.address,
          ans_amount: user.ans_balance.toFixed(6),
        },
      });

      console.log(tx);
      console.log(`\ndistributed rewards for ${user.address}\n\n\n`);
    }
  } catch (error) {
    console.log(error);
  }
}
