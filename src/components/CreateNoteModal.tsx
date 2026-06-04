import {
  Modal,
  View,
  Text,
  TextInput,
  Pressable,
  Alert,
  StyleSheet,
} from 'react-native';

import DateTimePicker from '@react-native-community/datetimepicker';
import { useState } from 'react';

type Props = {
  visible: boolean;
  onClose: () => void;
  onSave: () => void;

  title: string;
  setTitle: (text: string) => void;

  description: string;
  setDescription: (text: string) => void;

  favorite: boolean;
  setFavorite: (value: boolean) => void;

  taskDate: string;
  setTaskDate: (text: string) => void;
};

export default function CreateNoteModal({
  visible,
  onClose,
  onSave,
  title,
  setTitle,
  description,
  setDescription,
  favorite,
  setFavorite,
  taskDate,
  setTaskDate,
}: Props) {
  const [showPicker, setShowPicker] = useState(false);



  return (
    <Modal
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>

        <Text style={styles.modalTitle}>
          Новая заметка
        </Text>

        <TextInput
          placeholder="Название задачи"
          value={title}
          onChangeText={setTitle}
          style={styles.input}
        />

        <TextInput
          placeholder="Описание (необязательно)"
          value={description}
          onChangeText={setDescription}
          multiline
          style={[styles.input, { height: 100 }]}
        />

        <Pressable
          onPress={() => setShowPicker(true)}
          style={styles.input}
        >
          <Text>
            {taskDate
              ? new Date(taskDate).toLocaleDateString()
              : 'Выбрать дату'}
          </Text>
        </Pressable>

        {showPicker && (
          <DateTimePicker
            value={taskDate ? new Date(taskDate) : new Date()}
            mode="date"
            display="default"
            onChange={(event, selectedDate) => {
              setShowPicker(false);

              if (event.type === 'dismissed') return;

              if (selectedDate) {
                setTaskDate(selectedDate.toISOString());
              }
            }}
          />
        )}

        <Pressable
          onPress={() => setFavorite(!favorite)}
          style={styles.favoriteButton}
        >
          <Text style={{ fontSize: 28 }}>
            {favorite ? '❤️' : '🤍'}
          </Text>
        </Pressable>

        <View style={styles.actions}>

          <Pressable onPress={onClose} style={styles.cancelBtn}>
            <Text style={styles.cancelText}>
              Отмена
            </Text>
          </Pressable>

          <Pressable onPress={onSave} style={styles.saveBtn}>
            <Text style={styles.saveText}>
              Сохранить
            </Text>
          </Pressable>

        </View>

      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },

  modalTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
  },

  input: {
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
  },

  favoriteButton: {
    alignItems: 'center',
    marginBottom: 20,
  },

  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },

  cancelBtn: {
    padding: 12,
  },

  cancelText: {
    fontSize: 16,
    color: '#666',
  },

  saveBtn: {
    padding: 12,
    backgroundColor: '#000',
    borderRadius: 10,
  },

  saveText: {
    fontSize: 16,
    color: 'white',
    fontWeight: '600',
  },
});