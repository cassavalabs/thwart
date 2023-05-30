import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Approval, ApprovalSchema } from '../schema';
import { ApprovalService } from '../service';
import { ApprovalRepository } from '../repository';
import { ApprovalController } from '../constroller';
import { AccountModule } from 'src/accounts/module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Approval.name, schema: ApprovalSchema },
    ]),
    AccountModule,
  ],
  controllers: [ApprovalController],
  providers: [ApprovalService, ApprovalRepository],
  exports: [ApprovalService],
})
export class ApprovalModule {}
