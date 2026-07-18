import React, { useEffect, useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { useAttachments } from '../hooks/useAttachments';
import AttachmentPicker from './AttachmentPicker';
import AttachmentPreview from './AttachmentPreview';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Attachment } from '../types/Attachment';

type Props = {
  visible: boolean;
  onClose: () => void;
  onSave: (attachments: Attachment[]) => void;

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
  const [showDate, setShowDate] = useState(false);
  const [showTime, setShowTime] = useState(false);
  const [tempDate, setTempDate] = useState(new Date());

  const { attachments, addAttachments, removeAttachment, clearAttachments } = useAttachments();

  useEffect(() => {
    if (visible) {
      setTempDate(taskDate ? new Date(taskDate) : new Date());
    } else {
      clearAttachments();
    }
  }, [taskDate, visible]);

  const formatDate = (date: Date) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  };

  const formatTime = (date: Date) => {
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${hours}:${minutes}`;
  };

  const updateTaskDate = (date: Date) => {
    setTempDate(date);
    setTaskDate(date.toISOString());
  };

  const handleSave = () => {
    onSave(attachments);
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Новая заметка</Text>

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
            style={[styles.input, styles.descriptionInput]}
          />

          <Pressable onPress={() => setShowDate(true)} style={styles.input}>
            <Text>{formatDate(tempDate)}</Text>
          </Pressable>

          <Pressable onPress={() => setShowTime(true)} style={styles.input}>
            <Text>{formatTime(tempDate)}</Text>
          </Pressable>

          <Pressable
            onPress={() => setFavorite(!favorite)}
            style={styles.favoriteButton}
          >
            <Text style={styles.favoriteText}>{favorite ? '♥' : '♡'}</Text>
          </Pressable>

          <View style={styles.attachmentSection}>
            <AttachmentPicker onPick={addAttachments} />
            {attachments.length > 0 && (
              <View style={styles.previewContainer}>
                <AttachmentPreview attachments={attachments} onDelete={removeAttachment} />
              </View>
            )}
          </View>

          <View style={styles.actions}>
            <Pressable onPress={onClose} style={styles.cancelBtn}>
              <Text style={styles.cancelText}>Отмена</Text>
            </Pressable>

            <Pressable onPress={handleSave} style={styles.saveBtn}>
              <Text style={styles.saveText}>Сохранить</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>

      {showDate && (
        <DateTimePicker
          value={tempDate}
          mode="date"
          display="default"
          onChange={(_, date) => {
            setShowDate(false);
            if (!date) return;

            const updated = new Date(tempDate);
            updated.setFullYear(date.getFullYear(), date.getMonth(), date.getDate());
            updateTaskDate(updated);
          }}
        />
      )}

      {showTime && (
        <DateTimePicker
          value={tempDate}
          mode="time"
          is24Hour={true}
          display="default"
          onChange={(_, time) => {
            setShowTime(false);
            if (!time) return;

            const updated = new Date(tempDate);
            updated.setHours(time.getHours());
            updated.setMinutes(time.getMinutes());
            updated.setSeconds(0);
            updated.setMilliseconds(0);

            updateTaskDate(updated);
          }}
        />
      )}
    </Modal>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
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

  descriptionInput: {
    height: 100,
    textAlignVertical: 'top',
  },

  favoriteButton: {
    alignItems: 'center',
    marginBottom: 20,
  },

  favoriteText: {
    fontSize: 28,
  },

  attachmentSection: {
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
    alignItems: 'stretch',
  },

  previewContainer: {
    marginTop: 15,
    height: 110,
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