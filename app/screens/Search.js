import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Screen from '../components/Screen'
import SearchBar from '../components/SearchBar'
import { Dimensions } from 'react-native'
const Search = () => {
  return (
    <Screen>
      <View style = {styles.searchBar}>
        <SearchBar/>
      </View>
    </Screen>
    
  )
}

export default Search
const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  searchBar: {
    alignSelf: 'center',
    backgroundColor: '#393E46',
    width : width - 60,
    height: '100%'
  }
})