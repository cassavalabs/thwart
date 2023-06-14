import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Approval, ApprovalDocument, ApprovalPaginateModel } from '../schema';
import { FilterQuery, Model } from 'mongoose';
import { BulkWriteOptions } from 'mongodb';
import { ApprovalKind } from 'src/types';

@Injectable()
export class ApprovalRepository {
  protected readonly logger = new Logger(ApprovalRepository.name);

  constructor(
    @InjectModel(Approval.name) private model: Model<ApprovalDocument>
  ) {}

  async findOne(filterQuery: FilterQuery<Approval>): Promise<Approval> {
    return this.model.findOne(filterQuery);
  }

  async find(filterQuery: FilterQuery<Approval>): Promise<Approval[]> {
    return this.model.find(filterQuery);
  }

  async findWithAccounts(filter: FilterQuery<Approval>) {
    return this.model.find(filter).populate(['contract', 'operator']);
  }

  async findWithPagination(
    filter: FilterQuery<Approval>,
    offset: number,
    limit: number
  ) {
    const dynamicModel = this.model as ApprovalPaginateModel<ApprovalDocument>;

    return dynamicModel.paginate(filter, {
      offset,
      limit,
      populate: ['contract', 'operator'],
      lean: true,
    });
  }

  async findOneLatest(): Promise<Approval> {
    return this.model.findOne().sort({ _id: -1 });
  }

  async findNullApprovedDates() {
    return this.model.distinct('blockNumber', {
      dateApproved: {
        $not: { $type: 'number' },
      },
    });
  }

  async findFillableERC20() {
    return this.model.distinct('contractAddress', {
      approvalKind: ApprovalKind.ERC20,
      isUpdated: false,
    });
  }

  async aggregateByContractAddress() {
    return this.model.aggregate([
      {
        $group: {
          _id: `$contractAddress`,
          count: {
            $sum: 1,
          },
        },
      },
    ]);
  }

  async updateApprovalInfo(
    documents: Pick<Approval, 'contractAddress' | 'isUpdated'>[]
  ) {
    return this.model.bulkWrite(
      documents.map((document) => ({
        updateMany: {
          filter: { contractAddress: document.contractAddress },
          update: document,
          upsert: false,
        },
      }))
    );
  }

  async updateApprovalDates(
    documents: Pick<Approval, 'blockNumber' | 'dateApproved'>[]
  ) {
    return this.model.bulkWrite(
      documents.map((document) => ({
        updateMany: {
          filter: { blockNumber: document.blockNumber },
          update: document,
          upsert: false,
        },
      }))
    );
  }

  async bulkUpsert(
    documents: Partial<Approval>[],
    upsert: boolean,
    options?: BulkWriteOptions
  ) {
    return this.model.bulkWrite(
      documents.map((document) => ({
        updateOne: {
          filter: {
            contractAddress: document.contractAddress,
            owner: document.owner,
            spender: document.spender,
          },
          update: document,
          upsert,
        },
      })),
      options
    );
  }
}
