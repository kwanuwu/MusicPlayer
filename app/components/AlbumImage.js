import { Image } from "react-native";
import { StyleSheet } from "react-native";
function AlbumImage() {
  return (
    <Image
      style={styles.container}
      source={{
        uri: "https://static.wikia.nocookie.net/a-perfect-circle/images/2/28/A-perfect-circle-mer-de-noms-1-.jpg/revision/latest/scale-to-width-down/250?cb=20140212152834",
      }}
      // source = {require('C:\Users\Admin\musicApp\assets\album.webp')}
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
