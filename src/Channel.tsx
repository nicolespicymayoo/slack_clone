import React, { useEffect } from "react"
import ChannelInfo from "./ChannelInfo"
import Messages from "./Messages"
import ChatInputBox from "./ChatInputBox"
import Members from "./Members"
import "./Channel.css"
import { db } from "./firebase"
import { User } from "./App"
import { RouteComponentProps } from "@reach/router"
type Props = { user: User }

const Channel: React.FC<Props & RouteComponentProps<{ channelId: string }>> = ({ user, channelId }) => {
  useEffect(() => {
    if (channelId) {
      db.doc(`users/${user.uid}`).update({
        [`channels.${channelId}`]: true
      })
    }
  }, [user.uid, channelId])
  return (
    <div className="Channel">
      <div className="ChannelMain">
        <ChannelInfo channelId={channelId} />
        <Messages channelId={channelId} />
        <ChatInputBox user={user} channelId={channelId} />
      </div>
      <Members channelId={channelId} />
    </div>
  )
}

export default Channel
