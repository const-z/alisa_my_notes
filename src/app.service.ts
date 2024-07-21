import { Injectable } from '@nestjs/common';

import { DiskService } from './disk.service';

@Injectable()
export class AppService {
  private notes: Map<string, string[]> = new Map();

  constructor(private readonly diskService: DiskService) {}

  async processRequest(userId: string, body: any): Promise<any> {
    const response = {
      session: body.session,
      version: body.version,
      response: {
        end_session: true,
        text: '',
      },
    };

    if (!this.notes.get(userId)) {
      response.response.text = 'Загружаю список заметок';
      void this.downloadNotes(userId);
    }

    await this.updateNotes(
      userId,
      body.request.nlu?.intents?.test_add_note?.slots?.note?.value,
    );

    return response;
  }

  private async updateNotes(userId: string, noteText: string): Promise<void> {
    if (!noteText) {
      return;
    }

    const note = `${noteText}`;

    this.notes.set(userId, [...(this.notes.get(userId) || []), noteText]);
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
