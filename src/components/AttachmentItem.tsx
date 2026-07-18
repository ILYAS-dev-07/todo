import React from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { Attachment } from '../types/Attachment';

type Props = {
  attachment: Attachment;
  onDelete: () => void;
};

export default function AttachmentItem({
  attachment,
  onDelete,
}: Props) {
  const renderPreview = () => {
    switch (attachment.type) {
      case 'image':
        return (
          <Image
            source={{ uri: attachment.uri }}
            style={styles.image}
          />
        );

      case 'video':
        return <Text style={styles.icon}>🎥</Text>;

      case 'document':
        return <Text style={styles.icon}>📄</Text>;

      case 'audio':
        return <Text style={styles.icon}>🎵</Text>;

      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      {renderPreview()}

      <Text
        numberOfLines={1}
        style={styles.name}>
        {attachment.name}
      </Text>

      <TouchableOpacity onPress={onDelete}>
        <Text style={styles.delete}>✕</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 90,
    marginRight: 10,
    alignItems: 'center',
  },

  image: {
    width: 70,
    height: 70,
    borderRadius: 8,
  },

  icon: {
    fontSize: 42,
  },

  name: {
    marginTop: 5,
    fontSize: 12,
    textAlign: 'center',
  },

  delete: {
    color: 'red',
    marginTop: 5,
    fontSize: 18,
  },
});