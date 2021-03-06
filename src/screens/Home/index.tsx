import React, { FC, Fragment, useEffect, useState } from 'react'
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'
import Modal from './Modal'
import { useDatabase } from '@nozbe/watermelondb/hooks'
import type Product from 'models/product'
import type { ProductEntity } from 'models/product'
import { where } from '@nozbe/watermelondb/QueryDescription'
import Counting, { Item } from './Counting'

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

  return (
    <Fragment>
      <View style={styles.container}>
        {loading ? (
          <View style={styles.loading}>
            <ActivityIndicator color="#a7bf2e" size="large" />
          </View>
        ) : data ? (
          data.map(({ name, price, id }, index) => (
            <View style={styles.box} key={index}>
              <TouchableOpacity
                onPress={() => handleAdd(id, name, price)}
                onLongPress={() => handleEdit(id)}
                style={styles.innerBox}>
                <Text style={styles.name}>{name}</Text>
                <Text style={styles.price}>{price}</Text>
              </TouchableOpacity>
            </View>
          ))
        ) : undefined}
        {!loading ? (
          <View style={styles.box}>
            <TouchableOpacity
              onPress={() => setOpenNew(true)}
              style={styles.innerBox}>
              <Icon name="plus" size={30} />
            </TouchableOpacity>
          </View>
        ) : undefined}

        <Counting items={items} />
      </View>
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
  },
  box: {
    width: '33.3333333%',
    height: 120,
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
    fontSize: 20,
    textAlign: 'center',
  },
  price: {
    fontWeight: 'bold',
    marginTop: 5,
    fontSize: 18,
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
})

export default Home
