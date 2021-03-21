import React, { FC } from 'react'
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
} from 'react-native'

export interface ButtonProps extends TouchableOpacityProps {
  readonly text: string
  readonly variant?: 'success' | 'error'
  readonly isLoading?: boolean
}

const Button: FC<ButtonProps> = (props: ButtonProps) => {
  const { variant, isLoading, style } = props
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      {...props}
      style={
        variant && variant === 'error'
          ? [styles.error, style]
          : [styles.success, style]
      }>
      {isLoading ? (
        <ActivityIndicator size="small" color="#000" />
      ) : (
        <Text>{props.text}</Text>
      )}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  success: {
    backgroundColor: '#a7bf2e',
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
  error: {
    backgroundColor: '#f95a37',
    borderRadius: 5,
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
export default Button
