import AsyncStorage from '@react-native-async-storage/async-storage';
import { Note } from '../types/Note';

export const saveNotes = async (notes: Note[]) => {
    await AsyncStorage.setItem('notes', JSON.stringify(notes));
};

export const loadNotes = async (): Promise<Note[]> => {
    const data = await AsyncStorage.getItem('notes');
    if (!data) return [];

    const parsedNotes = JSON.parse(data) as Partial<Note>[];

    return parsedNotes.map((note, index) => {
        const createdAt = note.createdAt ?? note.date ?? Date.now();

        return {
            id: note.id ?? `${createdAt}-${index}`,
            title: note.title ?? '',
            description: note.description ?? '',
            favorite: note.favorite ?? false,
            date: note.date ?? createdAt,
            taskDate: note.taskDate ?? note.dueAt,
            createdAt,
            dueAt: note.dueAt ?? note.taskDate,
        };
    });
};
