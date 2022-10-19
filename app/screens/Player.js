import { Text, View, StyleSheet, Dimensions } from "react-native";
import React, { useContext, useEffect } from "react";
import Screen from "../components/Screen";
import color from "../misc/color";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Slider from "@react-native-community/slider";
import PlayerButtons from "../components/PlayerButtons";
import { AudioContext } from "../context/AudioProvider";
import { convertTime } from "../components/AudioListItem";
import { changeAudio, pause, play, playNextSong, resume, selectAudio } from "../misc/audioController";
import { storeAudioForNextOpening } from "../misc/helper";

const { width } = Dimensions.get("window");
const Player = () => {
  const context = useContext(AudioContext);
  const { playbackPosition, playbackDuration } = context;
  const calculateSeekbar = () => {
    if (playbackPosition !== null && playbackDuration !== null) {
      return playbackPosition / playbackDuration;
    }
    return 0;
  };
  useEffect(() => {
    context.loadPreviousAudio();
  }, []);
  if (!context.currentAudio) return null;
  //convert millis to minutes and second
  const msToTime = (duration) => {
    var milliseconds = Math.floor((duration % 1000) / 100),
      seconds = Math.floor((duration / 1000) % 60),
      minutes = Math.floor((duration / (1000 * 60)) % 60),
      hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

    hours = hours < 10 ? "0" + hours : hours;
    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;

    return minutes + ":" + seconds;
  };
  //handle play/pause button
  const handlePlayPause = async () => {
    await selectAudio(context.currentAudio, context)
  };
  //next button
  const handleNext = async () => {
    await changeAudio(context, 'next')
  };
  //previous button
  const handlePrevious = async () => {
    await changeAudio(context, 'previous')
  };
//handle random button
  const handleRandom = () => {
    context.isLooping = false;
  if(context.isRandom === true) {
    context.isRandom = false;
    return context.updateState(context, {
      isLooping: context.isLooping,
      isRandom: context.isRandom,
    })
  } else {
    context.isRandom = true
    return context.updateState(context, {
      isLooping: context.isLooping,
      isRandom: context.isRandom,
    })
  };
}
//hanlde loop button
  const handleLoop = async () => {
  context.isRandom = false;
  if(context.isLooping === true) {
    context.isLooping = false;
    return context.updateState(context, {
      isLooping: context.isLooping,
      isRandom: context.isRandom,
    })
  } else {
    context.isLooping = true
    return context.updateState(context, {
      isLooping: context.isLooping,
      isRandom: context.isRandom,
    })
  }
  };

  return (
    <Screen>
      <View style={styles.container}>
        <Text style={styles.audioCount}>{`${context.currentAudioIndex + 1}/${
          context.totalAudioCount
        }`}</Text>
        <View style={styles.midBannerContainer}>
          <MaterialCommunityIcons
            name="music-circle"
            size={340}
            color={context.isPlaying ? color.ACTIVE_BG : color.FONT_MEDIUM}
          />
        </View>
        <View style={styles.audioPlayerContainer}>
          <Text numberOfLines={1} style={styles.audioTitle}>
            {context.currentAudio.filename.split("-FLAC",1)}
          </Text>
          <Text style={styles.timeDurationContainer}>
            {msToTime(playbackPosition)} / {msToTime(playbackDuration)}
          </Text>
          <Slider
            style={{ width: width, height: 40 }}
            minimumValue={0}
            maximumValue={1}
            value={calculateSeekbar()}
            minimumTrackTintColor={color.FONT_MEDIUM}
            maximumTrackTintColor={color.ACTIVE_BG}
          />
          <View style={styles.audioControllers}>
            <PlayerButtons
              onPress={handleRandom}
              iconType="RANDOM"
              style={{ marginHorizontal: 30 }}
            ></PlayerButtons>
            <PlayerButtons
              onPress={handlePrevious}
              iconType="PREV"
            ></PlayerButtons>
            <PlayerButtons
              onPress={handlePlayPause}
              style={{ marginHorizontal: 30 }}
              iconType={context.isPlaying ? "PLAY" : "PAUSE"}
            ></PlayerButtons>
            <PlayerButtons onPress={handleNext} iconType="NEXT"></PlayerButtons>
            <PlayerButtons
              onPress={handleLoop}
              iconType="LOOP"
              style={{ marginHorizontal: 30 }}
            ></PlayerButtons>
          </View>
        </View>
      </View>
    </Screen>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  audioCount: {
    textAlign: "right",
    padding: 15,
    color: color.FONT_LIGHT,
    fontSize: 40,
  },
  midBannerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  audioTitle: {
    fontSize: 16,
    color: color.FONT,
    padding: 15,
  },
  audioControllers: {
    width: width,
    flexDirection: "row",
    alignItems: "center",
    paddingBottom: 20,
    justifyContent: "center",
  },
  timeDurationContainer: {
    textAlign: "right",
    paddingEnd: 20,
  },
});
export default Player;
