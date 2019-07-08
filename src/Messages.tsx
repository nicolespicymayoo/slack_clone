import React, { useEffect, useRef } from "react"
import { format, isSameDay } from "date-fns"
import useCollection from "./useCollection"
import { User } from "./App"
import useDocWithCache from "./useDocWithCache"
import "./Channel.css"
import { node } from "prop-types"

type Message = {
  text: string
  createdAt: {
    seconds: number
    nanoseconds: number
  }
  user: { id: string; path: string }
  id: string
}

const Messages: React.FC<{ channelId?: string }> = ({ channelId }) => {
  const messages = useCollection<Message>(`channels/${channelId}/messages`, "createdAt")

  return (
    <ChatScroller className="Messages">
      <div className="EndOfMessages">That's every message!</div>
      <div>
        {messages.map((message: Message, i: number) => {
          const prevMessage = messages[i - 1]
          const showAvatar = shouldShowAvatar(message, prevMessage)
          const showDay = shouldShowDay(message, prevMessage)
          return showAvatar ? (
            <MessageWithAvatar key={message.id} message={message} showDay={showDay} />
          ) : (
            <div key={message.id}>
              <div className="Message no-avatar">
                <div className="MessageContent">{message.text}</div>
              </div>
            </div>
          )
        })}
      </div>
    </ChatScroller>
  )
}
const ChatScroller: React.FC<{ [key: string]: any }> = props => {
  const ref = useRef<HTMLDivElement>(null)
  const shouldScrollRef = useRef(true)
  // checks if chat window should automatically scroll to the bottom when there is a new message
  useEffect(() => {
    if (shouldScrollRef.current) {
      const node = ref.current
      if (node) {
        node.scrollTop = node.scrollHeight
      }
    }
  })
  // calculates the scroll position and sets the 'shouldScrollReaf' to false if we are not at the bottom, and true if we are scrolled to the bottom
  const handleScroll = () => {
    const node = ref.current
    let atBottom = false
    if (node) {
      const { scrollTop, clientHeight, scrollHeight } = node
      atBottom = scrollHeight === clientHeight + scrollTop
    }
    shouldScrollRef.current = atBottom
  }

  return <div {...props} ref={ref} onScroll={handleScroll} />
}

const MessageWithAvatar: React.FC<{ message: Message; showDay: boolean }> = ({ message, showDay }) => {
  let author
  if (message.user.path) {
    author = useDocWithCache<User>(message.user.path)
  }
  return (
    <div key={message.id}>
      {showDay ? (
        <div className="Day">
          <div className="DayLine" />
          <div className="DayText">{new Date(message.createdAt.seconds * 1000).toLocaleDateString()}</div>
          <div className="DayLine" />
        </div>
      ) : null}
      <div className="Message with-avatar">
        <div className="Avatar" style={{ backgroundImage: author ? `url("${author.photoURL}")` : "" }} />
        <div className="Author">
          <div>
            <span className="UserName">{author && author.displayName}</span>
            <span className="TimeStamp"> {format(message.createdAt.seconds * 1000, "h:m A")}</span>
          </div>
          <div className="MessageContent">{message.text}</div>
        </div>
      </div>
    </div>
  )
}

const shouldShowAvatar = (message: Message, prevMessage: Message): boolean => {
  const isFirst = !prevMessage
  if (isFirst) {
    return true
  }
  const isDiffUser = message.user.id !== prevMessage.user.id
  if (isDiffUser) {
    return true
  }
  const hasBeenAWhile = message.createdAt.seconds - prevMessage.createdAt.seconds > 300

  return hasBeenAWhile
}

const shouldShowDay = (message: Message, prevMessage: Message): boolean => {
  if (!prevMessage) {
    return true
  }

  const isNewDay = !isSameDay(message.createdAt.seconds * 1000, prevMessage.createdAt.seconds * 1000)

  return isNewDay
}

export default Messages
