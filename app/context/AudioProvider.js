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
      playList: [],
      addToPlayList: null,
      permissionErr: false,
      dataProvider: new DataProvider((r1, r2) => r1 !== r2),
      playbackObj: null,
      soundObj: null,
      currentAudio: {},
      isPlaying: false,
      isLooping: false,
      isRandom: false,
      isPlayListRunning: false,
      activePlayList: [],
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

  componentDidMount() {
    this.getPermission();
    if (this.state.playbackObj === null) {
      this.setState({ ...this.state, playbackObj: new Audio.Sound() });
    }
  }

  loadPreviousAudio = async () => {
    let previousAudio = await AsyncStorage.getItem("previousAudio");
    let currentAudio;
    let currentAudioIndex;
    let lastActivePlaylist;

    if (previousAudio === null) {
      currentAudio = this.state.audioFiles[0];
      currentAudioIndex = 0;
    } else {
      previousAudio = JSON.parse(previousAudio);
      currentAudio = previousAudio.audio;
      currentAudioIndex = previousAudio.index;

    }
    this.setState({ ...this.state, currentAudio, currentAudioIndex});
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

    if (playbackStatus.isLoaded && !playbackStatus.isPlaying) {
      storeAudioForNextOpening(
        this.state.currentAudio,
        this.state.currentAudioIndex,
        playbackStatus.positionMillis,
      );
    }
    //play next song when playing song is finished
    if (playbackStatus.didJustFinish) {
      if (this.state.isPlayListRunning) {
        let audio;
        const indexOnPlayList = this.state.activePlayList.audios.findIndex(
          ({ id }) => id === this.state.currentAudio.id
        );
        if (this.state.isLooping === true) {
          const nextAudioIndex = this.state.currentAudioIndex;
          const audio = this.state.audioFiles[nextAudioIndex];
          const status = await playNextSong(this.state.playbackObj, audio.uri);
          this.updateState(this, {
            soundObj: status,
            currentAudio: audio,
            isPlaying: true,
            currentAudioIndex: nextAudioIndex,
          });
          return await storeAudioForNextOpening(audio, nextAudioIndex);
        } else if (this.state.isRandom === true) {
          //play random in playlist
          const indexOnPlayList = this.state.activePlayList.audios.findIndex(
            ({ id }) => id === this.state.currentAudio.id
          );
          const nextIndex = Math.floor(Math.random() * Number(indexOnPlayList));
          audio = this.state.activePlayList.audios[nextIndex];

          if (!audio) audio = this.state.activePlayList.audios[0];

          const indexOnAllList = this.state.audioFiles.findIndex(
            ({ id }) => id === audio.id
          );
          const status = await playNextSong(this.state.playbackObj, audio.uri);
          this.updateState(this, {
            soundObj: status,
            isPlaying: true,
            currentAudio: audio,
            currentAudioIndex: indexOnAllList,
          });
          return await storeAudioForNextOpening(audio, nextAudioIndex);
          u;
        }
        const nextIndex = indexOnPlayList + 1;
        audio = this.state.activePlayList.audios[nextIndex];

        if (!audio) audio = this.state.activePlayList.audios[0];

        const indexOnAllList = this.state.audioFiles.findIndex(
          ({ id }) => id === audio.id
        );
        const status = await playNextSong(this.state.playbackObj, audio.uri);
        return this.updateState(this, {
          soundObj: status,
          isPlaying: true,
          currentAudio: audio,
          currentAudioIndex: indexOnAllList,
        });
      }
      // play in loop
      if (this.state.isLooping === true) {
        const nextAudioIndex = this.state.currentAudioIndex;
        const audio = this.state.audioFiles[nextAudioIndex];
        const status = await playNextSong(this.state.playbackObj, audio.uri);
        this.updateState(this, {
          soundObj: status,
          currentAudio: audio,
          isPlaying: true,
          currentAudioIndex: nextAudioIndex,
        });
        return await storeAudioForNextOpening(audio, nextAudioIndex);
      } else if (this.state.isRandom === true) {
        //play random
        const nextAudioIndex = Math.floor(
          Math.random() * Number(this.totalAudioCount)
        );
        const audio = this.state.audioFiles[nextAudioIndex];
        const status = await playNextSong(this.state.playbackObj, audio.uri);
        this.updateState(this, {
          soundObj: status,
          currentAudio: audio,
          isPlaying: true,
          currentAudioIndex: nextAudioIndex,
        });
        return await storeAudioForNextOpening(audio, nextAudioIndex);
      } else {
        //play next
        const nextAudioIndex = this.state.currentAudioIndex + 1;
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
    }
  };

  updateState = (preState, newState = {}) => {
    this.setState({ ...preState, ...newState });
  };
  render() {
    const {
      audioFiles,
      playList,
      addToPlayList,
      dataProvider,
      permissionErr,
      playbackObj,
      soundObj,
      currentAudio,
      isPlaying,
      isLooping,
      isRandom,
      currentAudioIndex,
      playbackDuration,
      playbackPosition,
      isPlayListRunning,
      activePlayList,
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
          playList,
          addToPlayList,
          dataProvider,
          playbackObj,
          soundObj,
          currentAudio,
          isPlaying,
          isLooping,
          isRandom,
          currentAudioIndex,
          totalAudioCount: this.totalAudioCount,
          playbackDuration,
          playbackPosition,
          isPlayListRunning,
          activePlayList,
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
