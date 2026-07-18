import { useEffect, useMemo, useState } from 'react';

import { Note } from '../types/Note';
import { Attachment } from '../types/Attachment'; 
import { saveNotes, loadNotes } from '../services/storage';
import { toggleFavorite, deleteNoteByIndex } from '../services/noteActions';
import { filterNotes } from '../utils/filterNotes';
import { cancelNotification, scheduleNotification } from '../services/notifications';

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
    taskDate?: number,
    attachments: Attachment[] = [],
  ) => {
    const now = Date.now();
    const id = `${now}-${Math.random().toString(36).slice(2)}`;
    const newNotes = [
      ...notes,
      {
        id,
        title,
        description,
        favorite,
        date: now,
        createdAt: now,
        taskDate,
        dueAt: taskDate,
        attachments,
      },
    ];

    setNotes(newNotes);

    if (taskDate) {
      scheduleNotification(
        id,
        title,
        description || 'У вас есть задача',
        taskDate,
      );
    }
  };

  const filteredNotes = useMemo(() => {
    return filterNotes(notes, activeTab);
  }, [notes, activeTab]);

  const deleteNote = (index: number) => {
    const note = filteredNotes[index];
    if (note?.id) {
      cancelNotification(note.id);
    }

    setNotes(prev =>
      note?.id
        ? prev.filter(item => item.id !== note.id)
        : deleteNoteByIndex(prev, index),
    );
  };

  const toggleFav = (index: number) => {
    const note = filteredNotes[index];

    setNotes(prev =>
      note?.id
        ? prev.map(item =>
            item.id === note.id ? { ...item, favorite: !item.favorite } : item,
          )
        : toggleFavorite(prev, index),
    );
  };

  return {
    notes,
    filteredNotes,
    activeTab,
    setActiveTab,
    addNote,
    deleteNote,
    toggleFav,
  };
};