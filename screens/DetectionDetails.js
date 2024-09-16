// SpillDetectScreen.js
import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet , Alert  } from 'react-native';
import { Avatar } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';

const SpillDetectScreen = ({ route }) => {
  const navigation = useNavigation();
  const { incident } = route.params;
  
  const formatDate = (date) => {
    const dt = new Date(date)
    return `${dt.toLocaleDateString()} at ${dt.toLocaleTimeString()}`;
  };

  const acknowledgeIncident = () => {
    Alert.alert('Incident Acknowledged', 'You have acknowledged this incident.', [
      {
        text: 'OK',
        onPress: () => navigation.goBack(),
      },
    ]);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      {/* <Text style={styles.header}>Incident Details</Text> */}

      {/* Message Info */}
      <View style={styles.messageContainer}>
        <Avatar
          rounded
          title="S"
          containerStyle={styles.avatar}
        />
        <View style={styles.messageInfo}>
          <Text style={styles.sender}>SpillDetect</Text>
          <Text style={styles.timestamp}>From SpillDetect on {formatDate(incident.date)}</Text>
        </View>
      </View>

      {/* Message Content */}
      <Text style={styles.messageContent}>{incident.title}</Text>

      {/* Image */}
      <Image
        source={{ uri: incident.imageUrl }}
        style={styles.spillImage}
      />

       {/* Acknowledge Button */}
       <TouchableOpacity style={styles.acknowledgeButton} onPress={acknowledgeIncident}>
        <Text style={styles.acknowledgeButtonText}>Acknowledge Incident</Text>
      </TouchableOpacity>
    </View>
  );
};

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
    backgroundColor: '#16afca',
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
    height: 250,
    objectFit: 'fill',
    marginBottom: 16,
    borderRadius: 4,
  },
  actionIcons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  acknowledgeButton: {
    backgroundColor: '#16afca',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  acknowledgeButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default SpillDetectScreen;
