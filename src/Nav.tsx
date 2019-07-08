import React from "react"
import "./Nav.css"
import useCollection from "./useCollection"
import { firebase } from "./firebase"
import { User } from "./App"
import { Link } from "@reach/router"

type Channel = { topic: string; id: string }
type Props = { user: User }

let Nav: React.FC<Props> = ({ user }) => {
  const channels = useCollection<Channel>("channels")
  const logout = () => {
    firebase.auth().signOut()
  }
  return (
    <div className="Nav">
      <div className="User">
        <img className="UserImage" src={user.photoURL || undefined} />
        <div>
          <div>{user.displayName}o</div>
          <div>
            <button onClick={logout} className="text-button">
              log out
            </button>
          </div>
        </div>
      </div>
      <nav className="ChannelNav">
        {channels.map(channel => (
          <NavLink to={`/channel/${channel.id}`} key={channel.id}>
            # {channel.id}
          </NavLink>
        ))}
      </nav>
    </div>
  )
}

const NavLink = (props: any) => (
  <Link
    {...props}
    getProps={({ isCurrent }) => {
      return {
        style: {
          backgroundColor: isCurrent ? "rgb(151, 189, 221)" : "rgba(0,0,0,0)"
        }
      }
    }}
  />
)

export default Nav
