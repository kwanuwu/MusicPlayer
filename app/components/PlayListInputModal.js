import {
  Text,
  StyleSheet,
  Modal,
  View,
  TextInput,
  Dimensions,
  TouchableWithoutFeedback,
} from "react-native";
import React, { useState } from "react";
import { AntDesign } from "@expo/vector-icons";
import color from "../misc/color";
const PlayListInputModal = ({ visible, onClose, onSubmit }) => {
  const [playListName, setPlayListName] = useState("");
  const handleOnSumbit = () => {
    if (!playListName.trim()) {
      onClose();
    } else {
      onSubmit(playListName);
      setPlayListName("");
      onClose();
    }
  };
  return (
    <Modal visible={visible} animationType="fade" transparent>
      <View style={styles.modalContainer}>
        <View style={styles.inputContainer}>
          <Text style={{ color: color.ACTIVE_BG }}>Create New Playlist</Text>
          <TextInput
            value={playListName}
            onChangeText={(text) => setPlayListName(text)}
            style={styles.input}
            textAlign={"center"}
            keyboardType="visible-password"
          ></TextInput>
          <AntDesign
            style={styles.submitIcon}
            name="check"
            size={24}
            color={color.ACTIVE_FONT}
            onPress={handleOnSumbit}
          ></AntDesign>
        </View>
      </View>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={[StyleSheet.absoluteFillObject, styles.modalBG]}></View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default PlayListInputModal;
const { width } = Dimensions.get("window");
const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  inputContainer: {
    width: width - 20,
    height: 200,
    borderRadius: 10,
    backgroundColor: color.ACTIVE_FONT,
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    width: width - 40,
    borderBottomWidth: 1,
    borderBottomColor: color.ACTIVE_BG,
    fontSize: 18,
  },
  submitIcon: {
    padding: 10,
    backgroundColor: color.ACTIVE_BG,
    borderRadius: 50,
    marginTop: 15,
  },
  modalBG: {
    backgroundColor: color.MODAL_BG,
    zIndex: -1,
  },
});
