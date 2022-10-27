import { DefaultTheme, NavigationContainer } from "@react-navigation/native";
import React from "react";
import AudioProvider from "./app/context/AudioProvider";
import color from "./app/misc/color";
import AppNavigator from "./app/navigation/AppNavigator";

const MyTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: color.APP_BG,
  }
}

export default function App() {
  return (
    <AudioProvider>
      <NavigationContainer theme = {MyTheme}>
        <AppNavigator />
      </NavigationContainer>
    </AudioProvider>
  );
}
