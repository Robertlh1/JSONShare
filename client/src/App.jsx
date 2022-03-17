import axios from 'axios';
import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import FileList from './components/FileList.jsx'
import MyNavbar from './components/MyNavbar.jsx'
import LoginModal from './components/LoginModal.jsx'
import RegisterModal from './components/RegisterModal.jsx'
import UploadModal from './components/UploadModal.jsx'
import Button from 'react-bootstrap/Button'

export default class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      currentUser: null,
      userID: null,
      currentUsersFiles: null,
      fetchNewFiles: true,
      showLoginModal: false,
      showRegisterModal: false,
      showUploadModal: false
    }
  }

  componentDidMount() {
    axios.post('/api/files', {userID: this.state.userID})
    .then(data => {
      this.setState({currentUsersFiles: JSON.parse(data.request.response)})
    })
  }

  async loadFiles() {
    console.log('loadFiles')
    setTimeout(() => {
      axios.post('/api/files', {userID: this.state.userID}).then(data => {
        this.setState({currentUsersFiles: JSON.parse(data.request.response)})
      })
    }, 500)
  }

  toggleFetch() {
    this.setState({fetchNewFiles: true})
  }

  changeUser(event) {
    this.setState({currentUser: event.username, userID: event.id})
  }

  changeFiles(event) {
    this.setState({currentUsersFiles: event, fetchNewFiles: false})
  }

  logOut() {
    this.setState({currentUser: null, userID: null, currentUsersFiles: null, fetchNewFiles: true, showLoginModal: false, showRegisterModal: false, showUploadModal: false})
    this.forceUpdate()
  }

  showLoginModal() {
    this.setState({showLoginModal: true})
  }

  hideLoginModal() {
    this.setState({showLoginModal: false})
  }

  showRegisterModal() {
    this.setState({showRegisterModal: true})
  }

  hideRegisterModal() {
    this.setState({showRegisterModal: false})
  }

  showUploadModal() {
    this.setState({showUploadModal: true})
  }

  hideUploadModal() {
    this.setState({showUploadModal: false})
  }

  render() {
    return (
      <div>
        <LoginModal
          show={this.state.showLoginModal}
          onHide={this.hideLoginModal.bind(this)}
          currentUser={this.state.currentUser}
          userID={this.state.userID}
          changeUser={this.changeUser.bind(this)}
          loadFiles={this.loadFiles.bind(this)}
        />
        <RegisterModal
          show={this.state.showRegisterModal}
          onHide={this.hideRegisterModal.bind(this)}
          currentUser={this.state.currentUser}
          userID={this.state.userID}
          changeUser={this.changeUser.bind(this)}
        />
        <UploadModal
          show={this.state.showUploadModal}
          onHide={this.hideUploadModal.bind(this)}
          currentUser={this.state.currentUser}
          userID={this.state.userID}
          toggleFetch={this.toggleFetch.bind(this)}
          loadFiles={this.loadFiles.bind(this)}
        />
        <MyNavbar
          showLoginModal={this.showLoginModal.bind(this)}
          hideLoginModal={this.hideLoginModal.bind(this)}
          showRegisterModal={this.showRegisterModal.bind(this)}
          hideRegisterModal={this.hideRegisterModal.bind(this)}
          showUploadModal={this.showUploadModal.bind(this)}
          hideUploadModal={this.hideUploadModal.bind(this)}
          userID={this.state.userID}
          logOut={this.logOut.bind(this)}
        />
        <FileList
          currentUsersFiles={this.state.currentUsersFiles}
          loadFiles={this.loadFiles.bind(this)}
        />
      </div>
    )
  }
}