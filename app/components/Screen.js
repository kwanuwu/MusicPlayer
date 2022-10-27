import { StyleSheet, View, StatusBar } from "react-native";
import React from "react";
import color from "../misc/color";

const Screen = ({ children }) => {
  return <View style={styles.containter}>{children}</View>;
};

export default Screen;

const styles = StyleSheet.create({
  containter: {
    flex: 1,
    backgroundColor: '#3a3d46',
    paddingTop: StatusBar.currentHeight,
  },
});
