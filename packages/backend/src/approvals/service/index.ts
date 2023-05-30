import { Injectable } from '@nestjs/common';
import { BulkWriteOptions } from 'mongodb';
import { ApprovalRepository } from '../repository';
import { Approval } from '../schema';
import { ApprovalKind } from 'src/types';

@Injectable()
export class ApprovalService {
  constructor(private readonly approvalRepository: ApprovalRepository) {}

  async saveApprovals(
    approvals: Approval[],
    upsert: boolean,
    options?: BulkWriteOptions,
  ) {
    return this.approvalRepository.bulkUpsert(approvals, upsert, options);
  }

  async saveApprovalDates(
    updates: Pick<Approval, 'blockNumber' | 'dateApproved'>[],
  ) {
    return this.approvalRepository.updateApprovalDates(updates);
  }

  async saveApprovalInfos(
    updates: Pick<Approval, 'contractAddress' | 'isUpdated'>[],
  ) {
    return this.approvalRepository.updateApprovalInfo(updates);
  }

  async findByAccount(account: string) {
    const query = {
      $or: [
        { owner: account },
        { spender: account },
        { contractAddress: account },
      ],
    };
    return this.approvalRepository.find(query);
  }

  async findAuthzApprovals(account: string) {
    const query = {
      $or: [
        { owner: account },
        { spender: account },
        { contractAddress: account },
      ],
    };

    return this.approvalRepository.findWithAccounts({
      approvalKind: ApprovalKind.AUTHORIZATION,
      ...query,
    });
  }

  async findGAuthzApprovals(account: string) {
    const query = {
      $nor: [
        { owner: account },
        { spender: account },
        { contractAddress: account },
      ],
    };

    return this.approvalRepository.findWithAccounts({
      approvalKind: ApprovalKind.GENERIC_AUTH,
      ...query,
    });
  }

  async findERC20Approvals(account: string) {
    const query = {
      $or: [
        { owner: account },
        { spender: account },
        { contractAddress: account },
      ],
    };

    return this.approvalRepository.findWithAccounts({
      approvalKind: ApprovalKind.ERC20,
      ...query,
    });
  }

  async findNftApprovals(account: string) {
    const query = {
      $or: [
        { owner: account },
        { spender: account },
        { contractAddress: account },
      ],
    };

    return this.approvalRepository.findWithAccounts({
      approvalKind: ApprovalKind.NFT,
      ...query,
    });
  }

  async getUniqueContracts() {
    return this.approvalRepository.aggregateByContractAddress();
  }

  async getNullApprovedDates() {
    return this.approvalRepository.findNullApprovedDates();
  }

  async getFillableContracts() {
    return this.approvalRepository.findFillableERC20();
  }
}
