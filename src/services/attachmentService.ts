import {
  Asset,
  CameraOptions,
  ImageLibraryOptions,
  launchCamera,
  launchImageLibrary,
} from 'react-native-image-picker';

import DocumentPicker, {
  DocumentPickerResponse,
} from 'react-native-document-picker';

import RNFS from 'react-native-fs';
import { Attachment } from '../types/Attachment';

class AttachmentService {
  private async saveFileToPermanentStorage(tempUri: string, originalName?: string | null, typeExt: string = 'jpg'): Promise<string> {
    try {
      if (!tempUri) return '';

      const fileName = originalName 
        ? `${Date.now()}-${originalName}` 
        : `${Date.now()}-${Math.random().toString(36).slice(2)}.${typeExt}`;
      
      const permanentPath = `${RNFS.DocumentDirectoryPath}/${fileName}`;

      const sourceUri = decodeURIComponent(tempUri);

      const cleanSrcPath = sourceUri.startsWith('file://') ? sourceUri.replace('file://', '') : sourceUri;

      await RNFS.copyFile(cleanSrcPath, permanentPath);

      return `file://${permanentPath}`;
    } catch (error) {
      console.error('Ошибка при сохранении файла в постоянное хранилище:', error);
      return tempUri;
    }
  }

  private async imageToAttachment(asset: Asset): Promise<Attachment> {
    const permanentUri = await this.saveFileToPermanentStorage(asset.uri ?? '', asset.fileName, 'jpg');

    return {
      id: Date.now().toString() + Math.random(),
      type: 'image',
      uri: permanentUri,
      name: asset.fileName,
      size: asset.fileSize,
      mimeType: asset.type,
      createdAt: Date.now(),
    };
  }

  private async documentToAttachment(document: DocumentPickerResponse): Promise<Attachment> {
    const permanentUri = await this.saveFileToPermanentStorage(document.uri, document.name, 'pdf');

    return {
      id: Date.now().toString() + Math.random(),
      type: 'document',
      uri: permanentUri,
      name: document.name ?? undefined,
      size: document.size ?? undefined,
      mimeType: document.type ?? undefined,
      createdAt: Date.now(),
    };
  }

  async takePhoto(): Promise<Attachment | null> {
    const options: CameraOptions = {
      mediaType: 'photo',
      saveToPhotos: true,
      quality: 0.8,
    };

    const result = await launchCamera(options);

    if (result.didCancel || result.errorCode) {
      return null;
    }

    const asset = result.assets?.[0];

    if (!asset) {
      return null;
    }

    return this.imageToAttachment(asset);
  }

  async recordVideo(): Promise<Attachment | null> {
    const options: CameraOptions = {
      mediaType: 'video',
      saveToPhotos: true,
      videoQuality: 'high',
    };

    const result = await launchCamera(options);

    if (result.didCancel || result.errorCode) {
      return null;
    }

    const asset = result.assets?.[0];

    if (!asset) {
      return null;
    }

    const baseAttachment = await this.imageToAttachment(asset);

    return {
      ...baseAttachment,
      type: 'video',
    };
  }

  async pickImages(): Promise<Attachment[]> {
    const options: ImageLibraryOptions = {
      mediaType: 'photo',
      selectionLimit: 0,
      quality: 0.8,
    };

    const result = await launchImageLibrary(options);

    if (result.didCancel || result.errorCode) {
      return [];
    }

    const attachments = await Promise.all(
      (result.assets ?? []).map(asset => this.imageToAttachment(asset))
    );

    return attachments;
  }

  async pickDocuments(): Promise<Attachment[]> {
    try {
      const results = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
        allowMultiSelection: true,
      });

      const attachments = await Promise.all(
        results.map(doc => this.documentToAttachment(doc))
      );

      return attachments;
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        return [];
      } else {
        console.error(err);
        return [];
      }
    }
  }
}

export default new AttachmentService();