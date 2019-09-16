/**
 * This file exposes any Firebase method that used in the entire app.
 */

import firebase from 'firebase/app'

import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/storage'

// Config taken from https://console.firebase.google.com/u/0/project/monggo-io/settings/general/web
const firebaseConfig = {
  apiKey: 'AIzaSyBbgH6Py3hg7LHrWNxPC-MUBIti6A8iFCg',
  authDomain: 'monggo-io.firebaseapp.com',
  databaseURL: 'https://monggo-io.firebaseio.com',
  projectId: 'monggo-io',
  storageBucket: 'monggo-io.appspot.com',
  messagingSenderId: '1015796918633',
  appId: '1:1015796918633:web:07292b6fcc399309'
}

// Initialize firebase using those config above
if (firebase.apps.length === 0) {
  firebase.initializeApp(firebaseConfig)
}

// Export auth method
export const auth = firebase.auth()

// Export firestore method
export const db = firebase.firestore()

// Export firebase storage method
export const storage = firebase.storage()

// Export Google auth provider
export const GoogleAuthProvider = new firebase.auth.GoogleAuthProvider()
export const googleAuthProviderCredential =
  firebase.auth.GoogleAuthProvider.credential
