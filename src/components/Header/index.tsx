import { DrawerHeaderProps } from '@react-navigation/drawer/lib/typescript/src/types'
import { DrawerActions } from '@react-navigation/routers'
import React, { FC } from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'

const getLabel = (name: string): string => {
  switch (name) {
    case 'Home':
      return 'Beranda'
    case 'Archive':
      return 'Arsip'
    case 'Category':
      return 'Kategori'
    default:
      return ''
  }
}

const Header: FC<DrawerHeaderProps> = ({ scene }: DrawerHeaderProps) => {
  const { route, descriptor } = scene
  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() =>
          descriptor.navigation.dispatch(DrawerActions.openDrawer())
        }>
        <Icon name="bars" size={18} />
      </TouchableOpacity>
      <Text style={styles.title}>{getLabel(route.name)}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 10,
    height: 55,
    paddingLeft: 20,
    backgroundColor: '#fff',
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
  title: {
    fontSize: 18,
    paddingLeft: 25,
  },
})

export default Header
