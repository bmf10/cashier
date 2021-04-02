import React, { FC } from 'react'
import {
  Modal as RNModal,
  ModalProps,
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'

interface Props extends Omit<ModalProps, 'children'> {
  readonly children: React.ReactNode
  readonly style?: StyleProp<ViewStyle>
}

const Modal: FC<Props> = (props: Props) => {
  return (
    <RNModal {...props} animationType="slide">
      <View style={props.style ? props.style : styles.root}>
        <TouchableOpacity
          onPress={props.onRequestClose}
          activeOpacity={0.8}
          style={styles.closeButton}>
          <Icon name="times" size={25} />
        </TouchableOpacity>
        {props.children}
      </View>
    </RNModal>
  )
}

const styles = StyleSheet.create({
  root: {
    height: '100%',
    position: 'relative',
    paddingTop: 30,
  },
  closeButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    height: 40,
    width: 40,
    backgroundColor: '#fff',
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    zIndex: 100000,

    elevation: 5,
  },
})

export default Modal
