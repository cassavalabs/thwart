/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type {
  BaseContract,
  BigNumber,
  BigNumberish,
  BytesLike,
  CallOverrides,
  ContractTransaction,
  Overrides,
  PopulatedTransaction,
  Signer,
  utils,
} from "ethers";
import type {
  FunctionFragment,
  Result,
  EventFragment,
} from "@ethersproject/abi";
import type { Listener, Provider } from "@ethersproject/providers";
import type {
  TypedEventFilter,
  TypedEvent,
  TypedListener,
  OnEvent,
} from "./common";

export interface AuthorizationInterface extends utils.Interface {
  functions: {
    "allowance(address,address,string)": FunctionFragment;
    "approve(address,uint256,string[])": FunctionFragment;
    "decreaseAllowance(address,uint256,string[])": FunctionFragment;
    "increaseAllowance(address,uint256,string[])": FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic:
      | "allowance"
      | "approve"
      | "decreaseAllowance"
      | "increaseAllowance"
  ): FunctionFragment;

  encodeFunctionData(
    functionFragment: "allowance",
    values: [string, string, string]
  ): string;
  encodeFunctionData(
    functionFragment: "approve",
    values: [string, BigNumberish, string[]]
  ): string;
  encodeFunctionData(
    functionFragment: "decreaseAllowance",
    values: [string, BigNumberish, string[]]
  ): string;
  encodeFunctionData(
    functionFragment: "increaseAllowance",
    values: [string, BigNumberish, string[]]
  ): string;

  decodeFunctionResult(functionFragment: "allowance", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "approve", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "decreaseAllowance",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "increaseAllowance",
    data: BytesLike
  ): Result;

  events: {
    "AllowanceChange(address,address,string[],uint256[])": EventFragment;
    "Approval(address,address,string[],uint256)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "AllowanceChange"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "Approval"): EventFragment;
}

export interface AllowanceChangeEventObject {
  owner: string;
  spender: string;
  methods: string[];
  values: BigNumber[];
}
export type AllowanceChangeEvent = TypedEvent<
  [string, string, string[], BigNumber[]],
  AllowanceChangeEventObject
>;

export type AllowanceChangeEventFilter = TypedEventFilter<AllowanceChangeEvent>;

export interface ApprovalEventObject {
  owner: string;
  spender: string;
  methods: string[];
  value: BigNumber;
}
export type ApprovalEvent = TypedEvent<
  [string, string, string[], BigNumber],
  ApprovalEventObject
>;

export type ApprovalEventFilter = TypedEventFilter<ApprovalEvent>;

export interface Authorization extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: AuthorizationInterface;

  queryFilter<TEvent extends TypedEvent>(
    event: TypedEventFilter<TEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TEvent>>;

  listeners<TEvent extends TypedEvent>(
    eventFilter?: TypedEventFilter<TEvent>
  ): Array<TypedListener<TEvent>>;
  listeners(eventName?: string): Array<Listener>;
  removeAllListeners<TEvent extends TypedEvent>(
    eventFilter: TypedEventFilter<TEvent>
  ): this;
  removeAllListeners(eventName?: string): this;
  off: OnEvent<this>;
  on: OnEvent<this>;
  once: OnEvent<this>;
  removeListener: OnEvent<this>;

  functions: {
    allowance(
      owner: string,
      spender: string,
      method: string,
      overrides?: CallOverrides
    ): Promise<[BigNumber] & { remaining: BigNumber }>;

    approve(
      spender: string,
      amount: BigNumberish,
      methods: string[],
      overrides?: Overrides & { from?: string }
    ): Promise<ContractTransaction>;

    decreaseAllowance(
      spender: string,
      amount: BigNumberish,
      methods: string[],
      overrides?: Overrides & { from?: string }
    ): Promise<ContractTransaction>;

    increaseAllowance(
      spender: string,
      amount: BigNumberish,
      methods: string[],
      overrides?: Overrides & { from?: string }
    ): Promise<ContractTransaction>;
  };

  allowance(
    owner: string,
    spender: string,
    method: string,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  approve(
    spender: string,
    amount: BigNumberish,
    methods: string[],
    overrides?: Overrides & { from?: string }
  ): Promise<ContractTransaction>;

  decreaseAllowance(
    spender: string,
    amount: BigNumberish,
    methods: string[],
    overrides?: Overrides & { from?: string }
  ): Promise<ContractTransaction>;

  increaseAllowance(
    spender: string,
    amount: BigNumberish,
    methods: string[],
    overrides?: Overrides & { from?: string }
  ): Promise<ContractTransaction>;

  callStatic: {
    allowance(
      owner: string,
      spender: string,
      method: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    approve(
      spender: string,
      amount: BigNumberish,
      methods: string[],
      overrides?: CallOverrides
    ): Promise<boolean>;

    decreaseAllowance(
      spender: string,
      amount: BigNumberish,
      methods: string[],
      overrides?: CallOverrides
    ): Promise<boolean>;

    increaseAllowance(
      spender: string,
      amount: BigNumberish,
      methods: string[],
      overrides?: CallOverrides
    ): Promise<boolean>;
  };

  filters: {
    "AllowanceChange(address,address,string[],uint256[])"(
      owner?: string | null,
      spender?: string | null,
      methods?: null,
      values?: null
    ): AllowanceChangeEventFilter;
    AllowanceChange(
      owner?: string | null,
      spender?: string | null,
      methods?: null,
      values?: null
    ): AllowanceChangeEventFilter;

    "Approval(address,address,string[],uint256)"(
      owner?: string | null,
      spender?: string | null,
      methods?: null,
      value?: null
    ): ApprovalEventFilter;
    Approval(
      owner?: string | null,
      spender?: string | null,
      methods?: null,
      value?: null
    ): ApprovalEventFilter;
  };

  estimateGas: {
    allowance(
      owner: string,
      spender: string,
      method: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    approve(
      spender: string,
      amount: BigNumberish,
      methods: string[],
      overrides?: Overrides & { from?: string }
    ): Promise<BigNumber>;

    decreaseAllowance(
      spender: string,
      amount: BigNumberish,
      methods: string[],
      overrides?: Overrides & { from?: string }
    ): Promise<BigNumber>;

    increaseAllowance(
      spender: string,
      amount: BigNumberish,
      methods: string[],
      overrides?: Overrides & { from?: string }
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    allowance(
      owner: string,
      spender: string,
      method: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    approve(
      spender: string,
      amount: BigNumberish,
      methods: string[],
      overrides?: Overrides & { from?: string }
    ): Promise<PopulatedTransaction>;

    decreaseAllowance(
      spender: string,
      amount: BigNumberish,
      methods: string[],
      overrides?: Overrides & { from?: string }
    ): Promise<PopulatedTransaction>;

    increaseAllowance(
      spender: string,
      amount: BigNumberish,
      methods: string[],
      overrides?: Overrides & { from?: string }
    ): Promise<PopulatedTransaction>;
  };
}
