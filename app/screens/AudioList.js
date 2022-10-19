import { Text, View, StyleSheet, Dimensions } from "react-native";
import React, { Component } from "react";
import { AudioContext } from "../context/AudioProvider";
import { RecyclerListView, LayoutProvider } from "recyclerlistview";
import AudioListItem from "../components/AudioListItem";
import Screen from "../components/Screen";
import OptionModels from "../components/OptionModels";
import { Audio } from "expo-av";
import { storeAudioForNextOpening } from "../misc/helper";
import { pause, play, playNextSong, resume, selectAudio } from "../misc/audioController";
export class AudioList extends Component {
  static contextType = AudioContext;
  constructor(props) {
    super(props);
    this.state = {
      optionModalVisible: false,
    };
    this.currentItem = {};
  }
  layoutProvider = new LayoutProvider(
    (i) => "audio",
    (type, dim) => {
      switch (type) {
        case "audio":
          dim.width = Dimensions.get("window").width;
          dim.height = 70;
          break;
        default:
          dim.height = 0;
          dim.width = 0;
      }
    }
  );
  // onPlaybackStatusUpdate = async (playbackStatus) => {
  //   if (playbackStatus.isLoaded && playbackStatus.isPlaying) {
  //     this.updateState(this, {
  //       playbackPosition: playbackStatus.positionMillis,
  //       playbackDuration: playbackStatus.durationMillis,
  //     });
  //   }

  //   //play next song when playing song is finished
  //   if (playbackStatus.didJustFinish) {
  //     const nextAudioIndex = this.state.currentAudioIndex + 1;
  //     // const nextAudioIndex = Math.floor(Math.random()*Number(this.context.totalAudioCount));
  //     if (nextAudioIndex >= this.totalAudioCount) {
  //       this.playbackObj.unloadAsync();
  //       this.updateState(this, {
  //         soundObj: null,
  //         currentAudio: this.state.audioFiles[0],
  //         isPlaying: false,
  //         currentAudioIndex: 0,
  //         playbackPosition: null,
  //         playbackDuration: null,
  //       });
  //       return await storeAudioForNextOpening(this.state.audioFiles[0], 0);
  //     }
  //     const audio = this.state.audioFiles[nextAudioIndex];
  //     const status = await playNextSong(this.state.playbackObj, audio.uri);
  //     this.updateState(this, {
  //       soundObj: status,
  //       currentAudio: audio,
  //       isPlaying: true,
  //       currentAudioIndex: nextAudioIndex,
  //     });
  //     await storeAudioForNextOpening(audio, nextAudioIndex);
  //   }
  //   //play random song
  //   // if(playbackStatus.didJustFinish) {
  //   //   const nextAudioIndex = Math.floor(Math.random()*Number(this.context.totalAudioCount));
  //   //   const audio = this.context.audioFiles[nextAudioIndex];
  //   // const status = await playNextSong(this.context.playbackObj, audio.uri)
  //   // this.context.updateState(this.state, {
  //   //   soundObj: status,
  //   //   currentAudio: audio,
  //   //   isPlaying: true,
  //   //   currentAudio: nextAudioIndex,
  //   // });
  //   // }
  // };
  handleAudioPress = async (audio) => {
    await selectAudio(audio, this.context);
    // const { soundObj, playbackObj, currentAudio, updateState, audioFiles } =
    //   this.context;
    // // playing audio 1st time
    // if (soundObj == null) {
    //   const playbackObj = new Audio.Sound();
    //   const status = await play(playbackObj, audio.uri);
    //   const index = audioFiles.indexOf(audio);
    //   updateState(this.context, {
    //     playbackObj: playbackObj,
    //     soundObj: status,
    //     currentAudio: audio,
    //     isPlaying: true,
    //     currentAudioIndex: index,
    //   });
    //   playbackObj.setOnPlaybackStatusUpdate(
    //     this.context.onPlaybackStatusUpdate
    //   );
    //   return storeAudioForNextOpening(audio, index);
    // }
    // //pause audio
    // if (
    //   soundObj.isLoaded &&
    //   soundObj.isPlaying &&
    //   currentAudio.id == audio.id
    // ) {
    //   //setStatusAsync() change status of current loading media
    //   const status = await pause(playbackObj);
    //   return updateState(this.context, { soundObj: status, isPlaying: false });
    // }

    // //resume audio
    // if (
    //   soundObj.isLoaded &&
    //   !soundObj.isPlaying &&
    //   currentAudio.id === audio.id
    // ) {
    //   const status = await resume(playbackObj);
    //   return updateState(this.context, { soundObj: status, isPlaying: true });
    // }
    // //select other audio
    // if (soundObj.isLoaded && currentAudio.id !== audio.id) {
    //   const status = await playNextSong(playbackObj, audio.uri);
    //   const index = audioFiles.indexOf(audio);
    //   updateState(this.context, {
    //     soundObj: status,
    //     currentAudio: audio,
    //     isPlaying: true,
    //     currentAudioIndex: index,
    //   });
    //   return storeAudioForNextOpening(audio, index);
    // }
  };

  componentDidMount() {
    this.context.loadPreviousAudio();
  }

  rowRenderer = (type, item, index, extendedState) => {
    return (
      <AudioListItem
        title={item.filename}
        isPlaying={extendedState.isPlaying}
        duration={item.duration}
        activeListItem={this.context.currentAudioIndex === index}
        onAudioPress={() => this.handleAudioPress(item)}
        onOptionPress={() => {
          this.currentItem = item;
          this.setState({ ...this.state, optionModalVisible: true });
        }}
      />
    );
  };
  render() {
    return (
      <View style={{ flex: 1 }}>
        <AudioContext.Consumer>
          {({ dataProvider, isPlaying }) => {
            if (!dataProvider._data.length) return null;
            return (
              <Screen>
                <RecyclerListView
                  dataProvider={dataProvider}
                  layoutProvider={this.layoutProvider}
                  rowRenderer={this.rowRenderer}
                  extendedState={{ isPlaying }}
                ></RecyclerListView>
                <OptionModels
                onPlaylistPress={() => {
                  this.context.updateState(this.context, {
                    addToPlayList: this.currentItem,
                  })
                    this.props.navigation.navigate('PlayList')
                }}  
                  currentItem={this.currentItem}
                  onClose={() =>
                    this.setState({ ...this.state, optionModalVisible: false })
                  }
                  visible={this.state.optionModalVisible}
                />
              </Screen>
            );
          }}
        </AudioContext.Consumer>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
export default AudioList;
