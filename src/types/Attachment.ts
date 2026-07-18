export type AttachmentType =
  | 'image'
  | 'document'
  | 'audio'
  | 'video';

export interface Attachment {
  id: string;

  type: AttachmentType;

  uri: string;

  name?: string;

  size?: number;

  mimeType?: string;

  createdAt: number;
}