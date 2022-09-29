import { Text, View, StyleSheet, ScrollView } from 'react-native'
import React, { Component } from 'react'
import { AudioContext } from '../context/AudioProvider'

export class AudioList extends Component {
  static contextType = AudioContext
  render() {
    return (
      <ScrollView>
      {this.context.audioFiles.map(item => <Text style = {{padding: 10, borderBottomColor: 'red',
    borderBottomWidth: 4}} key={item.id}>{item.filename}</Text>)}
      </ScrollView>
    )
}
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
})
export default AudioList