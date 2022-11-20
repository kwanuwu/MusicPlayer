import React, { useContext, useState } from "react";
import { Dimensions, ScrollView, StyleSheet } from "react-native";
import AudioListItem from "../components/AudioListItem";
import Screen from "../components/Screen";
import SearchBar from "../components/SearchBar";
import { AudioContext } from "../context/AudioProvider";
import { selectAudio } from "../misc/audioController";
import { zing } from "../misc/services";
let resultSongsArray = [];
function Search({ navigation }) {
  const [songList, setSongList] = useState([]);
  const context = useContext(AudioContext);
  const [click, setClick] = useState(false);
  const onSearch = async (event) => {
    resultSongsArray = [];
    const keyValue = event.nativeEvent.text;
    const res = await zing({ action: "search", param: keyValue });
    if (res !== null) setSongList(res.data.songs);
    // setup to link the selected audio to the player screen
    res.data.songs.map((song) => {
      resultSongsArray.push({
        title: song.title,
        encodeId: song.encodeId,
        id: song.radioId,
        duration: song.duration,
      });
    });
  };

  const getSong = async (key) => {
    const res = await zing({ action: "song", param: key });
    if (res) {
      try {
        const audio = {
          filename: resultSongsArray.find((song) => song.encodeId === key)
            .title,
          id: resultSongsArray.find((song) => song.encodeId === key).id,
          duration: resultSongsArray.find((song) => song.encodeId === key)
            .duration,
          uri: res.data['128'],
        };
        navigation.navigate("Player");
        await selectAudio(audio, context);
      } catch (error) {
        console.log(error.message);
      }
    }
  };
  return (
    <Screen>
      <SearchBar {...{ onSubmit: onSearch }} />
      <ScrollView style={styles.searchBar}>
        {songList &&
          songList.map((song) => (
            <AudioListItem
              {...{
                key: song.encodeId,
                title: song.title,
                duration: song.duration,
                onAudioPress: () => {
                  getSong(song.encodeId);
                },
                onOptionPress: () => {
                  console.log("In progress");
                },
                activeListItem: click,
                isPlaying: click,
              }}
            />
          ))}
      </ScrollView>
    </Screen>
  );
}
const { width } = Dimensions.get("window");
export default Search;
const styles = StyleSheet.create({
  searchBar: {
    height: "100%",
    width: "100%",
  },
});
