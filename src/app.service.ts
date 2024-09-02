import { Injectable } from '@nestjs/common';

import { DiskService } from './disk.service';
import { AlisaRequest } from './types';

interface ProcessingParams {
  userId: string;
  value: string;
  session: AlisaRequest['session'];
  version: AlisaRequest['version'];
}

@Injectable()
export class AppService {
  private notes: Map<string, string[]> = new Map();
  private downloading: Map<string, Promise<void>> = new Map();

  constructor(private readonly diskService: DiskService) {}

  async processRequest({
    session,
    userId,
    value,
    version,
  }: ProcessingParams): Promise<any> {
    const response = {
      session,
      version,
      response: {
        end_session: true,
        text: '',
      },
    };

    // todo async download, save
    if (!this.notes.get(userId)) {
      if (!this.downloading.get(userId)) {
        this.downloading.set(userId, this.downloadNotes(userId));
      }

      this.downloading.get(userId).then(async () => {
        this.downloading.delete(userId);
        await this.updateNotes(userId, value);
      });
    } else {
      await this.updateNotes(userId, value);
    }

    return response;
  }

  private async updateNotes(userId: string, noteText: string): Promise<void> {
    if (!noteText) {
      return;
    }

    const note = `- [ ] #task ${noteText}`;
    this.notes.set(userId, [...(this.notes.get(userId) || []), note]);
    void this.uploadNotes(userId);
  }

  private async uploadNotes(userId: string): Promise<void> {
    try {
      await this.diskService.upload(this.notes.get(userId).join('\n'));
      console.log('Notes uploaded', userId);
    } catch (err) {
      console.error(err);
    }
  }

  private async downloadNotes(userId: string) {
    try {
      const notes = await this.diskService.download();
      this.notes.set(userId, notes.split('\n'));
      console.log('Notes downloaded', userId);
    } catch (err) {
      console.error(err);
    }
  }
}
