import notifee, {
  AlarmType,
  AndroidImportance,
  AuthorizationStatus,
  TimestampTrigger,
  TriggerType,
} from '@notifee/react-native';

const CHANNEL_ID = 'tasks';

export const requestNotificationPermission = async () => {
  const settings = await notifee.requestPermission();

  return (
    settings.authorizationStatus === AuthorizationStatus.AUTHORIZED ||
    settings.authorizationStatus === AuthorizationStatus.PROVISIONAL
  );
};

export const scheduleNotification = async (
  id: string,
  title: string,
  body: string,
  timestamp: number,
) => {
  if (timestamp <= Date.now()) {
    return;
  }

  const hasPermission = await requestNotificationPermission();
  if (!hasPermission) {
    return;
  }

  const channelId = await notifee.createChannel({
    id: CHANNEL_ID,
    name: 'Task reminders',
    importance: AndroidImportance.HIGH,
  });

  const notification = {
    id,
    title,
    body,
    android: {
      channelId,
      pressAction: {
        id: 'default',
      },
    },
  };

  const trigger: TimestampTrigger = {
    type: TriggerType.TIMESTAMP,
    timestamp,
    alarmManager: {
      type: AlarmType.SET_EXACT_AND_ALLOW_WHILE_IDLE,
    },
  };

  try {
    await notifee.createTriggerNotification(notification, trigger);
  } catch {
    await notifee.createTriggerNotification(
      notification,
      {
        type: TriggerType.TIMESTAMP,
        timestamp,
      },
    );
  }
};

export const cancelNotification = async (id: string) => {
  await notifee.cancelNotification(id);
};
