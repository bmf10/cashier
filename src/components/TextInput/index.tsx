import React, { FC } from 'react'
import {
  StyleSheet,
  TextInput as RNTextInput,
  TextInputProps,
} from 'react-native'

const TextInput: FC<TextInputProps> = (props: TextInputProps) => {
  return <RNTextInput {...props} style={[styles.root, props.style]} />
}

const styles = StyleSheet.create({
  root: {
    height: 40,
    width: '70%',
    backgroundColor: '#fff',
    borderRadius: 5,
    textAlign: 'center',
    fontSize: 14,
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

export default TextInput
