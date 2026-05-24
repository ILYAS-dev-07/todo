import {
    View,
    Text,
    Button,
    Pressable,
    StyleSheet,
} from "react-native";
import { Note } from "../types/Note";

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
    toggleFavorite
}: Props) {

    const formattedDate = new Date(note.date).toLocaleDateString();

    const formattedTime = new Date(note.date).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
    });

    return (
        <View style={styles.card}>
            <Text style={styles.title}>{note.title}</Text>
            <Text style={styles.description}>{note.description}</Text>
            <Text style={styles.date}>{formattedDate} {formattedTime}</Text>

            <Pressable onPress={() => toggleFavorite(index)}>
                <Text style={styles.favorite}>
                    {note.favorite ? '❤️' : '🤍'}
                </Text>
            </Pressable>
            
            <Button
                title="Удалить"
                onPress={() => deleteNote(index)}
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
        color: 'gray',
        fontSize: 13,
    },

    favorite: {
        fontSize: 20,
    }
});