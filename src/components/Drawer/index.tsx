import type { DrawerContentComponentProps } from '@react-navigation/drawer'
import React, { FC } from 'react'
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'

const Drawer: FC<DrawerContentComponentProps> = (
  props: DrawerContentComponentProps,
) => {
  const { navigation, state } = props

  return (
    <View style={styles.navigationContainer}>
      <Text style={styles.credit}>Simple Cashier</Text>
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => navigation.navigate('Home')}
        style={
          state.index === state.routeNames.findIndex((a) => a === 'Home')
            ? styles.menuActive
            : styles.menu
        }>
        <Icon name="home" size={16} />
        <Text style={styles.menuText}>Home</Text>
      </TouchableOpacity>
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => navigation.navigate('Archive')}
        style={
          state.index === state.routeNames.findIndex((a) => a === 'Archive')
            ? styles.menuActive
            : styles.menu
        }>
        <Icon name="archive" size={16} />
        <Text style={styles.menuText}>Arsip</Text>
      </TouchableOpacity>
      <Text style={styles.copyRight}>2021 Bima Febriansyah</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  navigationContainer: {
    padding: 10,
    position: 'relative',
    height: '100%',
  },
  credit: {
    fontSize: 24,
    marginBottom: 50,
    marginLeft: 10,
  },
  menuActive: {
    width: '100%',
    backgroundColor: '#a7bf2e',
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 18,
    paddingBottom: 18,
    marginBottom: 10,
    borderRadius: 5,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
  menu: {
    width: '100%',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuText: {
    fontSize: 14,
    marginLeft: 10,
  },
  copyRight: {
    fontSize: 12,
    position: 'absolute',
    bottom: 5,
    left: '50%',
    transform: [{ translateX: -50 }],
    color: '#2f2b324d',
  },
})

export default Drawer
