import { ethers } from "ethers";
import dotenv from "dotenv";
import Everpay from "everpay";
dotenv.config();

export async function transferEp() {
  try {
    const provider = new ethers.providers.JsonRpcProvider(
      "https://eth.llamarpc.com"
    );
    const signer = new ethers.Wallet(process.env.ANS_WALLET_PK, provider);
    // test only
    const everpay = new Everpay.default({
      account: "0x5a3c46622F0c0A0301Dc436BaFf9AD85D4E896cb",
      chainType: "ethereum",
      ethConnectedSigner: signer,
    });
    const tx = await everpay.transfer({
      tag: "ethereum-ans-0x937efa4a5ff9d65785691b70a1136aaf8ada7e62",
      amount: "0.00001",
      to: "vZY2XY1RD9HIfWi8ift-1_DnHLDadZMWrufSh-_rKF0",
      data: { test: "test snapshot" },
    });

    console.log(tx);
  } catch (error) {
    console.log(error);
  }
}
