import {
  View,
  Text,
  Button,
  Pressable,
  StyleSheet,
  Alert,
} from 'react-native';
import { Note } from '../types/Note';

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

  return (
    <View style={styles.card}>
      <Text style={styles.title}>{note.title}</Text>
      <Text style={styles.description}>{note.description}</Text>
      <Text style={styles.date}>{formattedDate} {formattedTime}</Text>

      {formattedTaskDate && (
        <Text style={styles.date}>
          Дата задачи: {formattedTaskDate} {formattedTaskTime}
        </Text>
      )}

      <Pressable onPress={() => toggleFavorite(index)}>
        <Text style={styles.favorite}>{note.favorite ? '♥' : '♡'}</Text>
      </Pressable>

      <Button
        title="Удалить"
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
  );
}

export default NoteItem;

const styles = StyleSheet.create({
  card: {
    padding: 12,
    marginVertical: 6,
    backgroundColor: 'white',
    borderRadius: 10,

    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,

    elevation: 3,
  },

  title: {
    fontSize: 18,
    marginBottom: 8,
  },

  description: {
    marginBottom: 8,
  },

  date: {
    color: '#000000',
    fontSize: 13,
  },

  favorite: {
    fontSize: 20,
  },
});
