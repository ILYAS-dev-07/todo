import { Note } from '../types/note';

export const createNote = (
    title: string,
    description: string,
    favorite: boolean,
    taskDate: number | undefined
): Note => {
    return {
        title,
        description,
        favorite,
        date: Date.now(),
        taskDate,
    };
};