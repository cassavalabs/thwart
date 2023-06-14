import { Injectable, Logger } from '@nestjs/common';
import { Metadata, MetadataDocument } from '../schema';
import { FilterQuery, Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class MetadataRepository {
  protected readonly logger = new Logger(MetadataRepository.name);

  constructor(
    @InjectModel(Metadata.name) private model: Model<MetadataDocument>
  ) {}

  async findOne(filterQuery?: FilterQuery<Metadata>): Promise<Metadata> {
    return this.model.findOne(filterQuery);
  }

  async upsert(
    filterQuery: FilterQuery<Metadata>,
    document: Partial<Metadata>
  ): Promise<Metadata> {
    return this.model.findOneAndUpdate(filterQuery, document, {
      lean: true,
      upsert: true,
      new: true,
    });
  }
}
