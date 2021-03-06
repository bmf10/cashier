import React, { FC, useEffect, useMemo, useState } from 'react'
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
  readonly id?: string
  readonly onSuccess: () => void
}

const Modal: FC<Props> = ({
  visible,
  onClose,
  state,
  id,
  onSuccess,
}: Props) => {
  const [name, setName] = useState<string>()
  const [price, setPrice] = useState<number>()
  const [loading, setLoading] = useState<boolean>(false)
  const [loadingDelete, setLoadingDelete] = useState<boolean>(false)
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

  useEffect(() => {
    if (state === 'edit' && id) {
      productCollection.find(id).then((value) => {
        setName(value.name)
        setPrice(value.price)
      })
    }
  }, [id, productCollection, state])

  const onSubmit = () => {
    if (name && price) {
      setError(undefined)
      setLoading(true)
      if (state === 'new') {
        database.action(async () => {
          try {
            await productCollection.create((entity) => {
              entity.name = name
              entity.price = price
              entity.isArchive = false
            })
            setLoading(false)
            onSuccess()
            onRequestClose()
          } catch (e) {
            setLoading(false)
            setError(e)
          }
        })
      } else if (state === 'edit' && id) {
        database.action(async () => {
          try {
            const product = await productCollection.find(id)
            await product.update((entity) => {
              entity.name = name
              entity.price = price
              entity.isArchive = false
            })
            setLoading(false)
            onSuccess()
            onRequestClose()
          } catch (e) {
            setLoading(false)
            setError(e)
          }
        })
      } else {
        onRequestClose()
      }
    } else {
      setError('Data belum lengkap')
    }
  }

  const onDelete = () => {
    setError(undefined)
    setLoadingDelete(true)
    if (state === 'edit' && id) {
      database.action(async () => {
        try {
          const product = await productCollection.find(id)
          await product.update((entity) => {
            entity.isArchive = true
          })
          setLoadingDelete(false)
          onSuccess()
          onRequestClose()
        } catch (e) {
          setLoadingDelete(false)
          setError(e)
        }
      })
    }
  }

  const onRequestClose = () => {
    setName(undefined)
    setPrice(undefined)
    setError(undefined)
    setLoading(false)
    onClose()
  }

  return (
    <RNModal
      visible={visible}
      onRequestClose={onRequestClose}
      animationType="slide">
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
            value={price ? price.toString() : undefined}
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
              <TouchableOpacity
                disabled={loading}
                onPress={onDelete}
                style={styles.buttonDelete}>
                {loadingDelete ? (
                  <ActivityIndicator size="small" color="#000" />
                ) : (
                  <Text>Arsipkan</Text>
                )}
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
    backgroundColor: '#fff',
    borderRadius: 5,
    marginBottom: 20,
    textAlign: 'center',
    fontSize: 18,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
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
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
  buttonDelete: {
    backgroundColor: '#f95a37',
    paddingLeft: 30,
    paddingRight: 30,
    paddingTop: 10,
    paddingBottom: 10,
    borderRadius: 5,
    marginLeft: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
  error: {
    color: '#f95a37',
    marginTop: 20,
  },
})

export default Modal
