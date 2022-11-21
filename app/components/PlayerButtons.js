import React from "react";
import Icon from "react-native-vector-icons/Ionicons";

const PlayerButtons = (props) => {
  const { iconType, iconColor = "white" } = props;
  const getIconName = (type) => {
    switch (type) {
      case "PLAY":
        return "pause";
      case "PAUSE":
        return "play";
      case "NEXT":
        return "play-skip-forward";
      case "PREV":
        return "play-skip-back";
      case "RANDOM":
        return "shuffle";
      case "LOOP":
        return "repeat";
    }
  };
  return (
    <Icon name={getIconName(iconType)} color={iconColor} {...props}></Icon>
  );
};

export default PlayerButtons;
