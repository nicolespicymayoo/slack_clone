import React from "react"
import { db } from "./firebase"
import { User } from "./App"

type Props = { user: User; channelId?: string }

const ChatInputBox: React.FC<Props> = ({ user, channelId }) => {
  return (
    <form
      onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        let inputEl = (e.target as HTMLFormElement).elements[0]
        let value = (inputEl as HTMLInputElement).value
        db.collection("channels")
          .doc(channelId)
          .collection("messages")
          .add({ text: value, createdAt: new Date(), user: db.collection("users").doc(user.uid) })
        ;(e.target as HTMLFormElement).reset()
      }}
      className="ChatInputBox"
    >
      <input className="ChatInput" placeholder={`Message #${channelId}`} />
    </form>
  )
}

export default ChatInputBox
