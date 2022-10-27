import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React from "react";
import AudioList from "../screens/AudioList";
import Player from "../screens/Player";
import PlayList from "../screens/PlayList";
import { Feather } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import { createStackNavigator } from "@react-navigation/stack";
import PlayListDetail from "../screens/PlayListDetail";
const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();


const PlayListScreen = () => {
return <Stack.Navigator screenOptions={{headerShown: false}}>
  <Stack.Screen name = 'PlayList' component={PlayList}></Stack.Screen>
  <Stack.Screen name = 'PlayListDetail' component={PlayListDetail}></Stack.Screen>
</Stack.Navigator>

}
const AppNavigator = () => {
  return (
    <Tab.Navigator  screenOptions={({ route }) => ({
      tabBarIcon: ({ color }) => screenOptions(route, color),
      headerShown: false,
      tabBarActiveTintColor: '#4ECCA3',
      tabBarInactiveTintColor:'white',
      tabBarStyle: {borderTopWidth: 0,
      backgroundColor: '#232a32'},
      detachInactiveTabs: true,
      tabBarLabelStyle: { fontSize: 12 },
      tabBarHideOnKeyboard: true,
    })}>
      <Tab.Screen
        name="AudioList"
        component={AudioList}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Feather name="headphones" size={size} color={color} />
          ),
        }}
      ></Tab.Screen>
      <Tab.Screen
        name="Player"
        component={Player}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Feather name="music" size={size} color={color} />
          ),
        }}
      ></Tab.Screen>
      <Tab.Screen
        name="Playlist"
        component={PlayListScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Entypo name="folder-music" size={size} color={color} />
          ),
        }}
      ></Tab.Screen>
    </Tab.Navigator>
  );
};

export default AppNavigator;
