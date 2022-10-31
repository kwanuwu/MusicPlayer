import AsyncStorage from "@react-native-async-storage/async-storage"
export const storeAudioForNextOpening = async (audio, index, lastPosition, lastPlaylist) => {
  await  AsyncStorage.setItem('previousAudio', JSON.stringify({audio: {...audio, lastPosition, lastPlaylist}, index}))
}