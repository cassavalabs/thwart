import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Account, AccountSchema } from '../schema';
import { AccountService } from '../service';
import { AccountRepository } from '../repository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Account.name, schema: AccountSchema }]),
  ],
  providers: [AccountService, AccountRepository],
  exports: [AccountService],
})
export class AccountModule {}
