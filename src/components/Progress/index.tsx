import React, { FC } from 'react'
import {
  ActivityIndicator,
  StyleProp,
  StyleSheet,
  View,
  ViewProps,
} from 'react-native'

export interface Props {
  readonly size?: number | 'small' | 'large'
  readonly style?: StyleProp<ViewProps>
}

const Progress: FC<Props> = ({ size, style }: Props) => {
  return (
    <View style={[styles.loading, style]}>
      <ActivityIndicator color="#a7bf2e" size={size ? size : 'large'} />
    </View>
  )
}

const styles = StyleSheet.create({
  loading: {
    width: '100%',
    alignItems: 'center',
  },
})

export default Progress
