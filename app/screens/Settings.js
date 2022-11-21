import { AppContext } from '../context/AppProvider'
import { authentication } from '../misc/services'

import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useContext, useState, useCallback } from 'react'
import Screen from '../components/Screen'

function Settings() {
  const appContext = useContext(AppContext)
  const data = { username: appContext.username }

  const [logoutError, setLogoutError] = useState('')

  const handleLogout = useCallback(async () => {
    const res = await authentication({ action: 'logout', data })
    try {
      if (res.status === 401) {
        setLogoutError(res.message)
      } else {
        appContext.updateState(appContext, {
          loggedIn: false,
        })
      }
    } catch (error) {
      setLogoutError = error.message
    }
  }, [data])

  return (
    <View style={styles.View}>
      <TouchableOpacity
        style={styles.TouchableOpacity}
        onPress={handleLogout}
      >
        <Text style={styles.Text}>Logout </Text>
      </TouchableOpacity>
      {logoutError ? <Text style={styles.error}>{logoutError}</Text> : null}
    </View>
  )
}

const styles = StyleSheet.create({
  error: {
    fontSize: 16,
    color: 'red',
    marginTop: 8,
    textAlign: 'center',
  },
  View: {
    paddingLeft: 32,
    paddingRight: 32,
    backgroundColor: '#333333',
    height: '100%',
    justifyContent: 'center',
  },
  Text: {
    color: 'white',
    fontSize: 18,
    lineHeight: 28,
    padding: 16
  },
  TouchableOpacity: {
    marginTop: 32,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    justifyContent: 'center',
  }
})

export default Settings