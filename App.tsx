import {
  View,
  Animated,
  Text,
  Pressable,
  Button,
  FlatList,
  StyleSheet,
  Alert,
} from 'react-native';
import NoteItem from './src/components/NoteItem';
import SidebarMenu from './src/components/SidebarMenu';
import { useEffect, useRef, useState } from 'react';
import { useSidebar } from './src/hooks/useSidebar';
import { useNotes } from './src/hooks/useNotes';
import { useCreateNote } from './src/hooks/useCreateNote';
import CreateNoteModal from './src/components/CreateNoteModal';
import { requestNotificationPermission } from './src/services/notifications';

function App() {
  const {
    filteredNotes,
    activeTab,
    setActiveTab,
    addNote,
    deleteNote,
    toggleFav,
  } = useNotes();

  const {
    title,
    description,
    favorite,
    taskDate,
    setTitle,
    setDescription,
    setFavorite,
    setTaskDate,
    submit,
  } = useCreateNote(addNote);

  const [modalVisible, setModalVisible] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const slideAnim = useRef(new Animated.Value(-250)).current;

  const { toggle: toggleMenu, close: closeMenu } = useSidebar({
    slideAnim,
    setMenuOpen,
  });

  useEffect(() => {
    requestNotificationPermission();
  }, []);

  const getTitle = () => {
    switch (activeTab) {
      case 'today':
        return 'Сегодня';
      case 'fav':
        return 'Избранные';
      default:
        return 'Дневник';
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => toggleMenu(menuOpen)}>
          <Text style={styles.menuButton}>☰</Text>
        </Pressable>

        <Text style={styles.hearderTitle}>{getTitle()}</Text>

        <View style={styles.headerSpacer} />
      </View>

      <Button
        title="Создать заметку"
        onPress={() => setModalVisible(true)}
      />

      {menuOpen && <Pressable style={styles.backdrop} onPress={closeMenu} />}

      <SidebarMenu
        slideAnim={slideAnim}
        setActiveTab={setActiveTab}
        closeMenu={closeMenu}
      />

      <CreateNoteModal
  visible={modalVisible}
  onClose={() => setModalVisible(false)}

  onSave={(attachments) => {
    const result = submit(attachments); 

    if (result.error === 'empty_title') {
      Alert.alert('Ошибка', 'Пожалуйста, введите название задачи');
      return;
    }

    if (result.error === 'invalid_date') {
      Alert.alert('Ошибка', 'Неверный формат даты!');
      return;
    }

    if (result.error === 'past_date') {
      Alert.alert('Ошибка', 'Выберите будущую дату и время для уведомления');
      return;
    }

    setModalVisible(false);
  }}
  title={title}
  setTitle={setTitle}
  description={description}
  setDescription={setDescription}
  favorite={favorite}
  setFavorite={setFavorite}
  taskDate={taskDate}
  setTaskDate={setTaskDate}
/>

      <FlatList
        data={filteredNotes}
        keyExtractor={(item, index) => item.id ?? index.toString()}
        renderItem={({ item, index }) => (
          <NoteItem
            note={item}
            index={index}
            deleteNote={deleteNote}
            toggleFavorite={toggleFav}
          />
        )}
      />
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

  headerSpacer: {
    width: 30,
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
});

export default App;
