import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { randomUUID } from 'crypto';
import { Repository } from 'typeorm';
import { AttachmentGroup } from './attachment-group.entity';
import { Attachment } from './attachment.entity';

@Injectable()
export class AttachmentService {
  constructor(
    @InjectRepository(Attachment)
    private readonly attachmentRepo: Repository<Attachment>,
    @InjectRepository(AttachmentGroup)
    private readonly attachmentGroupRepo: Repository<AttachmentGroup>,
  ) {}

  async saveFiles(
    files: Express.Multer.File[],
    groupId?: string,
  ): Promise<{ groupId: string; files: Attachment[] }> {
    let group = groupId
      ? await this.attachmentGroupRepo.findOneBy({ id: groupId })
      : null;

    if (!group) {
      group = await this.attachmentGroupRepo.save(
        this.attachmentGroupRepo.create({ id: randomUUID() }),
      );
    }

    const saved = this.attachmentRepo.create(
      files.map((file) => ({
        originalName: file.originalname,
        filePath: file.path,
        group,
      })),
    );

    return {
      groupId: group.id,
      files: await this.attachmentRepo.save(saved),
    };
  }
}
