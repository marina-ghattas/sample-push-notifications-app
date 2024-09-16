// IncidentListScreen.js
import React from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  Button,
} from "react-native";
import { Avatar } from "react-native-elements";
import { useNavigation } from "@react-navigation/native";

const incidents = [
  {
    id: "3",
    title: "Camera 1",
    date: "2024-08-08T10:37:00Z",
    time: "13:37",
    imageUrl:
      "https://live.staticflickr.com/65535/49431031126_3d33ee9895_b.jpg",
  },
  {
    id: "1",
    title: "Camera 1",
    time: "10:39",
    imageUrl:
      "https://townsquare.media/site/48/files/2013/03/2013-03-11_19-59-24_38.jpg",
    date: "2024-08-08T10:39:00",
  },
  {
    id: "2",
    title: "Camera 2",
    time: "10:37",
    imageUrl:
      "https://media.istockphoto.com/id/916083808/photo/close-up.jpg?s=612x612&w=0&k=20&c=Ek55rfN6_d4rn8C9BrwfkUvGNenQBNi5S-EqjDUBQs0=",
    date: "2024-08-08T10:37:00",
  },
];

const sendPushNotification = async (expoPushToken) => {
  const message = {
    to: expoPushToken,
    sound: 'default',
    title: 'New Notification',
    body: 'This is a test notification',
    data: { incident: {
      title: 'Notified Incident'
    } },
  };

  await fetch('https://exp.host/--/api/v2/push/send', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(message),
  });
};

const IncidentListScreen = () => {
  const navigation = useNavigation();

  const renderIncident = ({ item }) => (
    <TouchableOpacity
      style={styles.incidentContainer}
      onPress={() => navigation.navigate("SpillDetect", { incident: item })}
    >
      <View style={styles.messageContainer}>
        <Avatar rounded title="S" containerStyle={styles.avatar} />
        <View style={styles.messageInfo}>
          <Text style={styles.sender}>SpillDetect</Text>
          <Text style={styles.title}>{item.title}</Text>
        </View>
        <Text style={styles.time}>{item.time}</Text>
      </View>
      <Image source={{ uri: item.imageUrl }} style={styles.image} />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Open Incidents</Text>
    
      <FlatList
        data={incidents}
        keyExtractor={(item) => item.id}
        renderItem={renderIncident}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#fff",
    flex: 1,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  incidentContainer: {
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    paddingBottom: 16,
  },
  messageContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  avatar: {
    backgroundColor: "#16afca",
  },
  messageInfo: {
    marginLeft: 12,
    flex: 1,
  },
  sender: {
    fontSize: 18,
    fontWeight: "bold",
  },
  title: {
    fontSize: 16,
    color: "#555",
  },
  time: {
    fontSize: 14,
    color: "#888",
  },
  image: {
    width: "100%",
    height: 200,
    objectFit: "cover",
    borderRadius: 4,
  },
});

export default IncidentListScreen;
