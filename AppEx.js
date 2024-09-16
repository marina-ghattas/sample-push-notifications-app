import { useState, useEffect, useRef } from "react";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { View, Text, Image, TouchableOpacity, Platform, StyleSheet } from 'react-native';
import { Avatar, Icon } from 'react-native-elements';  // For Avatar and Icons
import { useNavigation } from '@react-navigation/native';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

async function sendPushNotification(expoPushToken) {
  const message = {
    to: expoPushToken,
    sound: 'default',
    title: 'Original Title',
    body: 'And here is the body!',
    data: { someData: 'goes here' },
  };

  await fetch('https://exp.host/--/api/v2/push/send', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Accept-encoding': 'gzip, deflate',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(message),
  });
}

function handleRegistrationError(errorMessage) {
  alert(errorMessage);
  throw new Error(errorMessage);
}

export default function App() {
  const navigation = useNavigation();
  const date = new Date('2024-08-08T10:39:22');


  const [expoPushToken, setExpoPushToken] = useState("");
  const [channels, setChannels] = useState([]);
  const [notification, setNotification] = useState(undefined);
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    registerForPushNotificationsAsync().then(
      (token) => token && setExpoPushToken(token)
    );

    if (Platform.OS === "android") {
      Notifications.getNotificationChannelsAsync().then((value) => {
        console.log(value)
        setChannels(value ?? [])
        const channel_ID = createNotificationChannel();
      }
      );
    }
    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification);
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log(response);
      });

    return () => {
      notificationListener.current &&
        Notifications.removeNotificationSubscription(
          notificationListener.current
        );
      responseListener.current &&
        Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  const formatDate = (date) => {
    return `${date.toLocaleDateString()} at ${date.toLocaleTimeString()}`;
  };

  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "space-around",
      }}
    >
     {/* Back Navigation */}
     <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={styles.backButton}>Back</Text>
      </TouchableOpacity>
      <Text style={styles.header}>SpillDetect</Text>
      {/* <Text>Your expo push token: {expoPushToken}</Text> */}
      {/* <Text>{`Channels: ${JSON.stringify(
        channels.map((c) => c.id),
        null,
        2
      )}`}</Text> */}
      {/* <View style={{ alignItems: "center", justifyContent: "center" }}>
        <Text>
          Title: {notification && notification.request.content.title}{" "}
        </Text>
        <Text>Body: {notification && notification.request.content.body}</Text>
        <Text>
          Data:{" "}
          {notification && JSON.stringify(notification.request.content.data)}
        </Text>
      </View> */}
      {/* <Button
        title="Press to schedule a notification"
        onPress={async () => {
          await schedulePushNotification();
        }}
      />
       <Button
        title="Press to Send Notification"
        onPress={async () => {
          await sendPushNotification(expoPushToken);
        }}
      /> */}
      {/* Message Info */}
      <View style={styles.messageContainer}>
        {/* Avatar and Sender Info */}
        <Avatar
          rounded
          title="S"
          containerStyle={styles.avatar}
        />
        <View style={styles.messageInfo}>
          <Text style={styles.sender}>SpillDetect</Text>
          <Text style={styles.timestamp}>From SpillDetect on {formatDate(date)}</Text>
        </View>
      </View>

      {/* Message Content */}
      <Text style={styles.messageContent}>Spill detected on camera 1</Text>

      {/* Image */}
      <Image
        source={{ uri: 'https://example.com/spill-image.png' }}  // Replace with actual image source
        style={styles.spillImage}
      />

      {/* Action Icons */}
      <View style={styles.actionIcons}>
        <Icon name="share" type="feather" onPress={() => { /* Share action */ }} />
        <Icon name="delete" type="feather" onPress={() => { /* Delete action */ }} />
      </View>
    </View>
  );
}

async function schedulePushNotification() {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Hey! New Incident 📬",
      body: "Here is the notification body, Please check incident!",
      data: { data: "goes here", test: { test1: "more data" } },
      android: {
        channelId: channelId || 'default',
      },
    },
    trigger: { seconds: 2 },
  });
}

async function createNotificationChannel() {
  if (Platform.OS === 'android') {
    const apiLevel = Platform.constants.Version;
    console.log(`Android API Level: ${apiLevel}`);
    const channelId = await Notifications.setNotificationChannelAsync('default', {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
      sound: 'default',  // Set the sound for the channel
    });
    return channelId;
  }
  return null;
}

async function registerForPushNotificationsAsync() {
  let token;

  await createNotificationChannel();
  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      alert("Failed to get push token for push notification!");
      return;
    }
    // Learn more about projectId:
    // https://docs.expo.dev/push-notifications/push-notifications-setup/#configure-projectid
    // EAS projectId is used here.
    try {
      const projectId = "052fedec-c95e-4d82-90c3-dcfe1d18b6ef";
      if (!projectId) {
        throw new Error("Project ID not found");
      }
      try {
        const pushTokenString = (
          await Notifications.getExpoPushTokenAsync({
            projectId,
          })
        ).data;
        console.log(pushTokenString);
        return pushTokenString;
      } catch (e) {
        handleRegistrationError(`${e}`);
      }
      token = (
        await Notifications.getExpoPushTokenAsync({
          projectId,
        })
      ).data;
      console.log(token);
    } catch (e) {
      token = `${e}`;
    }
  } else {
    alert("Must use physical device for Push Notifications");
    handleRegistrationError("Must use physical device for push notifications");
  }

  return token;
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
    flex: 1,
  },
  backButton: {
    fontSize: 16,
    color: '#007AFF',
    marginBottom: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  messageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatar: {
    backgroundColor: '#007AFF',
  },
  messageInfo: {
    marginLeft: 12,
  },
  sender: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  timestamp: {
    fontSize: 14,
    color: '#888',
  },
  messageContent: {
    fontSize: 16,
    marginBottom: 16,
  },
  spillImage: {
    width: '100%',
    height: 200,
    marginBottom: 16,
  },
  actionIcons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
});