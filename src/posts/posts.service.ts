import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, ILike, Repository } from 'typeorm';
import { Attachment } from '../attachments/attachment.entity';
import { AttachmentService } from '../attachments/attachments.service';
import { Board } from '../boards/board.entity';
import { User } from '../users/user.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { Post } from './post.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepo: Repository<Post>,
    @InjectRepository(Board)
    private readonly boardRepo: Repository<Board>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(Attachment)
    private readonly attachmentRepo: Repository<Attachment>,
    private readonly attachmentService: AttachmentService,
  ) {}

  async findAll(boardCode?: string, page = 1, limit = 10, keyword?: string) {
    const where: FindOptionsWhere<Post> = {};

    if (boardCode) {
      where.board = { code: boardCode } as unknown as Board;
    }
    if (keyword) {
      where.title = ILike(`%${keyword}%`);
    }

    const [data, total] = await this.postRepo.findAndCount({
      relations: ['board', 'author'],
      where,
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    });
    return {
      data,
      total,
      page,
      lastPage: Math.ceil(total / limit),
    };
  }

  async findOne(id: number): Promise<Post & { attachments: Attachment[] }> {
    const post = await this.postRepo.findOne({
      where: { id },
      relations: ['board', 'author'],
    });

    if (!post) {
      throw new NotFoundException(`Post with id ${id} not found`);
    }

    let attachments: Attachment[] = [];
    if (post.attachmentGroupId) {
      attachments = await this.attachmentRepo.find({
        where: {
          group: { id: post.attachmentGroupId },
        },
        relations: ['group'],
      });
    }

    return {
      ...post,
      attachments,
    };
  }

  async create(
    data: CreatePostDto,
    files?: Express.Multer.File[],
  ): Promise<Post> {
    const board = await this.boardRepo.findOneByOrFail({ id: data.boardId });
    const author = await this.userRepo.findOneByOrFail({ id: data.authorId });

    let attachmentGroupId: string | undefined;

    if (files && files.length > 0) {
      const { groupId } = await this.attachmentService.saveFiles(files);
      attachmentGroupId = groupId;
    }

    const post = this.postRepo.create({
      title: data.title,
      content: data.content,
      board,
      author,
      attachmentGroupId,
    });

    const saved = await this.postRepo.save(post);
    return this.findOne(saved.id);
  }

  async update(
    id: number,
    data: Partial<Post> & { deleteAttachmentIds?: number[] },
    files?: Express.Multer.File[],
  ): Promise<Post> {
    const postWithAttachments = await this.findOne(id);
    Object.assign(postWithAttachments, data);

    // 첨부파일 삭제 처리 - 유효한 ID만 삭제
    if (data.deleteAttachmentIds && data.deleteAttachmentIds.length > 0) {
      const validIds = postWithAttachments.attachments.map((a) => a.id);
      const filtered = data.deleteAttachmentIds.filter((id) =>
        validIds.includes(id),
      );
      await Promise.all(
        filtered.map((attachmentId) => this.removeAttachment(attachmentId)),
      );
    }

    // 파일 추가 처리
    if (files && files.length > 0) {
      const groupId = postWithAttachments.attachmentGroupId;
      await this.attachmentService.saveFiles(files, groupId);
    }

    await this.postRepo.save(postWithAttachments);
    return this.findOne(postWithAttachments.id);
  }

  async remove(id: number): Promise<void> {
    const post = await this.findOne(id);
    await this.postRepo.remove(post);
  }

  async removeAttachment(attachmentId: number): Promise<void> {
    const attachment = await this.attachmentRepo.findOneBy({
      id: attachmentId,
    });
    if (!attachment) {
      throw new NotFoundException(
        `Attachment with id ${attachmentId} not found`,
      );
    }
    await this.attachmentRepo.remove(attachment);
  }
}
