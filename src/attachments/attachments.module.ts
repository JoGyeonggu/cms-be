import { Attachment } from './attachment.entity';
import { AttachmentGroup } from './attachment-group.entity';
import { AttachmentService } from './attachments.service';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Attachment, AttachmentGroup])],
  providers: [AttachmentService],
  exports: [AttachmentService], // 다른 모듈에서 사용할 수 있게 export
})
export class AttachmentsModule {}
