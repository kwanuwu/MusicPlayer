import { Text, View, StyleSheet, ScrollView, LayoutAnimation, Dimensions } from 'react-native'
import React, { Component } from 'react'
import { AudioContext } from '../context/AudioProvider'
import { RecyclerListView, LayoutProvider } from 'recyclerlistview'
export class AudioList extends Component {
  static contextType = AudioContext
  layoutProvider = new LayoutProvider((i) => 'audio', (type, dim) => {
    switch (type) {
      case 'audio':
        dim.width = Dimensions.get('window').width;
        dim.height = 70;
        break;
      default:
        dim.height = 0;
        dim.width = 0;
    }
  })
  rowRenderer = (type, item) => {
    return <Text>{item.filename}</Text>
  }
  render() {
    return (
      <View style={{ flex: 1 }}>
        <AudioContext.Consumer>
          {({ dataProvider }) => {
            return (
              <RecyclerListView dataProvider={dataProvider} layoutProvider={this.layoutProvider} rowRenderer={this.rowRenderer}>
              </RecyclerListView>)
          }}
        </AudioContext.Consumer>
      </View>
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