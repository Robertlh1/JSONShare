import React from 'react'

export default function InvalidLogin(props) {
  if (props.invalidFlag) {
    return (
      <div>Incorrect username/password, please try again.</div>
    )
  } else {
    return (null)
  }
}