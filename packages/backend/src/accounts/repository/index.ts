import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { BulkWriteOptions } from 'mongodb';
import { Account, AccountDocument } from '../schema';

@Injectable()
export class AccountRepository {
  protected readonly logger = new Logger(AccountRepository.name);

  constructor(
    @InjectModel(Account.name) private model: Model<AccountDocument>,
  ) {}

  async findOne(filterQuery: FilterQuery<Account>): Promise<Account> {
    return this.model.findOne(filterQuery);
  }

  async find(filterQuery: FilterQuery<Account>): Promise<Account[]> {
    return this.model.find(filterQuery);
  }

  async upsertAccount(document: Account) {
    return this.model.updateOne({ account: document.account }, document, {
      upsert: true,
    });
  }

  async bulkUpsert(
    documents: Account[],
    upsert: boolean,
    options?: BulkWriteOptions,
  ) {
    return this.model.bulkWrite(
      documents.map((document) => ({
        updateOne: {
          filter: { account: document.account },
          update: document,
          upsert,
        },
      })),
      options,
    );
  }
}
