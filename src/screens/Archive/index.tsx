import Container from 'components/Container'
import React, { FC } from 'react'
import {
  Dimensions,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
} from 'react-native'

const Archive: FC = () => {
  return (
    <SafeAreaView>
      <ScrollView>
        <Container style={styles.container}>
          <Text>it's will update soon</Text>
        </Container>
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
