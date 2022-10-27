import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import React from "react";
import { Entypo } from "@expo/vector-icons";
import color from "../misc/color";
const getThumbnailText = (filename) => filename[0];
export const convertTime = (minutes) => {
  if (minutes) {
    const hrs = minutes / 60;
    const minute = hrs.toString().split(".")[0];
    const percent = parseInt(hrs.toString().split(".")[1].slice(0, 2));
    const sec = Math.ceil((60 * percent) / 100);

    if (parseInt(minute) < 10 && sec < 10) {
      return `0${minute}:0${sec}`;
    }
    if(sec == 60) {
      return `${minute+1}:00`;
    }
    if (parseInt(minute) < 10) {
      return `0${minute}:${sec}`;
    }
    ``;
    if (sec < 10) {
      return `${minute}:0${sec}`;
    }
    return `${minute}:${sec}`;
  }
};
const renderPlayPauseIcon = (isPlaying) => {
  if (isPlaying)
    return (
      <Entypo name="controller-paus" size={24} color={color.ACTIVE_FONT} />
    );
  return <Entypo name="controller-play" size={24} color={color.ACTIVE_FONT} />;
};
const AudioListItem = ({
  title,
  duration,
  onOptionPress,
  onAudioPress,
  isPlaying,
  activeListItem,
}) => {
  return (
      <View style={styles.container}>
        <TouchableWithoutFeedback onPress={onAudioPress}>
          <View style={styles.leftContainer}>
            <View
              style={[
                styles.thumbnail,
                {
                  borderRadius: 12,
                  backgroundColor: activeListItem
                    ? '#4ecda4'
                    : color.FONT_LIGHT,
                },
              ]}
            >
              <Text style={styles.thumbnailText}>
                {activeListItem
                  ? renderPlayPauseIcon(isPlaying)
                  : getThumbnailText(title)}
              </Text>
            </View>
            <View style={styles.titleContainer}>
              <Text numberOfLines={1} style={styles.title}>
                {title.split("-FLAC", 1)}
              </Text>
              <Text style={styles.timeText}>{convertTime(duration)}</Text>
            </View>
          </View>
        </TouchableWithoutFeedback>
        <View style={styles.rightContainer}>
          <Entypo
            onPress={onOptionPress}
            name="dots-three-vertical"
            size={20}
            color= 'white'
            style={{ padding: 10 }}
          />
        </View>
      </View>
  );
};
const { width } = Dimensions.get("window");
const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignSelf: "center",
    width: width - 30,
    backgroundColor: "#525a67",
    borderColor: 'grey',
    borderWidth: 1,
    borderRadius: 13,
  },
  leftContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  rightContainer: {
    flexBasis: 60,
    height: 60,
    alignItems: "center",
    justifyContent: "center",
  },
  thumbnail: {
    height: 60,
    flexBasis: 60,
    justifyContent: "center",
    alignItems: "center",
  },
  thumbnailText: {
    fontSize: 22,
    fontWeight: "bold",
    color: 'white',
  },
  titleContainer: {
    width: width - 180,
    paddingLeft: 10,
  },
  title: {
    fontSize: 16,
    color: 'white',
  },
  timeText: {
    fontSize: 14,
    color: 'white',
  },
});
export default AudioListItem;
