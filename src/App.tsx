import React, { useState, useEffect } from "react"
import "./App.scss"
import Nav from "./Nav"
import Channel from "./Channel"
import { firebase, db, setupPresence } from "./firebase"
import { Router, Redirect } from "@reach/router"

export type Channel = { topic: string; id: string }
export type User = {
  displayName: string | null
  photoURL: string | null
  uid: string
  channels?: { [channelId: string]: boolean }
  status: { state: string }
}

function App() {
  let user = useAuth()

  return user ? (
    <div className="App">
      <Nav user={user} />
      <Router>
        <Channel path="channel/:channelId" user={user} />
        <Redirect from="/" to="channel/general" noThrow />
      </Router>
    </div>
  ) : (
    <Login />
  )
}

function Login() {
  const [authError, setAuthError] = useState<any>(null)
  const handleSignIn = async () => {
    const provider = new firebase.auth.GoogleAuthProvider()
    try {
      await firebase.auth().signInWithPopup(provider)
    } catch (error) {
      setAuthError(error)
    }
  }
  return (
    <div className="login-container">
      <div className="login">
        <h2 className="login-title">Welcome to Secret Slack</h2>
        <p className="login-subtitle">The most exclusive Slack App in existence</p>
        <button onClick={handleSignIn} className="login-button">
          Sign in with Google
        </button>
        {authError ? (
          <div className="login-error">
            <p>Oops, there was a problem logging in.</p>
            <p>{authError.message}</p>
            <p>Please try again</p>
          </div>
        ) : null}
      </div>
    </div>
  )
}

function useAuth() {
  let [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    // onAuthStateChanged adds an observer for a user
    return firebase.auth().onAuthStateChanged(firebaseUser => {
      if (firebaseUser) {
        const user = {
          displayName: firebaseUser.displayName,
          photoURL: firebaseUser.photoURL,
          uid: firebaseUser.uid,
          status: { state: "online" }
        }
        setUser(user)
        db.collection("users")
          .doc(user.uid)
          .set(user, { merge: true })

        setupPresence(user)
      } else {
        setUser(null)
      }
    })
  }, [])
  return user
}

export default App
