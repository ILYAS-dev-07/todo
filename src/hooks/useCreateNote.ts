import { useState } from 'react';

type CreateNoteData = {
  title: string;
  description: string;
  favorite: boolean;
  taskDate: string;
};

type AddNoteFn = (
    title: string,
    description: string,
    favorite: boolean,
    taskDate?: number
) => void;

export const useCreateNote = (addNote: AddNoteFn) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [favorite, setFavorite] = useState(false);
  const [taskDate, setTaskDate] = useState('');

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setFavorite(false);
    setTaskDate('');
  };

  const getTimestamp = () => {
    if (!taskDate) return undefined;

    const timestamp = new Date(taskDate).getTime();
    return isNaN(timestamp) ? undefined : timestamp;
  };

  const submit = () => {
    if (title.trim() === '') {
      return { error: 'Пожалуйста, введите название задачи.' };
    }

    const timestamp = getTimestamp();

    if (taskDate && timestamp === undefined) {
      return { error: 'Неверный формат даты!' };
    }

    addNote(
        title,
        description,
        favorite,
        timestamp
    );

    resetForm();

    return { success: true };
  };

  return {
    title,
    setTitle,
    description,
    setDescription,
    favorite,
    setFavorite,
    taskDate,
    setTaskDate,

    resetForm,
    submit
  };
};