// App.js
import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import SpillDetectScreen from "./screens/DetectionDetails"; // Import your screen component
import IncidentListScreen from "./screens/DetectionsList";

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="IncidentList">
        <Stack.Screen name="IncidentList" component={IncidentListScreen} />
        <Stack.Screen name="SpillDetect" component={SpillDetectScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
