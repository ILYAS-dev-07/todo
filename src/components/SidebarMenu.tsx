import {
    View,
    Button,
    Animated,
    StyleSheet,
} from "react-native";

type Props = {
    slideAnim: Animated.Value;
    setActiveTab: (tab: string) => void;
    closeMenu: () => void;
};

function SidebarMenu({
    slideAnim,
    setActiveTab,
    closeMenu
}: Props) {
    return (
        <Animated.View
          style={[
            styles.container,
            { transform: [{ translateX: slideAnim }] },
          ]}
        >
          <View style={styles.buttonWrapper}>
            <Button
              title="Все"
              onPress={() => {
                setActiveTab('all');
                closeMenu();
              }}
            />
          </View>

          <View style={styles.buttonWrapper}>
            <Button
              title="Сегодня"
              onPress={() => {
                setActiveTab('today');
                closeMenu();
              }}
            />
          </View>

          <View style={styles.buttonWrapper}>
            <Button
              title="Избранное"
              onPress={() => {
                setActiveTab('fav');
                closeMenu();
              }}
            />
          </View>

        </Animated.View>
    );
};

    export default SidebarMenu;

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: 220,
        height: '100%',

        backgroundColor: 'white',

        padding: 20,

        elevation: 10,
        zIndex: 100,
    },

    buttonWrapper: {
        marginBottom: 12,
    }
});