import { useEffect, useState, useMemo } from 'react';

import { Note } from '../types/note';
import { saveNotes, loadNotes } from '../services/storage';
import { toggleFavorite, deleteNoteByIndex } from '../services/noteActions';
import { filterNotes } from '../utils/filterNotes';
import { scheduleNotification } from '../services/notifications';

export type filterType = 'all' | 'today' | 'fav';

export const useNotes = () => {
    const [notes, setNotes] = useState<Note[]>([]);
    const [activeTab, setActiveTab] = useState<filterType>('all');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadNotes().then(loadedNotes => {
            setNotes(loadedNotes);
            setLoading(false);
        });
    }, []);

    useEffect(() => {
        if (!loading) {
            saveNotes(notes);
        }
    }, [notes, loading]);

    const addNote = (
        title: string,
        description: string,
        favorite: boolean,
        taskDate?: number
    ) => {
        const newNotes = [
            ...notes,
            {
                title,
                description,
                favorite,
                date: Date.now(),
                taskDate,
            }
        ];

        setNotes(newNotes);

        if (taskDate) {
            scheduleNotification(
                title,
                description || 'У вас есть задача',
                taskDate
            );
            }
        };

    const deleteNote = (index: number) => {
        setNotes(prev => deleteNoteByIndex(prev, index));
    };

    const toggleFav = (index: number) => {
        setNotes(prev => toggleFavorite(prev, index));
    };

    const filteredNotes = useMemo(() => {
        return filterNotes(notes, activeTab);
    }, [notes, activeTab]);

    return {
        notes,
        filteredNotes,
        activeTab,
        setActiveTab,
        loading,

        addNote,
        deleteNote,
        toggleFav,
    };
};