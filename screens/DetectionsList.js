// IncidentListScreen.js
import React from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
} from "react-native";
import { Avatar } from "react-native-elements";
import { useNavigation } from "@react-navigation/native";

const incidents = [
  {
    id: "1",
    title: "Spill detected on camera 1",
    time: "10:39",
    imageUrl:
      "https://www.shutterstock.com/image-photo/coffee-spill-blue-cup-on-600nw-2225868539.jpg",
    date: new Date("2024-08-08T10:39:22"),
  },
  {
    id: "2",
    title: "Spill detected on camera 1",
    time: "10:37",
    imageUrl:
      "https://media.istockphoto.com/id/1167989563/photo/coffee.jpg?s=612x612&w=0&k=20&c=rwu1w-KTztd7AtN57bTkJn2w5mxsgUnVUHYmmXTIh9M=",
    date: new Date("2024-08-08T10:37:00"),
  },
];

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
    borderRadius: 8,
  },
});

export default IncidentListScreen;
