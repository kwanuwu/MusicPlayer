import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { AntDesign } from "@expo/vector-icons";
import color from "../misc/color";

const PlayerButtons = (props) => {
  const { iconType, size = 40, iconColor = "black", onPress } = props;
  const getIconName = (type) => {
    switch (type) {
      case "PLAY":
        return "pausecircleo";
      case "PAUSE":
        return "playcircleo";
      case "NEXT":
        return "rightcircleo";
      case "PREV":
        return "leftcircleo";
      case "RANDOM":
        return "swap";
      case "LOOP":
        return "retweet";
    }
  };
  return (
    <AntDesign
      onPress={onPress}
      name={getIconName(iconType)}
      size={size}
      color={iconColor}
      {...props}
    ></AntDesign>
  );
};

export default PlayerButtons;
