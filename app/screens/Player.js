import { Text, View, StyleSheet, Dimensions } from "react-native";
import React, { useContext, useEffect } from "react";
import Screen from "../components/Screen";
import color from "../misc/color";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Slider from "@react-native-community/slider";
import PlayerButtons from "../components/PlayerButtons";
import { AudioContext } from "../context/AudioProvider";
import { convertTime } from "../components/AudioListItem";
import { pause, play, playNextSong, resume } from "../misc/audioController";
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
    //play
    if (context.soundObj === null) {
      const audio = context.currentAudio;
      const status = await play(context.playbackObj, audio.uri);
      context.playbackObj.setOnPlaybackStatusUpdate(
        context.onPlaybackStatusUpdate
      );
      return context.updateState(context, {
        soundObj: status,
        currentAudio: audio,
        isPlaying: true,
        currentAudioIndex: context.currentAudioIndex,
      });
    }
    //pause
    if (context.soundObj && context.soundObj.isPlaying) {
      const status = await pause(context.playbackObj);
      return context.updateState(context, {
        soundObj: status,
        isPlaying: false,
      });
    }
    //resume
    if (context.soundObj && !context.soundObj.isPlaying) {
      const status = await resume(context.playbackObj);
      return context.updateState(context, {
        soundObj: status,
        isPlaying: true,
      });
    }
  };
  //next button
  const handleNext = async () => {
    const { isLoaded } = await context.playbackObj.getStatusAsync();
    const isLastAudio =
      context.currentAudioIndex + 1 === context.totalAudioCount;
    let audio = context.audioFiles[context.currentAudioIndex + 1];
    let index;
    let status;
    if (!isLoaded && !isLastAudio) {
      index = context.currentAudioIndex + 1;
      status = await play(context.playbackObj, audio.uri);
    }

    if (isLoaded && !isLastAudio) {
      index = context.currentAudioIndex + 1;
      status = await playNextSong(context.playbackObj, audio.uri);
    }

    if (isLastAudio) {
      index = 0;
      audio = context.audioFiles[index];
      if (isLoaded) {
        status = await playNextSong(context.playbackObj, audio.uri);
      } else {
        status = await play(context.playbackObj, audio.uri);
      }
    }

    context.updateState(context, {
      soundObj: status,
      currentAudio: audio,
      playbackObj: context.playbackObj,
      isPlaying: true,
      currentAudioIndex: index,
      playbackPosition: null,
      playbackDuration: null,
    });
    storeAudioForNextOpening(audio, index);
  };
  //previous button
  const handlePrevious = async () => {
    const { isLoaded } = await context.playbackObj.getStatusAsync();
    const isFirstAudio = context.currentAudioIndex <= 0;
    let audio = context.audioFiles[context.currentAudioIndex - 1];
    let index;
    let status;
    if (!isLoaded && !isFirstAudio) {
      index = context.currentAudioIndex - 1;
      status = await play(context.playbackObj, audio.uri);
    }

    if (isLoaded && !isFirstAudio) {
      index = context.currentAudioIndex - 1;
      status = await playNextSong(context.playbackObj, audio.uri);
    }

    if (isFirstAudio) {
      index = context.totalAudioCount - 1;
      audio = context.audioFiles[index];
      if (isLoaded) {
        status = await playNextSong(context.playbackObj, audio.uri);
      } else {
        status = await play(context.playbackObj, audio.uri);
      }
    }

    context.updateState(context, {
      soundObj: status,
      currentAudio: audio,
      playbackObj: context.playbackObj,
      isPlaying: true,
      currentAudioIndex: index,
      playbackPosition: null,
      playbackDuration: null,
    });
    storeAudioForNextOpening(audio, index);
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
            {context.currentAudio.filename}
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
