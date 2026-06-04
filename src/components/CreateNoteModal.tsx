import {
  Modal,
  View,
  Text,
  TextInput,
  Pressable,
  Button,
  Alert,
  StyleSheet,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useState } from 'react';

type Props = {
  visible: boolean;
  onClose: () => void;

  title: string;
  setTitle: (text: string) => void;

  description: string;
  setDescription: (text: string) => void;

  favorite: boolean;
  setFavorite: (value: boolean) => void;

  taskDate: string;
  setTaskDate: (text: string) => void;

  submit: () => any;
};

function CreateNoteModal({
  visible,
  onClose,
  title,
  setTitle,
  description,
  setDescription,
  favorite,
  setFavorite,
  taskDate,
  setTaskDate,
  submit,
}: Props) {
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

        <Button
          title="Сохранить"
          onPress={() => {
            const result = submit();

            if (result.error === 'empty_title') {
              Alert.alert(
                'Ошибка',
                'Пожалуйста, введите название задачи.'
              );
              return;
            }

            if (result.error === 'invalid_date') {
              Alert.alert(
                'Ошибка',
                'Неверный формат даты!'
              );
              return;
            }

            onClose();
          }}
        />

        <Button
          title="Отмена"
          onPress={onClose}
        />
      </View>
    </Modal>
  );
}

const [showPicker, setShowPicker] = useState(false);

export default CreateNoteModal;

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
});