import React from 'react'
import axios from 'axios'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'

export default class LoginModal extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      registerUsername: '',
      registerPassword: '',
      confirmPassword: '',
      registerEmail: ''
    }
  }

  handleChange(event) {
    this.setState({[event.target.name]: event.target.value})
  }

  registerUser(event) {
    console.log('registering')
    event.preventDefault()
    axios.post('/api/register', {
      username: this.state.registerUsername,
      password: this.state.registerPassword,
      email: this.state.registerEmail
    })
    .then(data => {
      this.props.changeUser(JSON.parse(data.request.response)[0])
    })
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
              Sign up for the Hybrid Free Tier
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className="gold">
          <form onSubmit={this.registerUser.bind(this)}>
            <input
              className="forms"
              type="text"
              name="registerUsername"
              value={this.state.registerUsername}
              onChange={this.handleChange.bind(this)}
              placeholder="Username..."
              required>
            </input>
            <input
              className="forms"
              type="password"
              name="registerPassword"
              minlength="10"
              value={this.state.registerPassword}
              onChange={this.handleChange.bind(this)}
              placeholder="Password..."
              required>
            </input>
            <input
              className="forms"
              type="password"
              name="confirmPassword"
              minlength="10"
              value={this.state.confirmPassword}
              onChange={this.handleChange.bind(this)}
              placeholder="Confirm Password..."
              required>
            </input>
            <input
              className="forms"
              type="email"
              name="registerEmail"
              value={this.state.registerEmail}
              onChange={this.handleChange.bind(this)}
              placeholder="Email Address..."
              required>
            </input>
            <Button type="submit" variant="dark" className="red">Submit</Button>
          </form>
          </Modal.Body>
        </Modal>
      )
    } else {
      return(null)
    }
  }
}