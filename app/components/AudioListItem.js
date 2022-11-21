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
export const convertTime = (duration) => {
  var hrs = ~~(duration / 3600);
  var mins = ~~((duration % 3600) / 60);
  var secs = ~~duration % 60;
  var ret = "";
  if (hrs > 0) {
    ret += "" + hrs + ":" + (mins < 10 ? "0" : "");
  }
  ret += "" + mins + ":" + (secs < 10 ? "0" : "");
  ret += "" + secs;
  return ret;
};
const renderPlayPauseIcon = (isPlaying) => {
  if (isPlaying)
    return (
      <Entypo name="controller-paus" size={27} color={color.ACTIVE_FONT} />
    );
  return <Entypo name="controller-play" size={27} color={color.ACTIVE_FONT} />;
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
                backgroundColor: activeListItem ? "#4ecda4" : "white",
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
          color="white"
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
    borderColor: "grey",
    borderWidth: 1,
    borderRadius: 13,
    marginBottom: 10,
  },
  leftContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  rightContainer: {
    flexBasis: 70,
    height: 70,
    alignItems: "center",
    justifyContent: "center",
  },
  thumbnail: {
    height: 70,
    flexBasis: 70,
    justifyContent: "center",
    alignItems: "center",
  },
  thumbnailText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "black",
  },
  titleContainer: {
    width: width - 180,
    paddingLeft: 10,
  },
  title: {
    fontSize: 16,
    color: "white",
  },
  timeText: {
    fontSize: 14,
    color: "white",
  },
});
export default AudioListItem;
