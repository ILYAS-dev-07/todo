import { Note } from '../types/note';

export const toggleFavorite = (notes: Note[], index: number): Note[] => {
    return notes.map((note, i) => 
        i === index ? { ...note, favorite: !note.favorite } : note
    );
};

export const deleteNoteByIndex = (notes: Note[], index: number): Note[] => {
    return notes.filter((_, i) => i !== index);
};