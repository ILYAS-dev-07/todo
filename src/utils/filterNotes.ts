import { Note } from '../types/note';

export const filterNotes = (notes: Note[], filter: string): Note[] => {
    if (filter === 'today') {
        const today = new Date();

        return notes.filter(note => {
            const noteDate = new Date(note.date);

            return (
                noteDate.getDate() === today.getDate() &&
                noteDate.getMonth() === today.getMonth() &&
                noteDate.getFullYear() === today.getFullYear()
            );
        });
    }

    if (filter === 'fav') {
        return notes.filter(note => note.favorite);
    }
    
    return notes;
};