jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

jest.mock('@notifee/react-native', () => ({
  AlarmType: {
    SET_EXACT_AND_ALLOW_WHILE_IDLE: 3,
  },
  AndroidImportance: {
    HIGH: 4,
  },
  AuthorizationStatus: {
    AUTHORIZED: 1,
    PROVISIONAL: 2,
  },
  TriggerType: {
    TIMESTAMP: 0,
  },
  __esModule: true,
  default: {
    requestPermission: jest.fn(async () => ({ authorizationStatus: 1 })),
    createChannel: jest.fn(async () => 'tasks'),
    createTriggerNotification: jest.fn(async () => 'notification-id'),
    cancelNotification: jest.fn(async () => undefined),
  },
}));
