import { useEffect } from 'react';
import { BackHandler } from 'react-native';

export const useBackHandler = (condition: boolean, callback: () => void) => {
    useEffect(() => {
      const backAction = () => {

        if (condition) {
          callback();
          return true;
        }
        return false;
      };
      
      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        backAction
      );

      return () => backHandler.remove();
    }, [condition, callback]);
};