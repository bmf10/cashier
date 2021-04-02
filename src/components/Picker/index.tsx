import React, { FC } from 'react'
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native'
import { Picker as RNPicker } from '@react-native-picker/picker'

export interface Item {
  readonly label: string
  readonly value: string | number
}

export interface Props {
  readonly items: ReadonlyArray<Item>
  readonly onSelect?: (value: string | number, index: number) => void
  readonly value?: string | number
  readonly containerStyle?: StyleProp<ViewStyle>
  readonly placeholder?: string
}

const Picker: FC<Props> = ({
  items,
  onSelect,
  value,
  containerStyle,
  placeholder,
}: Props) => {
  return (
    <View style={[styles.container, containerStyle]}>
      <RNPicker
        style={styles.picker}
        selectedValue={value}
        onValueChange={onSelect}>
        <RNPicker.Item
          value=""
          style={styles.item}
          label={placeholder ? placeholder : 'Select Item'}
        />
        {items.map((item, index) => (
          <RNPicker.Item
            key={index}
            style={styles.item}
            value={item.value}
            label={item.label}
          />
        ))}
      </RNPicker>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingLeft: 0,
    paddingRight: 10,
    height: 40,
    width: '70%',
    backgroundColor: '#fff',
    borderRadius: 5,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
  picker: {
    width: '100%',
    marginTop: -6,
  },
  item: {
    fontSize: 14,
  },
})

export default Picker
