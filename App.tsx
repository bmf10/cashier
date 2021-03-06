import React, { FC, useEffect, useState } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import Home from './src/screens/Home'
import DatabaseProvider from '@nozbe/watermelondb/DatabaseProvider'
import database from './src/models'
import { BackHandler, StyleSheet, ToastAndroid } from 'react-native'
import Archive from './src/screens/Archive'
import { createDrawerNavigator } from '@react-navigation/drawer'
import DrawerContent from './src/components/Drawer'

const Drawer = createDrawerNavigator()

const App: FC = () => {
  const [exitApp, setExitApp] = useState<number>(0)

  useEffect(() => {
    const backAction = () => {
      const timeout = setTimeout(() => {
        setExitApp(0)
      }, 1500)

      if (exitApp === 0) {
        setExitApp(exitApp + 1)
        ToastAndroid.show('Press again to exit', ToastAndroid.SHORT)
        clearTimeout(timeout)
      } else if (exitApp === 1) {
        BackHandler.exitApp()
        clearTimeout(timeout)
      }
      return true
    }

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    )

    return () => backHandler.remove()
  }, [exitApp])

  return (
    <DatabaseProvider database={database}>
      <NavigationContainer>
        <Drawer.Navigator
          drawerContent={(props) => <DrawerContent {...props} />}
          drawerType="front">
          <Drawer.Screen
            options={{
              title: 'Home',
              headerShown: true,
              headerStyle: styles.header,
            }}
            name="Home"
            component={Home}
          />
          <Drawer.Screen
            options={{
              title: 'Arsip',
              headerShown: true,
            }}
            name="Archive"
            component={Archive}
          />
        </Drawer.Navigator>
      </NavigationContainer>
    </DatabaseProvider>
  )
}

const styles = StyleSheet.create({
  header: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
})

export default App
