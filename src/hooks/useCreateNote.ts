import { useState } from 'react';
import { Attachment } from '../types/Attachment';

type AddNoteFn = (
  title: string,
  description: string,
  favorite: boolean,
  taskDate?: number,
  attachments?: Attachment[],
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

  const submit = (attachments: Attachment[] = []) => {
    if (title.trim() === '') {
      return { error: 'empty_title' };
    }

    const timestamp = getTimestamp();

    if (taskDate && timestamp === undefined) {
      return { error: 'invalid_date' };
    }

    if (timestamp !== undefined && timestamp <= Date.now()) {
      return { error: 'past_date' };
    }

    addNote(title.trim(), description.trim(), favorite, timestamp, attachments);

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
    submit,
  };
};