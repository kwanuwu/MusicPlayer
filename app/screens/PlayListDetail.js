import React, { useContext } from "react";
import { Dimensions, FlatList, Modal, StyleSheet, Text, View } from "react-native";
import AudioListItem from "../components/AudioListItem";
import { AudioContext } from "../context/AudioProvider";
import { selectAudio } from "../misc/audioController";
import color from "../misc/color";

const PlayListDetail = (props) => {
    const context = useContext(AudioContext);
    const playList = props.route.params
    const playAudio = async (audio) => {
        await selectAudio(audio, context, {activePlayList: playList, isPlayListRunning: true})
    }
  return (
      <View style={styles.container}>
        <Text style={styles.title}>{playList.title}</Text>
        <FlatList
          contentContainerStyle={styles.listContainer}
          data={playList.audios}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={{ marginBottom: 10 }}>
              <AudioListItem
                title={item.filename}
                duration={item.duration}
                isPlaying = {context.isPlaying}
                activeListItem={item.id === context.currentAudio.id}
                onAudioPress = {()=> playAudio(item)}
              ></AudioListItem>
            </View>
          )}
        ></FlatList>
      </View>
  );
};

export default PlayListDetail;
const styles = StyleSheet.create({
  container: {
    alignSelf: "center",
  },
  listContainer: {
    padding: 20,
  },
  title: {
    textAlign: "center",
    fontSize: 20,
    paddingVertical: 5,
    fontWeight: "bold",
    color: color.ACTIVE_BG,
  },
});
