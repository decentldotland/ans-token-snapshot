import axios from "axios";
import { TESTNET_AIRDROP_LIST } from "./constants.js";

export async function getTestnetDomains() {
  try {
    console.log(
      TESTNET_AIRDROP_LIST.map((domain) => domain.username.split(".ar"))
        .flat()
        .filter((domain) => domain.length)
    );
    return TESTNET_AIRDROP_LIST.map((domain) => domain.username.split(".ar"))
      .flat()
      .filter((domain) => domain.length);
  } catch (error) {
    console.log(error);
    return [];
  }
}
