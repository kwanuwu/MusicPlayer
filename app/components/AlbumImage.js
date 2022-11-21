import { Image } from "react-native";
import { StyleSheet } from "react-native";
function AlbumImage() {
  return (
    <Image
      style={styles.container}
      source={require("../../assets/music1.png")}
    ></Image>
  );
}
const styles = StyleSheet.create({
  container: {
    width: 240,
    marginTop: 32,
    height: 240,
    marginLeft: "auto",
    marginRight: "auto",
    borderRadius: 160,
  },
});

export default AlbumImage;
