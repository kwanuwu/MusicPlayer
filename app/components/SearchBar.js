import { StyleSheet, TextInput, View } from "react-native";
import React from "react";
import { useState } from "react";
import Icon from "react-native-vector-icons/Ionicons";
import { Dimensions } from "react-native";

function SearchBar(props) {
  const { onSubmit } = props;
  const [name, setName] = useState("");

  return (
    <View style={styles.searchBar}>
      <TextInput
        style={styles.textInput}
        placeholderTextColor={"#D4D4D4"}
        placeholder="Enter song name"
        onChangeText={(value) => setName(value)}
        defaultValue={name}
        onSubmitEditing={onSubmit}
      />
      <View style={styles.searchIcon}>
        <Icon name="search" size={25} color="#fff" />
      </View>
    </View>
  );
}
const { width } = Dimensions.get("window");

export default SearchBar;
const styles = StyleSheet.create({
  searchBar: {
    marginTop: 32,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "grey",
    justifyContent: "space-between",
    borderRadius: 12,
    marginLeft: 14,
    marginRight: 14,
  },
  textInput: {
    fontSize: 18,
    lineHeight: 24,
    padding: 16,
    paddingLeft: 16,
    paddingRight: 16,
    color: "white",
    width: "83.333333%",
  },
  searchIcon: {
    marginRight: 4,
    padding: 12,
  },
});
