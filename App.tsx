import React, { FC, useEffect, useState } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import Home from './src/screens/Home'
import DatabaseProvider from '@nozbe/watermelondb/DatabaseProvider'
import database from './src/models'
import { BackHandler, StyleSheet, ToastAndroid } from 'react-native'
import Archive from './src/screens/Archive'
import { createDrawerNavigator } from '@react-navigation/drawer'
import DrawerContent from './src/components/Drawer'
import Header from './src/components/Header'
import Category from './src/screens/Category'

const Drawer = createDrawerNavigator()

const App: FC = () => {
  const [exitApp, setExitApp] = useState<number>(0)

  useEffect(() => {
    const backAction = () => {
      setTimeout(() => {
        setExitApp(0)
      }, 1500)

      if (exitApp === 0) {
        setExitApp(exitApp + 1)
        ToastAndroid.show('Press again to exit', ToastAndroid.SHORT)
      } else if (exitApp === 1) {
        BackHandler.exitApp()
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
          drawerType="back"
          drawerContent={(props) => <DrawerContent {...props} />}
          lazy={true}
          screenOptions={{
            headerShown: true,
            headerStyle: styles.header,
            header: (props) => <Header {...props} />,
          }}>
          <Drawer.Screen name="Home" component={Home} />
          <Drawer.Screen name="Archive" component={Archive} />
          <Drawer.Screen name="Category" component={Category} />
        </Drawer.Navigator>
      </NavigationContainer>
    </DatabaseProvider>
  )
}

const styles = StyleSheet.create({
  header: {
    height: 55,
    margin: 10,
    borderRadius: 10,
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
