import firebase from "firebase/app"
import "firebase/firestore"
import "firebase/database"
import "firebase/auth"
import { User } from "./App"

const config = {
  apiKey: "AIzaSyAac2CsD2Q8fvnu9mY1iyoN7Smt910XPvY",
  authDomain: "chat-app-3acf5.firebaseapp.com",
  databaseURL: "https://chat-app-3acf5.firebaseio.com",
  projectId: "chat-app-3acf5",
  storageBucket: "chat-app-3acf5.appspot.com",
  messagingSenderId: "622237744236"
}

firebase.initializeApp(config)
const db = firebase.firestore()
const rtdb = firebase.database()

export function setupPresence(user: User) {
  const isOfflineforRTDB = {
    state: "offline",
    lastChanged: firebase.database.ServerValue.TIMESTAMP
  }
  const isOnlineforRTDB = {
    state: "online",
    lastChanged: firebase.database.ServerValue.TIMESTAMP
  }

  const isOfflineforFirestore = {
    state: "offline",
    lastChanged: firebase.firestore.FieldValue.serverTimestamp()
  }
  const isOnlineforFirestore = {
    state: "online",
    lastChanged: firebase.firestore.FieldValue.serverTimestamp()
  }

  const rtdbRef = rtdb.ref(`/status/${user.uid}`)
  const userDoc = db.doc(`/users/${user.uid}`)

  rtdb.ref(".info/connected").on("value", async snapshot => {
    if (snapshot && snapshot.val() === false) {
      userDoc.update({
        status: isOfflineforFirestore
      })
      return
    }
    await rtdbRef.onDisconnect().set(isOfflineforRTDB)
    rtdbRef.set(isOnlineforRTDB)
    userDoc.update({
      status: isOnlineforFirestore
    })
  })
}

export { db, firebase }
