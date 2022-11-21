import { Text, TouchableOpacity, View, StyleSheet } from 'react-native'

function Navigator(props) {
  const { navigation, text, navigate } = props
  return (
    <View style={styles.View}>
      <Text style={styles.Text_1}>{text} </Text>
      <TouchableOpacity onPress={() => navigation.navigate({ name: navigate })}>
        <Text style={styles.Text_2}>{navigate}</Text>
      </TouchableOpacity>
    </View>
  )
}

export default Navigator

const styles = StyleSheet.create({
    View: {
      flexDirection: "row",
      alignSelf: 'center'
    },
    Text_1: {
        color: "white",
        fontSize: 12,
        lineHeight: 16,
        marginTop: 16,
        marginBottom: 16
    },
    Text_2: {
        color: '#67e8f9',
        fontWeight: "bold",
        fontSize: 12,
        lineHeight: 16,
        marginTop: 16
    }
});