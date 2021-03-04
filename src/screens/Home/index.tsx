import Wrapper from 'components/Wrapper'
import React, { FC, useMemo, useState } from 'react'
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

const Home: FC = () => {
  const [openEdit, setOpenEdit] = useState<boolean>(false)
  const [openNew, setOpenNew] = useState<boolean>(false)
  const [data, setData] = useState<ReadonlyArray<ProductEntity>>([])
  const [loading, setLoading] = useState<boolean>(true)
  const database = useDatabase()
  const productCollection = useMemo(
    () => database.collections.get<Product>('products'),
    [database.collections],
  )

  useMemo(async () => {
    if (data.length === 0) {
      setLoading(true)
      await database.action(async () => {
        try {
          const value = await productCollection.query().fetch()
          setData(value)
          setLoading(false)
        } catch (error) {
          setLoading(false)
        }
      })
    }
  }, [data.length, database, productCollection])

  return (
    <Wrapper title="Menu">
      <View style={styles.container}>
        {loading ? (
          <View style={styles.loading}>
            <ActivityIndicator color="#a7bf2e" size="large" />
          </View>
        ) : data ? (
          data.map(({ name, price }, index) => (
            <View style={styles.box} key={index}>
              <TouchableOpacity
                onLongPress={() => setOpenEdit(true)}
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
      </View>
      <Modal
        state="edit"
        onClose={() => setOpenEdit(false)}
        visible={openEdit}
      />
      <Modal state="new" onClose={() => setOpenNew(false)} visible={openNew} />
    </Wrapper>
  )
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  box: {
    width: '33.3333333%',
    height: 120,
    padding: 5,
  },
  innerBox: {
    borderRadius: 5,
    borderColor: '#BDBDBD',
    borderWidth: 1,
    height: '100%',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
  },
  name: {
    fontWeight: 'bold',
    fontSize: 20,
  },
  price: {
    fontWeight: 'bold',
    fontSize: 18,
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
