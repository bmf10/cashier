import React, { FC, useRef } from 'react'
import { StyleSheet, DrawerLayoutAndroid, Text, View } from 'react-native'
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler'
import Icon from 'react-native-vector-icons/FontAwesome'
import { useNavigation } from '@react-navigation/native'
export interface WrapperProps {
  readonly children: React.ReactNode
  readonly title?: string
}

const Wrapper: FC<WrapperProps> = ({ children, title }: WrapperProps) => {
  const drawer = useRef<DrawerLayoutAndroid>(null)
  const navigation = useNavigation()

  const navigationView = () => (
    <View style={styles.navigationContainer}>
      <Text style={styles.credit}>Cashier Apps</Text>
      <TouchableOpacity
        onPress={() => navigation.navigate('home')}
        style={styles.menuActive}>
        <Icon name="home" size={20} />
        <Text style={styles.menuText}>Home</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => navigation.navigate('archive')}
        style={styles.menu}>
        <Icon name="archive" size={20} />
        <Text style={styles.menuText}>Arsip</Text>
      </TouchableOpacity>
      <Text style={styles.copyRight}>2021 Bima Febriansyah</Text>
    </View>
  )

  return (
    <DrawerLayoutAndroid
      ref={drawer}
      renderNavigationView={navigationView}
      drawerPosition="left"
      drawerWidth={300}>
      <View style={styles.header}>
        <Icon
          style={styles.opener}
          onPress={() => drawer.current?.openDrawer()}
          name="bars"
        />
        <Text style={styles.title}>{title}</Text>
        <View style={styles.ender} />
      </View>
      <View style={styles.container}>
        <ScrollView>{children}</ScrollView>
      </View>
    </DrawerLayoutAndroid>
  )
}

const styles = StyleSheet.create({
  header: {
    height: 50,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#BDBDBD',
  },
  opener: {
    marginLeft: 10,
    fontSize: 20,
    width: 20,
    height: 20,
  },
  title: {
    fontSize: 20,
    flex: 1,
    textAlign: 'center',
  },
  ender: {
    marginRight: 10,
    width: 20,
    height: 20,
  },
  container: {
    padding: 10,
  },
  navigationContainer: {
    padding: 10,
    position: 'relative',
    height: '100%',
  },
  credit: {
    fontSize: 28,
    marginBottom: 50,
    marginLeft: 10,
  },
  menuActive: {
    width: '100%',
    backgroundColor: '#a7bf2e4d',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
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
    fontSize: 20,
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

export default Wrapper
