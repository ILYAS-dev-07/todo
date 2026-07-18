import React from 'react';
import {
  Alert,
  Button,
} from 'react-native';

import attachmentService from '../services/attachmentService';
import { Attachment } from '../types/Attachment';

type Props = {
  onPick: (attachments: Attachment[]) => void;
};

export default function AttachmentPicker({
  onPick,
}: Props) {
  const showMenu = () => {
    Alert.alert(
      'Добавить вложение',
      '',
      [
        {
          text: 'Фото',

          onPress: async () => {
            const photo =
              await attachmentService.takePhoto();

            if (photo) {
              onPick([photo]);
            }
          },
        },

        {
          text: 'Видео',

          onPress: async () => {
            const video =
              await attachmentService.recordVideo();

            if (video) {
              onPick([video]);
            }
          },
        },

        {
          text: 'Галерея',

          onPress: async () => {
            const images =
              await attachmentService.pickImages();

            onPick(images);
          },
        },

        {
          text: 'Документы',

          onPress: async () => {
            const docs =
              await attachmentService.pickDocuments();

            onPick(docs);
          },
        },

        {
          text: 'Отмена',
          style: 'cancel',
        },
      ],
    );
  };

  return (
    <Button
      title="📎 Добавить файл"
      onPress={showMenu}
    />
  );
}