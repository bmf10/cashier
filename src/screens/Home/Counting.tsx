import React, { FC, Fragment, useMemo } from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'

export interface Item {
  readonly id: string
  readonly name: string
  readonly amount: number
  readonly price: number
}

export interface Props {
  items: ReadonlyArray<Item>
}

const Counting: FC<Props> = ({ items }: Props) => {
  const count = useMemo(() => {
    return items.reduce((prev, next) => prev + next.amount, 0)
  }, [items])

  return (
    <Fragment>
      {items.length > 0 ? (
        <View style={styles.container}>
          <TouchableOpacity style={styles.innerContainer}>
            <Text style={styles.text}>Items</Text>
            <View style={styles.items}>
              <Text style={styles.text1}>{count}</Text>
            </View>
          </TouchableOpacity>
        </View>
      ) : undefined}
    </Fragment>
  )
}

const styles = StyleSheet.create({
  container: {
    zIndex: 0,
    position: 'absolute',
    borderRadius: 10,
    marginRight: '7%',
    marginLeft: '7%',
    width: '86%',
    bottom: '10%',
    height: 60,
    backgroundColor: '#a7bf2e',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
  innerContainer: {
    height: '100%',
    width: '100%',
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
  },
  text1: {
    fontSize: 18,
  },
  items: {
    backgroundColor: '#cae05c',
    width: 30,
    height: 30,
    borderRadius: 30,
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
  },
})

export default Counting
