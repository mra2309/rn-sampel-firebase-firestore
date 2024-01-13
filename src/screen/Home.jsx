import React, { useEffect, useState } from 'react'
import { Alert, Button, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native'

import { initializeApp } from "firebase/app";
import { collection, getDocs,addDoc,deleteDoc,doc, getFirestore, updateDoc } from "firebase/firestore"; 
import { SafeAreaView } from 'react-native-safe-area-context';

const firebaseConfig = {
    apiKey: "AIzaSyAnfTH9X8ZFl-GBt8kA2Rfnm4uTB_zoRYY",
    authDomain: "firestore-test-dc46c.firebaseapp.com",
    projectId: "firestore-test-dc46c",
    storageBucket: "firestore-test-dc46c.appspot.com",
    messagingSenderId: "1070710039523",
    appId: "1:1070710039523:web:2b237fe29a34a764ffb6d6"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default function Home() {
    const [data,setData] = useState([])
    const [nama,setNama] = useState([])
    const [alamat,setAlamat] = useState([])
    const [type,setType] = useState('edit')
    const [activeId,setActiveId] = useState([])

    //ambil data data-belaja
    const getData = async () =>{
        const querySnapshot = await getDocs(collection(db, "data-belaja"));
        let dumyArray = [];
        querySnapshot.forEach((doc) => {
            const {nama,alamat} = doc.data()
            dumyArray.push({
                key:doc.id,
                doc,
                nama,
                alamat
            })
        });
        setData(dumyArray)
    }

    //add data 
    const addData = async () => {
        try {
            const docRef = await addDoc(collection(db, "data-belaja"), {
              nama: nama,
              alamat: alamat,
            });
            alert("Proses Simpan Berhasil")
            getData();
            setNama('');
            setAlamat('');
          } catch (e) {
            console.error("Error adding document: ", e);
          }
    }

    const initDelete = async(param) =>{
          try {
            await deleteDoc(doc(db,"data-belaja",param))
            getData();
            alert("Proses Hapus Berhasil");
          } catch (error) {
            console.error("Error Hapus document: ", error);
          }
    }

    const initEdit = async(param) =>{
        setActiveId(param.key)
        setType('edit')
        setAlamat(param.alamat)
        setNama(param.nama)
    }

    const prosesEdit = async(param) =>{
        try {
          await updateDoc(doc(db,"data-belaja",activeId),{
            nama: nama,
            alamat: alamat,
          })
          getData();
          setType('simpan')
          setNama('')
          setAlamat('')
          alert("Proses Edit Berhasil");
        } catch (error) {
          console.error("Error Edit document: ", error);
        }
    }

    useEffect(()=>{
        getData()
    },[])

  return (
    <SafeAreaView>
        <ScrollView>
        <View>
            <TextInput
            style={styles.input}
            onChangeText={setNama}
            value={nama}
            placeholder='nama'
            />
            <TextInput
            style={styles.input}
            onChangeText={setAlamat}
            value={alamat}
            placeholder='alamat'
            />
            {type==='simpan'?(<Button title='simpan' onPress={()=>{addData()}}/>):(<Button title='edit' color={'orange'} onPress={()=>{prosesEdit()}}/>)}
        </View>

        {data.map((item,index)=>(
            <View style={{backgroundColor:'#7cacfa',padding:10,marginVertical:5,}} key={item.key}> 
                <View>
                    <View style={{alignItems:'center'}}>
                        <Text>nama :{item.nama}</Text>
                        <Text>alamat :{item.alamat}</Text>
                    </View>
                    <View style={{gap:10,padding:20}}>
                        <Button title='Edit' onPress={()=>{initEdit(item)}}/>
                        <Button title='hapus' onPress={()=>{initDelete(item.key)}}/>
                    </View>
                </View>
            </View>
        ))}
        </ScrollView>
    </SafeAreaView>
  )
};

const styles = StyleSheet.create({
    input: {
      height: 40,
      margin: 12,
      borderWidth: 1,
      borderRadius:5,
      padding: 10,
    },
  });




