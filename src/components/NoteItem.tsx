import React from 'react';
import {
  View,
  Text,
  Button,
  Pressable,
  StyleSheet,
  Alert,
  FlatList,
  Image,
} from 'react-native';
import { Note } from '../types/Note';
import { Attachment } from '../types/Attachment';

type Props = {
  note: Note;
  index: number;
  deleteNote: (index: number) => void;
  toggleFavorite: (index: number) => void;
};

function NoteItem({
  note,
  index,
  deleteNote,
  toggleFavorite,
}: Props) {
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);

    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${hours}:${minutes}`;
  };

  const formattedDate = formatDate(note.date);
  const formattedTime = formatTime(note.date);
  const formattedTaskDate = note.taskDate ? formatDate(note.taskDate) : null;
  const formattedTaskTime = note.taskDate ? formatTime(note.taskDate) : null;

  const renderAttachmentMinicard = ({ item }: { item: Attachment }) => {
    return (
      <View style={styles.miniCard}>
        {item.type === 'image' ? (
          <Image source={{ uri: item.uri }} style={styles.miniImage} />
        ) : (
          <Text style={styles.miniIcon}>
            {item.type === 'video' ? '🎥' : item.type === 'document' ? '📄' : '🎵'}
          </Text>
        )}
        {item.name && (
          <Text numberOfLines={1} style={styles.miniName}>
            {item.name}
          </Text>
        )}
      </View>
    );
  };

  return (
    <View style={styles.card}>
      <Text style={styles.title}>{note.title}</Text>
      
      {note.description ? (
        <Text style={styles.description}>{note.description}</Text>
      ) : null}

      {note.attachments && note.attachments.length > 0 && (
        <View style={styles.attachmentsContainer}>
          <FlatList
            horizontal
            data={note.attachments}
            keyExtractor={(item) => item.id}
            showsHorizontalScrollIndicator={false}
            renderItem={renderAttachmentMinicard}
          />
        </View>
      )}

      <View style={styles.datesContainer}>
        <Text style={styles.dateText}>Создано: {formattedDate} в {formattedTime}</Text>

        {formattedTaskDate && (
          <Text style={[styles.dateText, styles.taskDateText]}>
            Дата задачи: {formattedTaskDate} {formattedTaskTime}
          </Text>
        )}
      </View>

      <View style={styles.footerActions}>
        <Pressable onPress={() => toggleFavorite(index)} style={styles.favoritePressable}>
          <Text style={styles.favorite}>{note.favorite ? '♥' : '♡'}</Text>
        </Pressable>

        <View style={styles.deleteButtonContainer}>
          <Button
            title="Удалить"
            color="#ff3b30"
            onPress={() => {
              Alert.alert(
                'Удаление заметки',
                'Вы уверены, что хотите удалить эту заметку?',
                [
                  {
                    text: 'Отмена',
                    style: 'cancel',
                  },
                  {
                    text: 'Удалить',
                    style: 'destructive',
                    onPress: () => deleteNote(index),
                  },
                ],
              );
            }}
          />
        </View>
      </View>
    </View>
  );
}

export default NoteItem;

const styles = StyleSheet.create({
  card: {
    padding: 16,
    marginVertical: 8,
    backgroundColor: 'white',
    borderRadius: 12,

    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },

  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 6,
    color: '#333',
  },

  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
    lineHeight: 20,
  },

  attachmentsContainer: {
    marginBottom: 14,
    height: 75,
  },

  miniCard: {
    width: 70,
    height: 70,
    marginRight: 8,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 4,
  },

  miniImage: {
    width: '100%',
    height: '100%',
    borderRadius: 6,
  },

  miniIcon: {
    fontSize: 22,
    marginBottom: 2,
  },

  miniName: {
    fontSize: 10,
    color: '#555',
    textAlign: 'center',
    width: '100%',
  },


  datesContainer: {
    marginBottom: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#eee',
    paddingTop: 8,
  },

  dateText: {
    fontSize: 12,
    color: '#999',
  },

  taskDateText: {
    marginTop: 4,
    color: '#555',
    fontWeight: '500',
  },

  footerActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },

  favoritePressable: {
    padding: 6,
  },

  favorite: {
    fontSize: 26,
    color: '#ff2d55',
  },

  deleteButtonContainer: {
    minWidth: 90,
  },
});