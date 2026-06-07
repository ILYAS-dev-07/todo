import { Note } from '../types/Note';

export const createNote = (
    title: string,
    description: string,
    favorite: boolean,
    taskDate: number | undefined
): Note => {
    const now = Date.now();

    return {
        id: `${now}-${Math.random().toString(36).slice(2)}`,
        title,
        description,
        favorite,
        date: now,
        createdAt: now,
        taskDate,
        dueAt: taskDate,
    };
};
