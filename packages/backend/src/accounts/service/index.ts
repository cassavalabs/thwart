import { Injectable } from '@nestjs/common';
import { BulkWriteOptions } from 'mongodb';
import { AccountRepository } from '../repository';
import { Account } from '../schema';

@Injectable()
export class AccountService {
  constructor(private accountRepository: AccountRepository) {}

  async saveAccounts(
    accounts: Account[],
    upsert: boolean,
    options?: BulkWriteOptions,
  ) {
    return this.accountRepository.bulkUpsert(accounts, upsert, options);
  }

  async findAccounts(accounts: string[]): Promise<Account[]> {
    return this.accountRepository.find({
      account: {
        $in: accounts,
      },
    });
  }
}
