import axios from "axios";
import { ANS_CONTRACT_ADDRESS, ANS_MINTING_COST } from "./constants.js";
import { getTestnetDomains } from "./filters.js";

async function getAnsState() {
  try {
    const req = (
      await axios.get(`https://api.exm.dev/read/${ANS_CONTRACT_ADDRESS}`)
    )?.data;
    const openOrders = req.marketplace.filter(
      (order) => order.status === "open"
    );

    for (const order of openOrders) {
      const ownerIndex = req.balances.findIndex(
        (user) => user.address === order.owner
      );
      if (ownerIndex === -1) {
        console.log(ownerIndex);
        console.log(order);
        const user = { address: order.owner };
        user.ownedDomains = [order.object];
        req.balances.push(user);
      } else {
        req.balances[ownerIndex].ownedDomains.push(order.object);
      }
    }
    return req.balances;
  } catch (error) {
    console.log(error);
    return [];
  }
}

export async function getRewards() {
  try {
    const res = [];
    const state = await getAnsState();
    const testnetState = await getTestnetDomains();
    const domains = state.map((user) => ({
      address: user.address,
      domains: user.ownedDomains.map((domain) => domain.domain),
    }));
    for (const user of domains) {
      user.domains = user.domains.filter(
        (domain) => !testnetState.includes(domain)
      );
      user.total_usd_spending = user.domains
        .map((domain) => ANS_MINTING_COST[`l${domain.length}`])
        .reduce((a, b) => a + b, 0);
      user.ans_balance = user.total_usd_spending / 3;

      res.push(user);
    }

    const distribution = res
      .sort((a, b) => b.ans_balance - a.ans_balance)
      .filter((user) => user.ans_balance > 0);
    console.log(JSON.stringify(distribution));
    console.log(
      `total ANS distribution: ${res
        .map((user) => user.ans_balance)
        .reduce((a, b) => a + b)}`
    );
    console.log(
      `holders count: ${
        res
          .sort((a, b) => b.ans_balance - a.ans_balance)
          .filter((user) => user.ans_balance > 0).length
      }`
    );

    return distribution;
  } catch (error) {
    console.log(error);
  }
}

function _includesAny(arr1, arr2) {
  for (const element of arr1) {
    if (arr2.includes(element)) {
      return true;
    }

    return false;
  }
}
