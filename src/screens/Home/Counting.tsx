import React, { FC, Fragment, useEffect, useMemo, useState } from 'react'
import {
  Dimensions,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'
import Modal from 'components/Modal'

export interface Item {
  readonly id: string
  readonly name: string
  readonly amount: number
  readonly price: number
}

export interface Props {
  items: ReadonlyArray<Item>
  onFinish: () => void
}

const Counting: FC<Props> = ({ items, onFinish }: Props) => {
  const [visible, setVisible] = useState<boolean>(false)
  const [payment, setPayment] = useState<number>()
  const { count, total } = useMemo(() => {
    return items.reduce(
      (prev, next) => {
        prev.count += next.amount
        prev.total += next.amount * next.price
        return prev
      },
      {
        count: 0,
        total: 0,
      },
    )
  }, [items])

  const setStatePayment = (v: string) => {
    const newVal = v.replace(/[^0-9]+/g, '')
    setPayment(parseInt(newVal, 10))
  }

  useEffect(() => {
    setPayment(undefined)
  }, [visible])

  return (
    <Fragment>
      {items.length > 0 ? (
        <View style={styles.container}>
          <TouchableOpacity
            style={styles.innerContainer}
            activeOpacity={0.8}
            onPress={() => setVisible(true)}>
            <Text style={styles.text}>{`${count} Items`}</Text>
            <View style={styles.items}>
              <Icon name="money" size={16} />
              <Text style={styles.text1}>{total}</Text>
            </View>
          </TouchableOpacity>
        </View>
      ) : undefined}
      <Modal
        collapsable={true}
        visible={visible}
        onRequestClose={() => setVisible(false)}>
        <SafeAreaView>
          <ScrollView>
            <Text style={styles.modalTitle}>Detail item</Text>
            <View style={styles.modalContainer}>
              {items.length > 0
                ? items.map(({ amount, name, price }, index) => (
                    <View key={index} style={styles.itemContainer}>
                      <View style={styles.itemInner}>
                        <Text style={styles.item}>{amount}</Text>
                      </View>
                      <Text style={styles.name}>{name}</Text>
                      <Text style={styles.price}>{amount * price}</Text>
                    </View>
                  ))
                : undefined}
              <View style={styles.payment}>
                <Text style={styles.label}>Total</Text>
                <TextInput
                  editable={false}
                  onChangeText={setStatePayment}
                  value={total.toString()}
                  style={styles.input}
                  placeholder="0"
                  keyboardType="numeric"
                />
              </View>
              <View style={styles.payment}>
                <Text style={styles.label}>Uang Bayar</Text>
                <TextInput
                  onChangeText={setStatePayment}
                  value={payment ? payment.toString() : undefined}
                  style={styles.input}
                  placeholder="0"
                  keyboardType="numeric"
                />
              </View>
              <View style={styles.payment}>
                <Text style={styles.label}>Kembalian</Text>
                <TextInput
                  editable={false}
                  style={styles.input}
                  keyboardType="numeric"
                  placeholder="0"
                  value={payment ? (payment - total).toString() : undefined}
                />
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
        <TouchableOpacity
          onPress={() => {
            onFinish()
            setVisible(false)
          }}
          style={styles.doneButton}>
          <Text>Selesai</Text>
        </TouchableOpacity>
      </Modal>
    </Fragment>
  )
}

const styles = StyleSheet.create({
  container: {
    zIndex: 0,
    position: 'absolute',
    borderRadius: 10,
    marginRight: 10,
    marginLeft: 10,
    width: Dimensions.get('screen').width - 20,
    bottom: 30,
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
    fontSize: 14,
  },
  text1: {
    fontSize: 14,
    marginLeft: 10,
  },
  items: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    paddingTop: 30,
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 180,
    flex: 1,
    width: '100%',
  },
  modalTitle: {
    fontSize: 20,
    textAlign: 'center',
  },
  closeButton: {
    zIndex: 10,
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
    elevation: 5,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    backgroundColor: '#a7bf2e',
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 15,
    paddingRight: 15,
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
  itemInner: {
    width: 25,
    height: 25,
    borderColor: '#000',
    borderWidth: 1,
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    marginRight: 10,
  },
  item: {
    fontSize: 14,
  },
  name: {
    flex: 1,
    fontSize: 16,
  },
  price: {
    fontSize: 16,
    color: '#000',
  },
  payment: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f95a37',
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 15,
    paddingRight: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
  },
  input: {
    width: 100,
    textAlign: 'right',
    padding: 0,
    color: '#000',
    fontSize: 16,
  },
  doneButton: {
    zIndex: 10,
    position: 'absolute',
    borderRadius: 10,
    marginRight: 10,
    marginLeft: 10,
    width: Dimensions.get('screen').width - 20,
    bottom: 30,
    height: 60,
    backgroundColor: '#a7bf2e',
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
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

export default Counting
