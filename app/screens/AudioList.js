import { Text, View, StyleSheet, Dimensions } from "react-native";
import React, { Component } from "react";
import { AudioContext } from "../context/AudioProvider";
import { RecyclerListView, LayoutProvider } from "recyclerlistview";
import AudioListItem from "../components/AudioListItem";
import Screen from "../components/Screen";
import OptionModels from "../components/OptionModels";
import { selectAudio } from "../misc/audioController";
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
          dim.height = 80;
          break;
        default:
          dim.height = 0;
          dim.width = 0;
      }
    }
  );

  handleAudioPress = async (audio) => {
    await selectAudio(audio, this.context);
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

  navigateToPlayList = () => {
    this.context.updateState(this.context, {
      addToPlayList: this.currentItem,
    });
    this.props.navigation.navigate("PlayList");
  };

  playAudio = async () => {
    await selectAudio(this.currentItem, this.context);
  };

  render() {
    return (
      <View style={{ flex: 1 }}>
        <AudioContext.Consumer>
          {({ dataProvider, isPlaying }) => {
            if (!dataProvider._data.length)
              return (
                <View
                  style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 25,
                      textAlign: "center",
                      color: "black",
                    }}
                  >
                    There is no audio in your device. You may go to Search to
                    listen to music online.
                  </Text>
                </View>
              );
            return (
              <Screen>
                <Text style={styles.title}>All songs</Text>
                <RecyclerListView
                  dataProvider={dataProvider}
                  layoutProvider={this.layoutProvider}
                  rowRenderer={this.rowRenderer}
                  extendedState={{ isPlaying }}
                ></RecyclerListView>
                <OptionModels
                  // onPlaylistPress={() => {
                  //   this.context.updateState(this.context, {
                  //     addToPlayList: this.currentItem,
                  //   });
                  //   this.props.navigation.navigate("PlayList");
                  // }}
                  options={[
                    { title: "Play", onPress: this.playAudio },
                    {
                      title: "Add to playlist",
                      onPress: this.navigateToPlayList,
                    },
                  ]}
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
  title: {
    alignSelf: "center",
    fontSize: 30,
    fontFamily: "Roboto",
    fontWeight: "bold",
    marginBottom: 20,
    color: "white",
  },
});
export default AudioList;
