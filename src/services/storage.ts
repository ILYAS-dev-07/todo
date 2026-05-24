import AsyncStorage from '@react-native-async-storage/async-storage';
import { Note } from '../types/note';

export const saveNotes = async (notes: Note[]) => {
    await AsyncStorage.setItem('notes', JSON.stringify(notes));
};

export const loadNotes = async (): Promise<Note[]> => {
    const data = await AsyncStorage.getItem('notes');
    return data ? JSON.parse(data) : [];
};