import { Text, View, StyleSheet } from 'react-native'
import React from 'react'

const PlayList = () => {
  return (
    <View style = {styles.container}>
      <Text>Play list</Text>
    </View>
  )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
})
export default PlayList