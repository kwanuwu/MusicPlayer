import { Image, StyleSheet } from 'react-native'

function AppLogo() {
  return (
    <Image
      style={styles.AppLogo}
      source={require('../../assets/icon.png')}
    />
  )
}


export default AppLogo
const styles = StyleSheet.create({
    AppLogo: {
      width: 200,
      height: 200,
      marginTop: 32,
      marginLeft: 'auto',
      marginRight: 'auto',
    }
});