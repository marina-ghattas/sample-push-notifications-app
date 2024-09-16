import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import SpillDetectScreen from "./screens/DetectionDetails"; // Import your screen component
import IncidentListScreen from "./screens/DetectionsList";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { Platform } from 'react-native';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

function handleRegistrationError(errorMessage) {
  alert(errorMessage);
  throw new Error(errorMessage);
}

const Stack = createStackNavigator();

export default function App() {
  const [expoPushToken, setExpoPushToken] = React.useState("");
  const [channels, setChannels] = React.useState([]);
  const [notification, setNotification] = React.useState(undefined);
  const notificationListener = React.useRef();
  const responseListener = React.useRef();
  const navigationRef = React.useRef();

  React.useEffect(() => {
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
        console.log("RESPONSE",response.notification.request.content.data);
         // Ensure the navigation exists
         const incidentData = response.notification.request.content.data.incident;
         if (navigationRef.current) {
          console.log("REDIRECT")
          navigationRef.current.navigate('SpillDetect', {
            incident: incidentData,  // Pass the incident data to the SpillDetectScreen
          });
        }
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

  return (
    <NavigationContainer  ref={navigationRef}>
      <Stack.Navigator initialRouteName="IncidentList">
        <Stack.Screen name="IncidentList" component={IncidentListScreen} />
        <Stack.Screen name="SpillDetect" component={SpillDetectScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
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

  const channel =  await createNotificationChannel();
  console.log("channel" , channel)
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
        console.log("pushTokenString" ,pushTokenString);
        return pushTokenString;
      } catch (e) {
        handleRegistrationError(`${e}`);
      }
      token = (
        await Notifications.getExpoPushTokenAsync({
          projectId,
        })
      ).data;
      console.log("token",token);
    } catch (e) {
      token = `${e}`;
    }
  } else {
    alert("Must use physical device for Push Notifications");
    handleRegistrationError("Must use physical device for push notifications");
  }

  return token;
}

