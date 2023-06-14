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
    options?: BulkWriteOptions
  ) {
    return this.approvalRepository.bulkUpsert(approvals, upsert, options);
  }

  async saveApprovalDates(
    updates: Pick<Approval, 'blockNumber' | 'dateApproved'>[]
  ) {
    return this.approvalRepository.updateApprovalDates(updates);
  }

  async saveApprovalInfos(
    updates: Pick<Approval, 'contractAddress' | 'isUpdated'>[]
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

  async findAuthzApprovals(account: string, offset: number, limit: number) {
    const query = {
      $or: [
        { owner: account },
        { spender: account },
        { contractAddress: account },
      ],
    };

    return this.approvalRepository.findWithPagination(
      {
        approvalKind: ApprovalKind.AUTHORIZATION,
        ...query,
      },
      offset,
      limit
    );
  }

  async findGAuthzApprovals(account: string, offset: number, limit: number) {
    const query = {
      $nor: [
        { owner: account },
        { spender: account },
        { contractAddress: account },
      ],
    };

    return this.approvalRepository.findWithPagination(
      {
        approvalKind: ApprovalKind.GENERIC_AUTH,
        ...query,
      },
      offset,
      limit
    );
  }

  async findERC20Approvals(account: string, offset: number, limit: number) {
    const query = {
      $or: [
        { owner: account },
        { spender: account },
        { contractAddress: account },
      ],
    };

    return this.approvalRepository.findWithPagination(
      {
        approvalKind: ApprovalKind.ERC20,
        ...query,
      },
      offset,
      limit
    );
  }

  async findNftApprovals(account: string, offset: number, limit: number) {
    const query = {
      $or: [
        { owner: account },
        { spender: account },
        { contractAddress: account },
      ],
    };

    return this.approvalRepository.findWithPagination(
      {
        approvalKind: ApprovalKind.NFT,
        ...query,
      },
      offset,
      limit
    );
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
