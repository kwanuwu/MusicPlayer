import { NavigationContainer } from "@react-navigation/native";
import AppNavigator from "./app/navigation/AppNavigator";
import React from "react";
import { StatusBar, View } from "react-native";
import AudioProvider from "./app/context/AudioProvider";
import AudioListItem from "./app/components/AudioListItem";
export default function App() {
  return (
  <AudioProvider >
    <NavigationContainer>
    <AppNavigator />
  </NavigationContainer>
  </AudioProvider>
  );
}