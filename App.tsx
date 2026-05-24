import {
  View,
  Animated,
  Text,
  TextInput,
  Pressable,
  Button,
  FlatList,
  Alert,
  StyleSheet,
  Modal,
} from 'react-native';
import NoteItem from './src/components/NoteItem';
import SidebarMenu from './src/components/SidebarMenu';
import { useState, useEffect, useRef, useMemo } from 'react';
import { Note } from './src/types/note';
import { scheduleNotification } from './src/services/notifications';
import { saveNotes, loadNotes } from './src/services/storage';
import { toggleFavorite, deleteNoteByIndex } from './src/services/noteActions';
import { filterNotes } from './src/utils/filterNotes';

function App() {

  const handleToggleFavorite = (index: number) => {
    setNotes(prev => {
      const updated = toggleFavorite(prev, index);

      saveNotes(updated).catch(err => 
        console.log('SAVE ERROR', err)
      );
      
      return updated;
    });
  };

  const handleDelete = (index: number) => {
    setNotes(prev => {
      const updated = deleteNoteByIndex(prev, index);
      saveNotes(updated);
      return updated;
    });
  };

  useEffect(() => {
    loadNotes().then(setNotes);
  }, []);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [favorite, setFavorite] = useState(false);
  const [taskDate, setTaskDate] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [notes, setNotes] = useState<Note[]>([]);
  const [activeTab, setActiveTab] = useState('all');
  const [menuOpen, setMenuOpen] = useState(false);
  const slideAnim = useRef(new Animated.Value(-250)).current;

  const toggleMenu = () => {
    if (menuOpen) {
      Animated.timing(slideAnim, {
        toValue: -250,
        duration: 400,
        useNativeDriver: true,
      }).start();

        setMenuOpen(false);
    } else {
      setMenuOpen(true);

      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }).start();
    }
  };

  const closeMenu = () => {
    Animated.timing(slideAnim, {
      toValue: -250,
      duration: 400,
      useNativeDriver: true,
    }).start();
    
    setMenuOpen(false);
  };

  const filteredNotes = useMemo(() =>
    filterNotes(notes, activeTab),
    [notes, activeTab]
  );

  return (
    <View style={styles.container}>
    
    <View style={styles.header}>

    <Pressable onPress={toggleMenu}>
      <Text style={styles.menuButton}>
        ☰
        </Text>
    </Pressable>

        <Text style={styles.hearderTitle}>
          Дневник
        </Text>

    <View style={{ width: 30}}/>
    </View>

      <Button
      title="Создать заметку"
      onPress={() => setModalVisible(true)}
      />

    {menuOpen && (
      <Pressable
        style={styles.backdrop}
        onPress={closeMenu}
      />
          )}
    <SidebarMenu
      slideAnim={slideAnim}
      setActiveTab={setActiveTab}
      closeMenu={closeMenu}
    />

      <Modal
        visible={modalVisible}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
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

          <TextInput
            placeholder="Дата (необязательно)"
            value={taskDate }
            onChangeText={setTaskDate}
            style={styles.input}
          />

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
              if (title.trim() === '') {
                Alert.alert('Ошибка', 'Пожалуйста, введите название задачи.');
                return;
              }

              const timestamp = taskDate ? new Date(taskDate).getTime() : NaN;

              if (taskDate && isNaN(timestamp)) {
                Alert.alert('Ошибка', 'Неверный формат даты!');
                return;
              }

              const newNotes = [
                ...notes,
                {
                  title,
                  description,
                  favorite,
                  date: Date.now(),
                  taskDate: isNaN(timestamp) ? undefined : timestamp,
                }
              ];

              setNotes(newNotes);
              saveNotes(newNotes);

              if (!isNaN(timestamp)) {
              scheduleNotification(
                title,
                description || 'У вас есть задача',
                timestamp
              );
              }

              setTitle('');
              setDescription('');
              setFavorite(false);
              setTaskDate('');

              setModalVisible(false);
            }}
          />

          <Button
            title="Отмена"
            onPress={() => setModalVisible(false)}
          />

          </View>
        </Modal>
      
      <FlatList
        data={filteredNotes}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => {
          return (
            <NoteItem
              note={item}
              index={index}
              deleteNote={handleDelete}
              toggleFavorite={handleToggleFavorite}
            />
          );
    }}>
      </FlatList>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },

  menuButton: {
    fontSize: 28,
  },

  hearderTitle: {
    fontSize: 28,
    fontWeight: 'bold',
  },

  noteText: {
    fontSize: 18,
    marginBottom: 8,
  },

  noteDate: {
    color: 'gray',
    fontSize: 13,
  },

  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
    zIndex: 50,
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

  favoriteButton: {
    alignItems: 'center',
    marginBottom: 20,
  },
  });

export default App;
