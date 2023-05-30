import { Module } from '@nestjs/common';
import { DsProcessorService } from './ds-processor.service';
import { ApprovalModule } from 'src/approvals/module';
import { MetadataModule } from 'src/metadata/module';
import { AccountModule } from 'src/accounts/module';

@Module({
  imports: [ApprovalModule, MetadataModule, AccountModule],
  providers: [DsProcessorService],
})
export class ListenerModule {}
