import { isAddress } from "@ethersproject/address";

export const shortenAddress = (address: string, chars = 4) => {
  if (!isAddress(address)) {
    throw new Error("Invalid wallet address provided");
  }

  return `${address.substring(0, chars + 2)}...${address.substring(
    address.length - chars
  )}`;
};
