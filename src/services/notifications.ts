import notifee, { AndroidImportance, TriggerType, } from '@notifee/react-native'

export const scheduleNotification = async (
    title: string,
    body: string,
    timestamp: number
  ) => {

    const channelId = await notifee.createChannel({
      id: 'default',
      name: 'Default Channel',
      importance: AndroidImportance.HIGH,
    });

    await notifee.createTriggerNotification(
      {
      title,
      body,
      android: {
        channelId,
      },
    },
    {
      type: TriggerType.TIMESTAMP,
      timestamp,
    }
  );
  };