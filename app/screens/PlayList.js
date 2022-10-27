import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useContext, useEffect, useState } from "react";
import {
  Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View
} from "react-native";
import PlayListInputModal from "../components/PlayListInputModal";
import { AudioContext } from "../context/AudioProvider";
import color from "../misc/color";
let selectedPlayList = {};
const PlayList = ({navigation}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const context = useContext(AudioContext);
  const { playList, addToPlayList, updateState } = context;
  const createPlayList = async (playListName) => {
    const result = await AsyncStorage.getItem("playlist");
    if (result !== null) {
      const audios = [];
      if (addToPlayList) {
        audios.push(addToPlayList);
      }
      const newList = {
        id: Date.now(),
        title: playListName,
        audios: audios,
      };

      const updatedList = [...playList, newList];
      updateState(context, { addToPlayList: null, playList: updatedList });
      await AsyncStorage.setItem("playlist", JSON.stringify(updatedList));
    }
    setModalVisible(false);
  };
  // render default playlist on the 1st time running app
  const renderPlayList = async () => {
    const result = await AsyncStorage.getItem("playlist");
    if (result === null) {
      const defaultPlayList = {
        id: Date.now(),
        title: "My Favorite",
        audios: [],
      };

      const newPlayList = [...playList, defaultPlayList];
      updateState(context, { playList: [...newPlayList] });
      return await AsyncStorage.setItem(
        "playlist",
        JSON.stringify([...newPlayList])
      );
    }

    updateState(context, { playList: JSON.parse(result) });
  };
  useEffect(() => {
    if (!playList.length) {
      renderPlayList();
    }
  }, []);
const handleBannerPress = async (playList) => {
   //update playlist if audio selected
   if(addToPlayList) {
    //check if selectedd audio exists in playlist
    const result = await AsyncStorage.getItem('playlist');
    let oldList = [];
    var updatedList = [];
    let sameAudio = false;
    if(result !== null) {
      oldList = JSON.parse(result)
      updatedList = oldList.filter(list => {
        //alert existed audio
        if(list.id === playList.id) {
          for(let audio of list.audios) {
            if(audio.id === addToPlayList.id) {
              sameAudio = true;
              return;
            }
          }
          list.audios = [...list.audios, addToPlayList];
        }
        return list; 
      })
    }
    if(sameAudio) {
      Alert.alert('Audio Existed!' , `${addToPlayList.filename.split("-FLAC",1)} is already inside that list.`)
      sameAudio = false;
      return updateState(context, {addToPlayList: null})
    }
  updateState(context, {addToPlayList: null, playList: [...updatedList]})
  return AsyncStorage.setItem('playlist', JSON.stringify([...updatedList]))
  }
  selectedPlayList = playList;
  navigation.navigate('PlayListDetail', playList);
}
  return (
    <View style = {{backgroundColor: '#3a3d46', height: '100%'}}>
    <ScrollView contentContainerStyle={styles.container}>
      {playList.length
        ? playList.map((item) => (
            <TouchableOpacity
              key={item.id.toString()}
              style={styles.playListBanner}
              onPress = {() => handleBannerPress(item)}
            >
              <Text style = {{color: 'white', fontWeight: 'bold', fontSize: 22}}>{item.title}</Text>
              <Text style={styles.audioCount}>
                {item.audios.length > 1
                  ? `${item.audios.length} Songs`
                  : `${item.audios.length} Song`}
              </Text>
            </TouchableOpacity>
          ))
        : null}
      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        style={{ marginTop: 15 }}
      >
        <Text style={styles.playListButton}>+ Add New Playlist</Text>
      </TouchableOpacity>
      <PlayListInputModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSubmit={createPlayList}
      ></PlayListInputModal>
    </ScrollView>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  audioCount: {
    marginTop: 3,
    opacity: 0.5,
    fontSize: 14,
    fontWeight: 'bold',
    color: 'white'
  },
  playListBanner: {
    padding: 15,
    backgroundColor: "rgba(204,204,204,0.3)",
    borderRadius: 10,
    marginBottom: 15,
    height: 90,
  },
  playListButton: {
    color: 'white',
    letterSpacing: 1,
    fontWeight: "bold",
    fontSize: 14,
    padding: 5,
  },
});
export default PlayList;
