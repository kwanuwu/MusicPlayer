import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Screen from '../components/Screen'

const Settings = () => {
  return (
    <Screen>
    <View  style = {{alignSelf: 'center'}}>
      <Text style = {{color: 'red'}}>Settings</Text>
    </View>
    </Screen>
  )
}

export default Settings

const styles = StyleSheet.create({})