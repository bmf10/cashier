import React, { FC, useEffect, useState } from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { NavigationContainer } from '@react-navigation/native'
import Home from './src/screens/Home'
import DatabaseProvider from '@nozbe/watermelondb/DatabaseProvider'
import Database from '@nozbe/watermelondb/Database'
import Product from './src/models/product'
import { schema } from './src/models/schema'
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite'
import { BackHandler, ToastAndroid } from 'react-native'

const Stack = createStackNavigator()

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

  const adapter = new SQLiteAdapter({
    dbName: 'cashierDb',
    schema,
  })

  const database = new Database({
    adapter,
    modelClasses: [Product],
    actionsEnabled: true,
  })

  return (
    <DatabaseProvider database={database}>
      <NavigationContainer>
        <Stack.Navigator headerMode="none">
          <Stack.Screen name="Home" component={Home} />
        </Stack.Navigator>
      </NavigationContainer>
    </DatabaseProvider>
  )
}

export default App
