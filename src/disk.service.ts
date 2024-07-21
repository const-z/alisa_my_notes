import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class DiskService {
  private resourcePath;
  private token;

  constructor(private configService: ConfigService) {
    this.token = this.configService.get<string>('YANDEX_DISK_APP_TOKEN');
    this.resourcePath = this.configService.get<string>(
      'YANDEX_DISK_RESOURCE_PATH',
    );
  }

  async download(): Promise<string> {
    const responseCloudApi = await fetch(
      `https://cloud-api.yandex.net/v1/disk/resources/download?path=${encodeURIComponent(
        this.resourcePath,
      )}`,
      {
        method: 'GET',
        headers: {
          Authorization: `OAuth ${this.token}`,
          Accept: 'application/json',
        },
      },
    );

    let downloadLink;

    if (responseCloudApi.status === 200) {
      downloadLink = await responseCloudApi.json();
    } else {
      throw new Error(await responseCloudApi.text());
    }

    const responseDownloader = await fetch(downloadLink.href, {
      method: downloadLink.method,
    });

    let notes;

    if (responseDownloader.status === 200) {
      notes = await responseDownloader.text();
    } else {
      throw new Error(await responseDownloader.text());
    }

    return notes;
  }

  async upload(data: string): Promise<string> {
    const responseCloudApi = await fetch(
      `https://cloud-api.yandex.net/v1/disk/resources/upload?overwrite=true&path=${encodeURIComponent(
        this.resourcePath,
      )}`,
      {
        method: 'GET',
        headers: {
          Authorization: `OAuth ${this.token}`,
          Accept: 'application/json',
        },
      },
    );

    let uploadLink;

    if (responseCloudApi.status < 400) {
      uploadLink = await responseCloudApi.json();
    } else {
      throw new Error(await responseCloudApi.text());
    }

    const responseUploader = await fetch(uploadLink.href, {
      method: uploadLink.method,
      body: data,
      headers: { 'Content-Type': 'text/plain' },
    });

    let notes;

    if (responseUploader.status >= 400) {
      throw new Error(await responseUploader.text());
    }

    return notes;
  }
}
