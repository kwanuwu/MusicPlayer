import {
  Modal,
  StyleSheet,
  View,
  Text,
  TouchableWithoutFeedback,
  TouchableOpacity,
} from "react-native";
import React, { useContext } from "react";
import { StatusBar } from "expo-status-bar";
import color from "../misc/color";

const OptionModels = ({
  visible,
  currentItem,
  onClose,
  onPlayPress,
  onPlaylistPress,
}) => {
  const { filename } = currentItem
  return (
    <>
      <StatusBar hidden />
      <Modal animationType="slice" transparent visible={visible}>
        <View style={styles.modal}>
          <Text style={styles.title} numberOfLines={1}>
            {filename}
          </Text>
          <View style={styles.optionContainer}>
            <TouchableOpacity onPress={onPlayPress}>
              <Text style={styles.option}>Play</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onPlaylistPress}>
              <Text style={styles.option}>Add to Playlist</Text>
            </TouchableOpacity>
          </View>
        </View>
        <TouchableWithoutFeedback onPress={onClose}>
          <View style={styles.modalBg} />
        </TouchableWithoutFeedback>
      </Modal>
    </>
  );
};

export default OptionModels;

const styles = StyleSheet.create({
  modal: {
    position: "absolute",
    bottom: 0,
    right: 0,
    left: 0,
    backgroundColor: color.APP_BG,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    zIndex: 1000,
  },
  optionContainer: {
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    padding: 20,
    paddingBottom: 0,
    color: color.FONT_MEDIUM,
  },
  option: {
    fontSize: 16,
    fontWeight: "bold",
    color: color.FONT,
    paddingVertical: 10,
  },
  modalBg: {
    position: "absolute",
    top: 0,
    right: 0,
    left: 0,
    bottom: 0,
    backgroundColor: color.MODAL_BG,
  },
});
