import React, { useContext, useState } from "react";
import {
  Dimensions,
  FlatList,
  Modal,
  StyleSheet,
  Text,
  Touchable,
  TouchableOpacity,
  View,
} from "react-native";
import AudioListItem from "../components/AudioListItem";
import { AudioContext } from "../context/AudioProvider";
import { selectAudio } from "../misc/audioController";
import color from "../misc/color";
import OptionModels from "../components/OptionModels";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/Ionicons";
import { Image } from "react-native";
import AlbumImage from "../components/AlbumImage";
const PlayListDetail = (props) => {
  const context = useContext(AudioContext);
  const playList = props.route.params;
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(false);
  const [audios, setAudios] = useState(playList.audios);
  const playAudio = async (audio) => {
    await selectAudio(audio, context, {
      activePlayList: playList,
      isPlayListRunning: true,
    });
  };

  const closeModal = () => {
    setSelectedItem({});
    setModalVisible(false);
  };
  const removeAudio = async () => {
    let isPlaying = context.isPlaying;
    let isPlayListRunning = context.isPlayListRunning;
    let soundObj = context.soundObj;
    let playbackPosition = context.playbackPosition;
    let activePlayList = context.activePlayList;

    if (
      context.isPlayListRunning &&
      context.currentAudio.id === selectedItem.id
    ) {
      await context.playbackObj.stopAsync();
      await context.playbackObj.unloadAsync();
      isPlaying = false;
      isPlayListRunning = false;
      soundObj = null;
      playbackPosition = 0;
      activePlayList = [];
    }

    const newAudios = audios.filter((audio) => audio.id !== selectedItem.id);
    const result = await AsyncStorage.getItem("playlist");
    if (result !== null) {
      const oldPlayLists = JSON.parse(result);
      const updatedPlayLists = oldPlayLists.filter((item) => {
        if (item.id === playList.id) {
          item.audios = newAudios;
        }
        return item;
      });
      AsyncStorage.setItem("playlist", JSON.stringify(updatedPlayLists));
      context.updateState(context, {
        playList: updatedPlayLists,
        isPlayListRunning,
        activePlayList,
        playbackPosition,
        isPlaying,
        soundObj,
      });
    }
    setAudios(newAudios);
    closeModal();
  };

  const removePlaylist = async () => {
    let isPlaying = context.isPlaying;
    let isPlayListRunning = context.isPlayListRunning;
    let soundObj = context.soundObj;
    let playbackPosition = context.playbackPosition;
    let activePlayList = context.activePlayList;

    if (context.isPlayListRunning && activePlayList === playList.id) {
      await context.playbackObj.stopAsync();
      await context.playbackObj.unloadAsync();
      isPlaying = false;
      isPlayListRunning = false;
      soundObj = null;
      playbackPosition = 0;
      activePlayList = [];
    }

    const result = await AsyncStorage.getItem("playlist");
    if (result !== null) {
      const oldPlayLists = JSON.parse(result);
      const updatedPlayLists = oldPlayLists.filter(
        (item) => item.id !== playList.id
      );
      AsyncStorage.setItem("playlist", JSON.stringify(updatedPlayLists));
      context.updateState(context, {
        playList: updatedPlayLists,
        isPlayListRunning,
        activePlayList,
        playbackPosition,
        isPlaying,
        soundObj,
      });
    }
    props.navigation.goBack();
  };

  const playListAudio = async (audio) => {
    await selectAudio(audio, context, {
      activePlayList: playList,
      isPlayListRunning: true,
    });
  };

  const handlePressPlay = () => {
    if (context.isPlayListRunning) {
      context.playbackObj.stopAsync();
      context.playbackObj.unloadAsync();
      context.updateState(context, {
        isPlaying: false,
        isPlayListRunning: false,
        playbackPosition: 0,
        soundObj: null,
      });
    } else {
      playListAudio(audios[0]);
    }
  };

  return (
    <View style={{ backgroundColor: "#3a3d46", height: "100%" }}>
      <View>
        <AlbumImage></AlbumImage>
        <View
          style={{
            width: "100%",
            justifyContent: "space-between",
            paddingHorizontal: 15,
            alignSelf: "center",
          }}
        >
          <Text style={[styles.title, { fontSize: 35, color: "white" }]}>
            {playList.title}
          </Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.playButton}
              onPress={handlePressPlay}
            >
              <Icon
                name={context.isPlayListRunning ? "pause" : "play"}
                size={30}
                color="white"
              ></Icon>
              <Text
                style={[
                  styles.title,
                  {
                    color: "white",
                    fontSize: 20,
                    fontWeight: "bold",
                    marginLeft: 8,
                    lineHeight: 28,
                  },
                ]}
              >
                {context.isPlayListRunning ? "Stop" : "Play"}{" "}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={removePlaylist}
            >
              <Icon name="trash" size={30} color="white"></Icon>
              <Text
                style={[
                  styles.title,
                  {
                    color: "white",
                    fontSize: 18,
                    fontWeight: "bold",
                    marginLeft: 8,
                    lineHeight: 28,
                  },
                ]}
              >
                Remove
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        {audios.length ? (
          <FlatList
            contentContainerStyle={styles.listContainer}
            data={audios}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <View style={{ marginBottom: 10 }}>
                <AudioListItem
                  title={item.filename}
                  duration={item.duration}
                  isPlaying={context.isPlaying}
                  activeListItem={item.id === context.currentAudio.id}
                  onAudioPress={() => playAudio(item)}
                  onOptionPress={() => {
                    setSelectedItem(item);
                    setModalVisible(true);
                  }}
                ></AudioListItem>
              </View>
            )}
          ></FlatList>
        ) : (
          <Text
            style={{
              fontWeight: "bold",
              color: color.FONT_LIGHT,
              fontSize: 30,
              textAlign: 'center',
              marginTop: 30,
            }}
          >
            No Audio Added
          </Text>
        )}
      </View>
      <OptionModels
        visible={modalVisible}
        onClose={closeModal}
        options={[{ title: "Remove from playlist", onPress: removeAudio }]}
        currentItem={selectedItem}
      />
    </View>
  );
};

export default PlayListDetail;
const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
  listContainer: {
    padding: 20,
  },
  title: {
    alignSelf: "center",
    fontSize: 20,
    paddingVertical: 5,
    fontWeight: "bold",
    color: color.ACTIVE_BG,
    textAlign: "center",
  },
  deleteButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "red",
    borderRadius: 12,
    padding: 8,
    paddingLeft: 36,
    paddingRight: 36,
    marginLeft: 8,
  },
  buttonContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  playButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#4ECCA3",
    padding: 8,
    borderRadius: 12,
    paddingLeft: 40,
    paddingRight: 48,
  },
  tinyLogo: {
    width: 50,
    height: 50,
  },
});
