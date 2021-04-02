import React, { FC } from 'react'
import { StyleSheet, TouchableOpacity, View } from 'react-native'

export interface Props {
  readonly onPress?: () => void
  readonly onLongPress?: () => void
  readonly children: React.ReactNode
}

const Box: FC<Props> = ({ children, onLongPress, onPress }: Props) => {
  return (
    <View style={styles.root}>
      <TouchableOpacity
        activeOpacity={0.8}
        style={styles.innerRoot}
        onPress={onPress}
        onLongPress={onLongPress}>
        {children}
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  root: {
    width: '33.3333333%',
    height: 140,
    padding: 5,
  },
  innerRoot: {
    borderRadius: 10,
    backgroundColor: '#fff',
    height: '100%',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    padding: 5,
  },
})

export default Box
