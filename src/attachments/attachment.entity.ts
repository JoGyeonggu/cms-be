import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { AttachmentGroup } from './attachment-group.entity';

@Entity('attachments')
export class Attachment {
  @PrimaryGeneratedColumn({ comment: '첨부파일 고유 ID' })
  id: number;

  @Column({ comment: '원본 파일명' })
  originalName: string;

  @Column({ comment: '저장된 파일 경로' })
  filePath: string;

  @ManyToOne(() => AttachmentGroup, (group) => group.attachments, {
    onDelete: 'CASCADE',
  })
  group: AttachmentGroup;
}
