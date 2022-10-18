//play
export const play = async (playbackObj, uri) => {
  try {
    return await playbackObj.loadAsync({ uri }, { shouldPlay: true });
  } catch (error) {
    console.log("error play");
  }
};

//pause

export const pause = async (playbackObj) => {
  try {
    return await playbackObj.setStatusAsync({ shouldPlay: false });
  } catch (error) {
    console.log("error pause");
  }
};
//resume
export const resume = async (playbackObj) => {
  try {
    return await playbackObj.playAsync();
  } catch (error) {
    console.log("error resume");
  }
};
export const playNextSong = async (playbackObj, uri) => {
  try {
    await playbackObj.stopAsync()
    await playbackObj.unloadAsync()
    return await play(playbackObj, uri)
  } catch (error) {
    console.log("error playnext")
  }
}

//select other audio
