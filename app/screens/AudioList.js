import { Text, View, StyleSheet, ScrollView, LayoutAnimation, Dimensions } from 'react-native'
import React, { Component } from 'react'
import { AudioContext } from '../context/AudioProvider'
import { RecyclerListView, LayoutProvider } from 'recyclerlistview'
import AudioListItem from '../components/AudioListItem'
import Screen from '../components/Screen'
import OptionModels from '../components/OptionModels'
export class AudioList extends Component {
  static contextType = AudioContext
  constructor(props) {
    super(props);
    this.state = {
      optionModalVisible: false
    };
    this.currentItem = {}
  }
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
    return <AudioListItem 
    title={item.filename} 
    duration={item.duration}
    onOptionPress={() => {
      this.currentItem = item;
        this.setState({...this.state, optionModalVisible: true});
      }} />
  }
  render() {
    return (
      <View style={{ flex: 1 }}>
        <AudioContext.Consumer>
          {({ dataProvider }) => {
            return (
              <Screen>
                <RecyclerListView
                  dataProvider={dataProvider}
                  layoutProvider={this.layoutProvider}
                  rowRenderer={this.rowRenderer}>
                </RecyclerListView>
                <OptionModels 
                onPlayPress={() => console.log('pressed')}
                onPlaylistPress={() => console.log('pressed')}
                currentItem = {this.currentItem}
                onClose = {() => this.setState({...this.state, optionModalVisible: false})} 
                visible = {this.state.optionModalVisible}/>
              </Screen>
            )
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