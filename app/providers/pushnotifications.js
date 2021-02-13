import * as React from 'react';
import * as Notifications from 'expo-notifications';

export default function pushNotificationListener() {
  const setNotificationSettings = () => {
    Notifications.setNotificationHandler({
      handleNotification: () => ({
        shouldShowAlert: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
      }),
    });
  };

  const handleNotification = notification => {
    // eslint-disable-next-line no-console
    console.log(notification);
  };

  React.useEffect(() => {
    setNotificationSettings();
  }, []);

  React.useEffect(() => {
    const subscription = Notifications.addNotificationReceivedListener(
      handleNotification,
    );
    return () => {
      return subscription.remove();
    };
  }, []);
}
