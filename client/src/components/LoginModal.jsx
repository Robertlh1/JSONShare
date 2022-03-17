import React from 'react'
import axios from 'axios'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'

export default class LoginModal extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      loginUsername: '',
      loginPassword: '',
      invalidFlag: false
    }
  }

  handleChange(event) {
    this.setState({[event.target.name]: event.target.value})
  }

  submitLogin(event) {
    event.preventDefault()
    axios.post('api/login', {username: this.state.loginUsername, password: this.state.loginPassword})
    .then(data => {
      if (typeof JSON.parse(data.request.response)[0].id === 'string') {
        this.setState({invalidFlag: true})
      } else {
        this.setState({invalidFlag: false})
        this.props.changeUser(JSON.parse(data.request.response)[0])
      }
    }).then(this.props.loadFiles())
  }

  render() {
    if (this.props.currentUser === null) {
      return (
        <Modal
          {...this.props}
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Modal.Header className="red" closeButton>
            <Modal.Title id="contained-modal-title-vcenter">
              Login!
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className="gold">
          <form onSubmit={this.submitLogin.bind(this)}>
              <input
                className="forms"
                type="text"
                name="loginUsername"
                value={this.state.loginUsername}
                onChange={this.handleChange.bind(this)}
                placeholder="Username..."
                require>
              </input>
              <input
                className="forms"
                type="password"
                name="loginPassword"
                value={this.state.loginPassword}
                onChange={this.handleChange.bind(this)}
                placeholder="Password..."
                require>
              </input>
              <Button type="submit" variant="dark" className="red">Login!</Button>
            </form>
          </Modal.Body>
        </Modal>
      )
    } else {
      return(null)
    }
  }
}