import React from "react"
import useDoc from "./useDoc"
import { Channel } from "./App"

const ChannelInfo: React.FC<{ channelId?: string }> = ({ channelId }) => {
  const channel = useDoc<Channel>(`channels/${channelId}`)
  return (
    <div className="ChannelInfo">
      <div className="Topic">Topic: {channel && channel.topic}</div>
      <div className="ChannelName">#{channelId}</div>
    </div>
  )
}

export default ChannelInfo
