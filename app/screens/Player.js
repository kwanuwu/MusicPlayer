import { MaterialCommunityIcons } from "@expo/vector-icons";
import Slider from "@react-native-community/slider";
import React, { useContext, useEffect, useState } from "react";
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} from "react-native";
import { convertTime } from "../components/AudioListItem";
import PlayerButtons from "../components/PlayerButtons";
import Screen from "../components/Screen";
import { AudioContext } from "../context/AudioProvider";
import {
  changeAudio,
  moveAudio,
  pause,
  selectAudio,
} from "../misc/audioController";
import color from "../misc/color";

const { width } = Dimensions.get("window");
const Player = () => {
  const [currentPosition, setCurrentPosition] = useState(0);
  const context = useContext(AudioContext);
  const { playbackPosition, playbackDuration, currentAudio } = context;
  const calculateSeekbar = () => {
    if(currentAudio.lastPosition) {
      return currentAudio.lastPosition / (currentAudio.duration*1000)
    }
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
    await selectAudio(context.currentAudio, context);
  };
  //next button
  const handleNext = async () => {
    await changeAudio(context, "next");
  };
  //previous button
  const handlePrevious = async () => {
    await changeAudio(context, "previous");
  };
  //handle random button
  const handleRandom = () => {
    context.isLooping = false;
    if (context.isRandom === true) {
      context.isRandom = false;
      return context.updateState(context, {
        isLooping: context.isLooping,
        isRandom: context.isRandom,
      });
    } else {
      context.isRandom = true;
      return context.updateState(context, {
        isLooping: context.isLooping,
        isRandom: context.isRandom,
      });
    }
  };
  //hanlde loop button
  const handleLoop = async () => {
    context.isRandom = false;
    if (context.isLooping === true) {
      context.isLooping = false;
      return context.updateState(context, {
        isLooping: context.isLooping,
        isRandom: context.isRandom,
      });
    } else {
      context.isLooping = true;
      return context.updateState(context, {
        isLooping: context.isLooping,
        isRandom: context.isRandom,
      });
    }
  };
const renderCurrentTime  = () => {
  if(!context.soundObj && currentAudio.lastPosition) {
    return msToTime(currentAudio.lastPosition) + ' / ' + convertTime(context.currentAudio.duration)
  }
  return msToTime(context.playbackPosition) + ' / ' + convertTime(context.currentAudio.duration)
}
  return (
    <Screen>
      <View style={styles.container}>
        <View style={styles.audioCountContainer}>
          <View style={{ flexDirection: "row" }}>
            {context.isPlayListRunning && (
              <>
                <Text style={{ fontWeight: "bold" }}>From Playlist: </Text>
                <Text>{context.activePlayList.title}</Text>
              </>
            )}
          </View>
          <Text style={styles.audioCount}>
            {`${context.currentAudioIndex + 1} / ${context.totalAudioCount}`}
          </Text>
        </View>
        <View style={styles.midBannerContainer}>
          <MaterialCommunityIcons
            name="music-circle"
            size={340}
            color={context.isPlaying ? color.ACTIVE_BG : color.FONT_MEDIUM}
          />
        </View>
        <View style={styles.audioPlayerContainer}>
          <Text numberOfLines={1} style={styles.audioTitle}>
            {context.currentAudio.filename.split("-FLAC", 1)}
          </Text>
          <Text style={styles.timeDurationContainer}>
            {renderCurrentTime()}
          </Text>
          <Slider
            style={{ width: width, height: 40 }}
            minimumValue={0}
            maximumValue={1}
            value={calculateSeekbar()}
            minimumTrackTintColor={color.FONT_MEDIUM}
            maximumTrackTintColor={color.ACTIVE_BG}
            onValueChange={(value) => {
              setCurrentPosition(
                msToTime(value * context.currentAudio.duration * 1000)
              );
            }}
            onSlidingStart={async () => {
              if (context.isPlaying) return;
              try {
                await pause(context.playbackObj);
              } catch (error) {
                console.log("slide error");
              }
            }}
            onSlidingComplete={async (value) => {
              await moveAudio(context, value);
              setCurrentPosition(0);
            }}
          />
          <View style={styles.audioControllers}>
            <TouchableHighlight
              onPress={handleRandom}
              activeOpacity={0.5}
              underlayColor={color.MODAL_BG}
              style={{ borderRadius: 40 }}
            >
              <PlayerButtons
                iconType="RANDOM"
                size={32}
                color={context.isRandom ? "blue" : "black"}
                style={{ padding: 20 }}
              ></PlayerButtons>
            </TouchableHighlight>
            <TouchableHighlight
              onPress={handlePrevious}
              activeOpacity={0.5}
              underlayColor={color.MODAL_BG}
              style={{ borderRadius: 40 }}
            >
              <PlayerButtons
                iconType="PREV"
                size={30}
                style={{ padding: 20 }}
              />
            </TouchableHighlight>
            <TouchableHighlight
              onPress={handlePlayPause}
              activeOpacity={0.5}
              underlayColor={color.MODAL_BG}
              style={{ borderRadius: 40 }}
            >
              <PlayerButtons
                size={35}
                style={{ padding: 20 }}
                iconType={context.isPlaying ? "PLAY" : "PAUSE"}
              ></PlayerButtons>
            </TouchableHighlight>
            <TouchableHighlight
              onPress={handleNext}
              activeOpacity={0.5}
              underlayColor={color.MODAL_BG}
              style={{ borderRadius: 40 }}
            >
              <PlayerButtons
                size={30}
                iconType="NEXT"
                style={{ padding: 20 }}
              ></PlayerButtons>
            </TouchableHighlight>
            <TouchableHighlight
              onPress={handleLoop}
              activeOpacity={0.5}
              underlayColor={color.MODAL_BG}
              style={{ borderRadius: 40 }}
            >
              <PlayerButtons
                iconType="LOOP"
                size={32}
                color={context.isLooping ? "blue" : "black"}
                style={{ padding: 20 }}
              ></PlayerButtons>
            </TouchableHighlight>
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
  audioCountContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 15,
  },
  audioCount: {
    textAlign: "right",
    color: color.FONT_LIGHT,
    fontSize: 14,
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
  button: {
    alignItems: "center",
    backgroundColor: "#DDDDDD",
    padding: 10,
  },
});
export default Player;
