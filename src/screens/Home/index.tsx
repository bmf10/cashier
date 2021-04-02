import React, { FC, Fragment, useEffect, useState } from 'react'
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  ScrollView,
  SafeAreaView,
} from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'
import Modal from './Modal'
import { useDatabase } from '@nozbe/watermelondb/hooks'
import type Product from 'models/product'
import type { ProductEntity } from 'models/product'
import { where } from '@nozbe/watermelondb/QueryDescription'
import Counting, { Item } from './Counting'
import Box from 'components/Box'
import Container from 'components/Container'

const Home: FC = () => {
  const [openEdit, setOpenEdit] = useState<boolean>(false)
  const [openNew, setOpenNew] = useState<boolean>(false)
  const [editId, setEditId] = useState<string>()
  const [data, setData] = useState<ReadonlyArray<ProductEntity>>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [items, setItems] = useState<ReadonlyArray<Item>>([])
  const database = useDatabase()
  const productCollection = database.collections.get<Product>('products')

  useEffect(() => {
    if (data.length === 0) {
      setLoading(true)
      database.action(() =>
        productCollection
          .query(where('isArchive', false))
          .fetch()
          .then((value) => {
            setData(value)
            setLoading(false)
          })
          .catch(() => setLoading(false)),
      )
    }
  }, [data.length, database, productCollection])

  const onSuccess = () => {
    setEditId(undefined)
    setLoading(true)
    database.action(() =>
      productCollection
        .query(where('isArchive', false))
        .fetch()
        .then((value) => {
          setData(value)
          setLoading(false)
        })
        .catch(() => setLoading(false)),
    )
  }

  const handleEdit = (id: string) => {
    setEditId(id)
    setOpenEdit(true)
  }

  const handleAdd = (id: string, name: string, price: number) => {
    const index = items.findIndex((i) => i.id === id)
    if (index < 0) {
      setItems([...items, { id, name, price, amount: 1 }])
    } else {
      const item = items.map((x, i) =>
        i === index ? { ...x, amount: x.amount + 1 } : x,
      )
      setItems(item)
    }
  }

  const handleOperator = (
    condition: 'plus' | 'minus',
    id: string,
    name: string,
    price: number,
  ) => {
    if (condition === 'plus') {
      const index = items.findIndex((i) => i.id === id)
      if (index < 0) {
        setItems([...items, { id, name, price, amount: 1 }])
      } else {
        const item = items.map((x, i) =>
          i === index ? { ...x, amount: x.amount + 1 } : x,
        )
        setItems(item)
      }
    } else if (condition === 'minus') {
      const selectedItem = items.find((i) => i.id === id)
      if (selectedItem && selectedItem.amount <= 1) {
        const item = items.filter((i) => i.id !== selectedItem.id)
        setItems(item)
      } else if (selectedItem) {
        const item = items.map((x) =>
          x.id === selectedItem.id ? { ...x, amount: x.amount - 1 } : x,
        )
        setItems(item)
      }
    }
  }

  return (
    <Fragment>
      <SafeAreaView>
        <ScrollView>
          <Container>
            {loading ? (
              <View style={styles.loading}>
                <ActivityIndicator color="#a7bf2e" size="large" />
              </View>
            ) : data ? (
              data.map(({ name, price, id }, index) => (
                <Box
                  key={index}
                  onPress={() => handleAdd(id, name, price)}
                  onLongPress={() => handleEdit(id)}>
                  <Text style={styles.name}>{name}</Text>
                  <Text style={styles.price}>{price}</Text>
                  {items.find((i) => i.id === id) ? (
                    <View style={styles.operator}>
                      <TouchableOpacity
                        activeOpacity={0.5}
                        onPress={() => handleOperator('minus', id, name, price)}
                        style={styles.minus}>
                        <Text>-</Text>
                      </TouchableOpacity>
                      <TextInput
                        editable={false}
                        style={styles.input}
                        value={items
                          .find((i) => i.id === id)
                          ?.amount.toString()}
                      />
                      <TouchableOpacity
                        activeOpacity={0.5}
                        onPress={() => handleOperator('plus', id, name, price)}
                        style={styles.plus}>
                        <Text>+</Text>
                      </TouchableOpacity>
                    </View>
                  ) : undefined}
                </Box>
              ))
            ) : undefined}
            {!loading ? (
              <Box onPress={() => setOpenNew(true)}>
                <Icon name="plus" size={25} />
              </Box>
            ) : undefined}
          </Container>
        </ScrollView>
        <Modal
          onSuccess={onSuccess}
          id={editId}
          state="edit"
          onClose={() => setOpenEdit(false)}
          visible={openEdit}
        />
        <Modal
          onSuccess={onSuccess}
          state="new"
          onClose={() => setOpenNew(false)}
          visible={openNew}
        />
      </SafeAreaView>
      <Counting onFinish={() => setItems([])} items={items} />
    </Fragment>
  )
}

const styles = StyleSheet.create({
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
  box: {
    width: '33.3333333%',
    height: 140,
    padding: 5,
  },
  innerBox: {
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
  },
  name: {
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
  },
  price: {
    fontWeight: 'bold',
    marginTop: 5,
    fontSize: 14,
    textAlign: 'center',
    color: '#f95a37',
  },
  modal: {
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    top: 20,
    right: 20,
  },
  loading: {
    width: '100%',
    alignItems: 'center',
  },
  operator: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  plus: {
    width: 25,
    height: 25,
    borderRadius: 25,
    backgroundColor: '#a7bf2e',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  minus: {
    width: 25,
    height: 25,
    borderRadius: 25,
    backgroundColor: '#f95a37',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    fontSize: 14,
    textAlign: 'center',
    width: 'auto',
  },
})

export default Home
