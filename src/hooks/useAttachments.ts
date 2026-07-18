import { useState } from 'react';
import { Attachment } from '../types/Attachment';

export function useAttachments(initial: Attachment[] = []) {
  const [attachments, setAttachments] = useState<Attachment[]>(initial);

  const addAttachment = (attachment: Attachment) => {
    setAttachments(prev => [...prev, attachment]);
  };

  const addAttachments = (items: Attachment[]) => {
    setAttachments(prev => [...prev, ...items]);
  };

  const removeAttachment = (id: string) => {
    setAttachments(prev =>
      prev.filter(item => item.id !== id),
    );
  };

  const clearAttachments = () => {
    setAttachments([]);
  };

  return {
    attachments,
    addAttachment,
    addAttachments,
    removeAttachment,
    clearAttachments,
  };
}