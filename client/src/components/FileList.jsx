import React from 'react'
import axios from 'axios'
import Card from "react-bootstrap/Card";
import Col from 'react-bootstrap/Col'
import Button from "react-bootstrap/Button";
import CardGroup from "react-bootstrap/CardGroup"
import Container from "react-bootstrap/Container"
import Row from "react-bootstrap/Row"
import DeleteModal from './DeleteModal.jsx'
import SingleCard from './SingleCard.jsx'
// import Col from "react-bootstrap/Col"

export default function FileList(props) {
  if (props.currentUsersFiles !== null) {
    return(
      <Row xs={1} md={5} className="g-4">
        {props.currentUsersFiles.map((file) => (
          <Col>
          <SingleCard
            file={file}
            showDeleteModal={props.showDeleteModal}
            hideDeleteModal={props.hideDeleteModal}
            modalState={props.modalState}
            loadFiles={props.loadFiles}
            userID={props.userID}
          />
          </Col>
        ))}
      </Row>
    )
  } else {
    return(null)
  }
}

function imageChecker({filename, url}) {
  if (filename.includes('.tif')) {
    return url
  }
  if (filename.includes('.tiff')) {
    return url
  }
  if (filename.includes('.bmp')) {
    return url
  }
  if (filename.includes('.jpg')) {
    return url
  }
  if (filename.includes('.jpeg')) {
    return url
  }
  if (filename.includes('.gif')) {
    return url
  }
  if (filename.includes('.png')) {
    return url
  }
  return "ef3-placeholder-image.jpg"
}