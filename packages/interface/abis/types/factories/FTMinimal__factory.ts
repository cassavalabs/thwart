/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Signer, utils } from "ethers";
import type { Provider } from "@ethersproject/providers";
import type { FTMinimal, FTMinimalInterface } from "../FTMinimal";

const _abi = [
  {
    constant: false,
    inputs: [
      {
        name: "_spender",
        type: "address",
      },
      {
        name: "_value",
        type: "uint256",
      },
    ],
    name: "approve",
    outputs: [
      {
        name: "",
        type: "bool",
      },
    ],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        name: "spender",
        type: "address",
      },
      {
        indexed: false,
        name: "value",
        type: "uint256",
      },
    ],
    name: "Approval",
    type: "event",
  },
] as const;

export class FTMinimal__factory {
  static readonly abi = _abi;
  static createInterface(): FTMinimalInterface {
    return new utils.Interface(_abi) as FTMinimalInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): FTMinimal {
    return new Contract(address, _abi, signerOrProvider) as FTMinimal;
  }
}
