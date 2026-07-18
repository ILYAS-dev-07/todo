import React from 'react';
import {
  FlatList,
} from 'react-native';

import AttachmentItem from './AttachmentItem';
import { Attachment } from '../types/Attachment';

type Props = {
  attachments: Attachment[];

  onDelete: (id: string) => void;
};

export default function AttachmentPreview({
  attachments,
  onDelete,
}: Props) {
  return (
    <FlatList
      horizontal
      data={attachments}
      keyExtractor={item => item.id}
      showsHorizontalScrollIndicator={false}
      renderItem={({ item }) => (
        <AttachmentItem
          attachment={item}
          onDelete={() => onDelete(item.id)}
        />
      )}
    />
  );
}