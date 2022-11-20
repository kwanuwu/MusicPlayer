import { Text, TouchableOpacity, StyleSheet } from 'react-native'

function CustomizeButton(props) {
  const { pressed, title } = props
  return (
    <TouchableOpacity
      style={styles.TouchableOpacity}
      onPress={pressed}
    >
      <Text style={styles.Text}>{title}</Text>
    </TouchableOpacity>
  )
}

export default CustomizeButton

const styles = StyleSheet.create({
    TouchableOpacity: {
      paddingLeft: 16,
      paddingRight: 16,
      paddingTop: 8,
      paddingBottom: 8,
      backgroundColor: "rgba(37, 99, 235)",
      borderRadius: 6
    },
    Text: {
        color: "rgba(255, 255, 255)",
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 18,
        lineHeight: 28,
    }
});