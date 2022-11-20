import { DefaultTheme, NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import React from "react";
import AudioProvider from "./app/context/AudioProvider";
import { AppContext } from './app/context/AppProvider';
import color from "./app/misc/color";
import AppNavigator from "./app/navigation/AppNavigator";
import { useContext } from 'react';
import { StatusBar } from 'react-native';
import Login from './app/screens/Login';
import Register from './app/screens/Register';

const MyTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: color.APP_BG,
  }
}

export default function Index() {
  const appContext = useContext(AppContext);
  console.log(appContext);
  const Stack = createNativeStackNavigator();

  return (
    <AudioProvider>
    <NavigationContainer theme = {MyTheme}>
    <StatusBar showHideTransition="true" />
        {!appContext.loggedIn ? (
        <>
            <Stack.Navigator
            initialRouteName="Login"
            screenOptions={{
                headerShown: false,
            }}
            >
            <Stack.Screen name="Register" component={Register} />
            <Stack.Screen name="Login" component={Login} />
            </Stack.Navigator>
        </>
        ) : (
        <AppNavigator />
        )}
    </NavigationContainer>
    </AudioProvider>
  );
}