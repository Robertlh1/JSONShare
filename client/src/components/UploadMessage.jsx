import React from 'react'

export default function UploadMessage(props) {
  if (props.uploadFlag) {
    return(
      <span>Thank you for uploading {props.lastFileName}! You can view it in the list below.</span>
    )
  } else {
    return(null)
  }
}