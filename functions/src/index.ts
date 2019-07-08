import * as functions from "firebase-functions"
// import { useDebugValue } from "react"
const admin = require("firebase-admin")

admin.initializeApp()
const db = admin.firestore()

// sync the user status from real time db to firestore db
export const onUserStatusChanged = functions.database.ref("status/{userId}").onUpdate((change, context) => {
  const eventStatus = change.after.val()
  const userDoc = db.doc(`users/${context.params.userId}`)

  // makes sure the current status is correct. compares the times of status updates and sets the users status to the most recent one.
  return change.after.ref.once("value").then(snapshot => {
    const status = snapshot.val()
    if (status.lastChanged > eventStatus.lastChanged) {
      return
    }
    //changing time format from milisecond to real timestamp
    eventStatus.lastChanged = new Date(eventStatus.lastChanged)
    // update the user's status in firestore
    userDoc.update({
      status: eventStatus
    })
  })
})

const bot = {
  displayName: "cleverbot",
  photoURL: "https://imgur.com/a/NE8qENl",
  uid: "cleverbot",
  status: { state: "online", lastChanged: new Date() },
  channels: {
    general: true
  }
}
db.collection("users")
  .doc(bot.uid)
  .set(bot, { merge: true })

// watch when messages come in for clever bor
export const onCleverbotMessage = functions.firestore
  .document("channels/general/messages/{messageId}")
  .onCreate((doc, context) => {
    const message = doc.data()
    if (!message || !message.text.startsWith("@cleverbot")) {
      return
    }
    return db.collection("channels/general/messages").add({
      text:
        "hey! thanks for messaging me. i am currently not clever bc i am not free & my owner doesn't want to pay for me :/ it's a cold bot world ",
      user: db.collection("users").doc("cleverbot"),
      createdAt: new Date()
    })
  })

export const helloWorld = functions.https.onRequest((request, response) => {
  response.send("Hello from Firebase!")
})
