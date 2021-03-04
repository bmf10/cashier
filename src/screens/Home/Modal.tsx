import React, { FC, useMemo, useState } from 'react'
import {
  Modal as RNModal,
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  ActivityIndicator,
} from 'react-native'
import { TextInput } from 'react-native-gesture-handler'
import Icon from 'react-native-vector-icons/FontAwesome'
import { useDatabase } from '@nozbe/watermelondb/hooks'
import type Product from 'models/product'

export interface Props {
  readonly visible: boolean
  readonly onClose: () => void
  readonly state: 'edit' | 'new'
}

const Modal: FC<Props> = ({ visible, onClose, state }: Props) => {
  const [name, setName] = useState<string>()
  const [price, setPrice] = useState<number>()
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>()
  const database = useDatabase()
  const productCollection = useMemo(
    () => database.collections.get<Product>('products'),
    [database.collections],
  )

  const changePrice = (v: string) => {
    const newVal = v.replace(/[^0-9]+/g, '')
    setPrice(parseInt(newVal, 10))
  }

  const onSubmit = async () => {
    if (name && price) {
      setError(undefined)
      setLoading(true)
      if (state === 'new') {
        await database.action(async () => {
          try {
            await productCollection.create((post) => {
              post.name = name
              post.price = price
            })
            setLoading(false)
            onClose()
          } catch (e) {
            setLoading(false)
            setError(e)
          }
        })
      }
    } else {
      setError('Data belum lengkap')
    }
  }

  return (
    <RNModal visible={visible} onRequestClose={onClose} animationType="slide">
      <View style={styles.modal}>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Icon name="times" size={25} />
        </TouchableOpacity>
        <Text style={styles.title}>
          {state === 'edit' ? 'Edit Produk' : 'Tambah Produk'}
        </Text>
        <View style={styles.form}>
          <TextInput
            onChangeText={(v) => setName(v)}
            value={name}
            placeholder="Nama..."
            editable={!loading}
            style={styles.input}
          />
          <TextInput
            onChangeText={changePrice}
            value={price?.toString()}
            editable={!loading}
            keyboardType="number-pad"
            placeholder="Harga..."
            style={styles.input}
          />
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              onPress={onSubmit}
              disabled={loading}
              style={styles.buttonSave}>
              {loading ? (
                <ActivityIndicator size="small" color="#000" />
              ) : (
                <Text>Simpan</Text>
              )}
            </TouchableOpacity>
            {state === 'edit' ? (
              <TouchableOpacity style={styles.buttonDelete}>
                <Text>Hapus</Text>
              </TouchableOpacity>
            ) : undefined}
          </View>
          {error ? <Text style={styles.error}>{error}</Text> : undefined}
        </View>
      </View>
    </RNModal>
  )
}

const styles = StyleSheet.create({
  modal: {
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    paddingTop: 20,
  },
  closeButton: {
    position: 'absolute',
    top: 20,
    right: 20,
  },
  title: {
    fontSize: 25,
  },
  form: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    height: 40,
    width: '70%',
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 5,
    marginBottom: 20,
    textAlign: 'center',
    fontSize: 18,
  },
  buttonContainer: {
    flexDirection: 'row',
  },
  buttonSave: {
    backgroundColor: '#a7bf2e',
    paddingLeft: 30,
    paddingRight: 30,
    paddingTop: 10,
    paddingBottom: 10,
    borderRadius: 5,
    marginRight: 5,
  },
  buttonDelete: {
    backgroundColor: '#f95a37',
    paddingLeft: 30,
    paddingRight: 30,
    paddingTop: 10,
    paddingBottom: 10,
    borderRadius: 5,
    marginLeft: 5,
  },
  error: {
    color: '#f95a37',
    marginTop: 20,
  },
})

export default Modal
