import React, { FC } from 'react'
import {
  Dimensions,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native'

const Archive: FC = () => {
  return (
    <SafeAreaView>
      <ScrollView>
        <View style={styles.container}>
          <Text>it's will update soon</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    height: Dimensions.get('window').height,
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
  },
})

export default Archive
