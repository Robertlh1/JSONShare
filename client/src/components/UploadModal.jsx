import React from 'react'
import axios from 'axios'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'

export default class UploadModal extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedFile: null,
      uploadFlag: false,
      lastFileName: null
    }
  }

  uploadFile(event) {
    this.setState({selectedFile: event.target.files[0]})
  }

  onSubmit(event) {
    event.preventDefault();
    const formData = new FormData();
    formData.append(
      "myFile",
      this.state.selectedFile,
      this.state.selectedFile.name
    )
    formData.append(
      "userID",
      this.props.userID
    )
    axios.post("api/fileUpload", formData)
    .then((res) => {
      axios.post('/api/files', {userID: this.state.userID})
      .then((res) => {
        this.setState({lastFileName: this.state.selectedFile.name, selectedFile: null, uploadFlag: true})
        this.props.loadFiles()
        this.props.onHide()
      })
    })
  }

  render() {
      return (
        <Modal
          {...this.props}
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Modal.Header className="red" closeButton>
            <Modal.Title id="contained-modal-title-vcenter">
              Upload a file! There is a maximum size of 50mb.
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className="gold">
            <form onSubmit={this.onSubmit.bind(this)}>
              <input name="file" type="file" onChange={this.uploadFile.bind(this)}></input>
              <Button type="submit" variant="dark" className="red">Submit</Button>
            </form>
          </Modal.Body>
        </Modal>
      )
  }
}