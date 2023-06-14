import { Injectable } from '@nestjs/common';
import { MetadataRepository } from '../repository';
import { Metadata } from '../schema';

@Injectable()
export class MetadataService {
  constructor(private readonly metadataRepository: MetadataRepository) {}

  async saveMetadata(metadata: Metadata) {
    return this.metadataRepository.upsert(
      { blockchain: metadata.blockchain },
      metadata
    );
  }

  async getLatestProcessedBlockHeight(blockchain: string) {
    const metadata = await this.metadataRepository.findOne({
      blockchain: blockchain,
    });

    if (metadata) {
      return metadata.blockHeight;
    }
    return 0;
  }
}
