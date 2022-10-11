import { Text, View, Alert } from 'react-native'
import React, { Component, createContext } from 'react'
import * as MediaLibrary from 'expo-media-library';
import { DataProvider } from 'recyclerlistview';
export const AudioContext = createContext()
export class AudioProvider extends Component {
  constructor(props) {
    super(props)
    this.state = {
      audioFiles: [],
      permissionErr: false,
      dataProvider: new DataProvider((r1, r2) => r1 !== r2)
    }
  }

  permissionAlert = () => {
    Alert.alert("Permission Required", "This app needs to read audio", [{
      text: 'Yes',
      onPress: () => this.getPermission()
    }, {
      text: 'No',
      onPress: () => this.permissionAlert()
    }])
  }

  getAudioFiles = async () => {
    const { dataProvider, audioFiles } = this.state
    let media = await MediaLibrary.getAssetsAsync({
      mediaType: 'audio'
    });
    media = await MediaLibrary.getAssetsAsync({
      mediaType: 'audio',
      first: media.totalCount,
    });
    this.setState({ ...this.state, dataProvider: dataProvider.cloneWithRows([...audioFiles, ...media.assets]), audioFiles: [...audioFiles, ...media.assets] })
  }
  //get permission from user when mount music from device
  getPermission = async () => {
    //   { 
    //   "canAskAgain": true, 
    //   "expires": "never", 
    //   "granted": false, 
    //   "status": "undetermined"
    //  }
    const permission = await MediaLibrary.getPermissionsAsync()
    //when user allow access
    if (permission.granted) {
      // get all the audio files
      this.getAudioFiles()
    }
    if (!permission.canAskAgain && !permission.granted) {
      this.setState({ ...this.state, permissionErr: true })
    }
    //when user doesn't allow access
    if (!permission.granted && permission.canAskAgain) {
      const { status, canAskAgain } = await MediaLibrary.requestPermissionsAsync();
      if (status === 'denied' && canAskAgain) {
        //display alert that user must allow this permission to work
        this.permissionAlert()
      }
      if (status === 'granted') {
        // get all the audio files
        this.getAudioFiles()
      }
      if (status === 'denied' && !canAskAgain) {
        // error cant get audio files and not display alert again
        this.setState({ ...this.state, permissionErr: true })
      }
    }
  }
  componentDidMount() {
    this.getPermission()
  }

  render() {
    const { audioFiles, dataProvider, permissionErr } = this.state
    if (permissionErr)
      return <View style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
      }
      }>
        <Text style={{ fontSize: 25, textAlign: 'center', color: 'black' }}>There was no permission to access audio</Text>
      </View>
    return (
      <AudioContext.Provider value={{ audioFiles, dataProvider }}>
        {this.props.children}
      </AudioContext.Provider>
    );
  }
}

export default AudioProvider