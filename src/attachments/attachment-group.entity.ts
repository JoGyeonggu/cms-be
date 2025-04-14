import { Entity, OneToMany, PrimaryColumn } from 'typeorm';

import { Attachment } from './attachment.entity';

@Entity('attachment_groups')
export class AttachmentGroup {
  @PrimaryColumn({ comment: '첨부파일 그룹 ID (UUID)' })
  id: string;

  @OneToMany(() => Attachment, (attachment) => attachment.group)
  attachments: Attachment[];
}
