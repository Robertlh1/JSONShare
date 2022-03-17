import React from 'react'
import axios from 'axios'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'

export default class DeleteModal extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
    }
  }

  deleteFile(event) {
    event.preventDefault();
    console.log(this.props.file)
    axios.post('api/delete', {filename: this.props.file.filename, hash: this.props.file.hash})
    .then(this.props.loadFiles())
    this.props.onHide()
  }

  render() {
    if (this.props.show) {
      console.log('yes')
      return (
        <Modal
          {...this.props}
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Modal.Header className="red" closeButton>
            <Modal.Title id="contained-modal-title-vcenter">
              Are you sure you want to Delete {this.props.file.filename}?
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className="gold">
          <Button type="submit" variant="success" style={{float: "left"}} onClick={this.props.onHide}>No!</Button>
          <Button type="submit" variant="dark" className="red" style={{float: "right"}} onClick={this.deleteFile.bind(this)}>Yes!</Button>
          </Modal.Body>
        </Modal>
      )
    } else {
      console.log('no')
      return (null)
    }
  }
}