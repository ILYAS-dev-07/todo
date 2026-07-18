import { Attachment } from './Attachment';

export type Note = {
    id: string;

    title: string;
    description: string;

    favorite: boolean;

    date: number;
    taskDate?: number;

    createdAt: number;

    dueAt?: number;

    attachments: Attachment[];
};