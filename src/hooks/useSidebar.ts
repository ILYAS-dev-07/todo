import { Animated, Easing } from 'react-native';


type UseSidebarProps = {
    slideAnim: Animated.Value;
    setMenuOpen: (open: boolean) => void;
};

export const useSidebar = ({
    slideAnim, setMenuOpen
}: UseSidebarProps) => {
    const open = () => {
        setMenuOpen(true);

        Animated.timing(slideAnim, {
            toValue: 0,
            duration: 400,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
        }).start();
    };

    const close = () => {
        Animated.timing(slideAnim, {
            toValue: -250,
            duration: 400,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
        }).start();
        setMenuOpen(false);
    };

    const toggle = (menuOpen: boolean) => {
        menuOpen ? close() : open();
    };

    return { open, close, toggle };
}