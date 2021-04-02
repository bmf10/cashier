import React, { FC } from 'react'
import { StyleProp, View, ViewStyle } from 'react-native'

export interface Props {
  readonly children: React.ReactNode
  readonly style?: StyleProp<ViewStyle>
}

const Container: FC<Props> = ({ children, style }: Props) => {
  return <View style={[styles.container, style]}>{children}</View>
}

const styles = {
  container: {
    position: 'relative',
    display: 'flex',
    flexWrap: 'wrap',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    height: '100%',
    width: '100%',
    paddingLeft: 5,
    paddingRight: 5,
    paddingBottom: 180,
  },
}

export default Container
