import { Text, View, Alert } from "react-native";
import React, { Component, createContext } from "react";
import * as MediaLibrary from "expo-media-library";
import { DataProvider } from "recyclerlistview";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Audio } from "expo-av";
import { playNextSong } from "../misc/audioController";
import { storeAudioForNextOpening } from "../misc/helper";
export const AudioContext = createContext();
export class AudioProvider extends Component {
  constructor(props) {
    super(props);
    this.state = {
      audioFiles: [],
      permissionErr: false,
      dataProvider: new DataProvider((r1, r2) => r1 !== r2),
      playbackObj: null,
      soundObj: null,
      currentAudio: {},
      isPlaying: false,
      currentAudioIndex: null,
      playbackPosition: null,
      playbackDuration: null,
    };
    this.totalAudioCount = 0;
  }

  permissionAlert = () => {
    Alert.alert("Permission Required", "This app needs to read audio", [
      {
        text: "Yes",
        onPress: () => this.getPermission(),
      },
      {
        text: "No",
        onPress: () => this.permissionAlert(),
      },
    ]);
  };

  getAudioFiles = async () => {
    const { dataProvider, audioFiles } = this.state;
    let media = await MediaLibrary.getAssetsAsync({
      mediaType: "audio",
    });
    media = await MediaLibrary.getAssetsAsync({
      mediaType: "audio",
      first: media.totalCount,
    });
    this.totalAudioCount = media.totalCount;
    this.setState({
      ...this.state,
      dataProvider: dataProvider.cloneWithRows([
        ...audioFiles,
        ...media.assets,
      ]),
      audioFiles: [...audioFiles, ...media.assets],
    });
  };

  loadPreviousAudio = async () => {
    let previousAudio = await AsyncStorage.getItem("previousAudio");
    let currentAudio;
    let currentAudioIndex;

    if (previousAudio === null) {
      currentAudio = this.state.audioFiles[0];
      currentAudioIndex = 0;
    } else {
      previousAudio = JSON.parse(previousAudio);
      currentAudio = previousAudio.audio;
      currentAudioIndex = previousAudio.index;
    }
    this.setState({ ...this.state, currentAudio, currentAudioIndex });
  };

  //get permission from user when mount music from device
  getPermission = async () => {
    //   {
    //   "canAskAgain": true,
    //   "expires": "never",
    //   "granted": false,
    //   "status": "undetermined"
    //  }
    const permission = await MediaLibrary.getPermissionsAsync();
    //when user allow access
    if (permission.granted) {
      // get all the audio files
      this.getAudioFiles();
    }
    if (!permission.canAskAgain && !permission.granted) {
      this.setState({ ...this.state, permissionErr: true });
    }
    //when user doesn't allow access
    if (!permission.granted && permission.canAskAgain) {
      const { status, canAskAgain } =
        await MediaLibrary.requestPermissionsAsync();
      if (status === "denied" && canAskAgain) {
        //display alert that user must allow this permission to work
        this.permissionAlert();
      }
      if (status === "granted") {
        // get all the audio files
        this.getAudioFiles();
      }
      if (status === "denied" && !canAskAgain) {
        // error cant get audio files and not display alert again
        this.setState({ ...this.state, permissionErr: true });
      }
    }
  };

  onPlaybackStatusUpdate = async (playbackStatus) => {
    if (playbackStatus.isLoaded && playbackStatus.isPlaying) {
      this.updateState(this, {
        playbackPosition: playbackStatus.positionMillis,
        playbackDuration: playbackStatus.durationMillis,
      });
    }

    //play next song when playing song is finished
    if (playbackStatus.didJustFinish) {
      const nextAudioIndex = this.state.currentAudioIndex + 1;
      // const nextAudioIndex = Math.floor(Math.random()*Number(this.context.totalAudioCount));
      if (nextAudioIndex >= this.totalAudioCount) {
        this.playbackObj.unloadAsync();
        this.updateState(this, {
          soundObj: null,
          currentAudio: this.state.audioFiles[0],
          isPlaying: false,
          currentAudioIndex: 0,
          playbackPosition: null,
          playbackDuration: null,
        });
        return await storeAudioForNextOpening(this.state.audioFiles[0], 0);
      }
      const audio = this.state.audioFiles[nextAudioIndex];
      const status = await playNextSong(this.state.playbackObj, audio.uri);
      this.updateState(this, {
        soundObj: status,
        currentAudio: audio,
        isPlaying: true,
        currentAudioIndex: nextAudioIndex,
      });
      await storeAudioForNextOpening(audio, nextAudioIndex);
    }
    //play random song
    // if(playbackStatus.didJustFinish) {
    //   const nextAudioIndex = Math.floor(Math.random()*Number(this.context.totalAudioCount));
    //   const audio = this.context.audioFiles[nextAudioIndex];
    // const status = await playNextSong(this.context.playbackObj, audio.uri)
    // this.context.updateState(this.state, {
    //   soundObj: status,
    //   currentAudio: audio,
    //   isPlaying: true,
    //   currentAudio: nextAudioIndex,
    // });
    // }
  };

  componentDidMount() {
    this.getPermission();
    if (this.state.playbackObj === null) {
      this.setState({ ...this.state, playbackObj: new Audio.Sound() });
    }
  }
  updateState = (preState, newState = {}) => {
    this.setState({ ...preState, ...newState });
  };
  render() {
    const {
      audioFiles,
      dataProvider,
      permissionErr,
      playbackObj,
      soundObj,
      currentAudio,
      isPlaying,
      currentAudioIndex,
      playbackDuration,
      playbackPosition,
    } = this.state;
    if (permissionErr)
      return (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text style={{ fontSize: 25, textAlign: "center", color: "black" }}>
            There was no permission to access audio
          </Text>
        </View>
      );
    return (
      <AudioContext.Provider
        value={{
          audioFiles,
          dataProvider,
          playbackObj,
          soundObj,
          currentAudio,
          isPlaying,
          currentAudioIndex,
          totalAudioCount: this.totalAudioCount,
          playbackDuration,
          playbackPosition,
          updateState: this.updateState,
          loadPreviousAudio: this.loadPreviousAudio,
          onPlaybackStatusUpdate: this.onPlaybackStatusUpdate,
        }}
      >
        {this.props.children}
      </AudioContext.Provider>
    );
  }
}

export default AudioProvider;
