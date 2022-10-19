import { Dimensions, FlatList, StyleSheet, Text, View } from "react-native";
import { Modal } from "react-native";
import React from "react";
import color from "../misc/color";
import AudioListItem from "./AudioListItem";

const PlayListDetail = ({ visible, playList, onClose }) => {
  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose = {onClose}>
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
              ></AudioListItem>
            </View>
          )}
        ></FlatList>
      </View>
      <View style={[StyleSheet.absoluteFillObject, styles.modalBG]}></View>
    </Modal>
  );
};

export default PlayListDetail;
const { width, height } = Dimensions.get("window");
const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    alignSelf: "center",
    height: height - 150,
    width: width - 15,
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  modalBG: {
    backgroundColor: color.MODAL_BG,
    zIndex: -1,
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
