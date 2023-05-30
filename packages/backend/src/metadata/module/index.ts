import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Metadata, MetadataShema } from '../schema';
import { MetadataService } from '../service';
import { MetadataRepository } from '../repository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Metadata.name, schema: MetadataShema }]),
  ],
  providers: [MetadataService, MetadataRepository],
  exports: [MetadataService],
})
export class MetadataModule {}
