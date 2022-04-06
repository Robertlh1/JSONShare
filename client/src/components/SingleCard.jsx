import React from 'react'
import Card from "react-bootstrap/Card";
import Col from 'react-bootstrap/Col'
import Button from "react-bootstrap/Button";
import CardGroup from "react-bootstrap/CardGroup"
import Container from "react-bootstrap/Container"
import Row from "react-bootstrap/Row"
import DeleteModal from './DeleteModal.jsx'
import imageChecker from './imageChecker.js'

export default class SingleCard extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      showDeleteModal: false
    }
  }

  showDeleteModal() {
    this.setState({showDeleteModal: true})
  }

  hideDeleteModal() {
    this.setState({showDeleteModal: false})
  }

  render() {
    return(
      <Card key={Math.random() * 1000} className="m-3 cards" style={{ width: "18rem" }}>
      <DeleteModal
        show={this.state.showDeleteModal}
        onHide={this.hideDeleteModal.bind(this)}
        file={this.props.file}
        loadFiles={this.props.loadFiles}
        userID={this.props.userID}
      />
      <button className="xbutton red" onClick={() => (this.showDeleteModal())}>X</button>
      <Card.Img variant="top" src={imageChecker(this.props.file)} className="cardImgs"/>
      <Card.Body>
        <Card.Title>{this.props.file.filename}</Card.Title>
      </Card.Body>
      <Button variant="warning" href={this.props.file.url} target="_blank">Download File</Button>
    </Card>
    )
  }
}