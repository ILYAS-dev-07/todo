export const useSidebar = (slideAnim, setMenuOpen) => {
    const open = () => {
        setMenuOpen(true);
        Animated.timing(slideAnim, {
            toValue: 0,
            duration: 400,
            useNativeDriver: true,
        }).start();
    };

    const close = () => {
        Animated.timing(slideAnim, {
            toValue: -250,
            duration: 400,
            useNativeDriver: true,
        }).start();
        setMenuOpen(false);
    };

    const toggle = (menuOpen) => {
        menuOpen ? close() : open();
    };

    return { open, close, toggle };
}