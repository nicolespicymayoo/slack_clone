import React from "react"
import { User } from "./App"
import useCollection from "./useCollection"

const Members: React.FC<{ channelId: string | undefined }> = ({ channelId }) => {
  const members = useCollection<User>("users", undefined, [`channels.${channelId}`, "==", true])
  console.log(members)
  return (
    <div className="Members">
      <div>
        {members.map(member => (
          <div className="Member" key={member.uid}>
            <div className={`MemberStatus ${member.status.state}`} />
            {member.displayName}
          </div>
        ))}
      </div>
    </div>
  )
}

export default Members
