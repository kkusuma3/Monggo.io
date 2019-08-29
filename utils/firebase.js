import firebase from 'firebase/app'

import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/storage'

const firebaseConfig = {
  apiKey: 'AIzaSyBbgH6Py3hg7LHrWNxPC-MUBIti6A8iFCg',
  authDomain: 'monggo-io.firebaseapp.com',
  databaseURL: 'https://monggo-io.firebaseio.com',
  projectId: 'monggo-io',
  storageBucket: '',
  messagingSenderId: '1015796918633',
  appId: '1:1015796918633:web:07292b6fcc399309'
}

if (firebase.apps.length === 0) {
  firebase.initializeApp(firebaseConfig)
}

export const auth = firebase.auth()
export const db = firebase.firestore()
export const storage = firebase.storage()
export const GoogleAuthProvider = new firebase.auth.GoogleAuthProvider()
