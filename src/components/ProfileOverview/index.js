import React, { Component, createRef } from 'react';

const initialState = {
  email: '',
  name: '',
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
}
//factory function for event set state handlers -- does this need to be a reg function or => function

class ProfileOverview extends Component {
  constructor(props) {
    super(props);
    this.state = initialState;
    this.nameRef = createRef(null);
    this.emailRef = createRef(null)
    this.currentPasswordRef = createRef(null);
    this.newPasswordRef = createRef(null);
    this.confirmPasswordRef = createRef(null);
  }
  
  onNameChange = (event) => {
    this.setState({ name: event.target.value})
  }
  
  onEmailChange = (event) => {
    this.setState({ email: event.target.value})
  }
  
  onCurrentPasswordChange = (event) => {
    this.setState({currentPassword: event.target.value})
  }
  
  onNewPasswordChange = (event) => {
    this.setState({newPassword: event.target.value})
  }
  
  onConfirmPasswordChange = (event) => {
    this.setState({confirmPassword: event.target.value})
  }
  
  onSubmitChangeInformation = () => {
    const { name, email } = this.state;
    const body = {};
    if (name.length > 0) body.name = name;
    if (email.length > 0) body.email = email;
    // delopyed db
    fetch(`https://pacific-brook-10585.herokuapp.com/profile/${this.props.user.id}`,
    // fetch(`http://127.0.0.1:3000/profile/${this.props.user.id}`,
      {
        method: 'PATCH',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(body)
      })
      .then(response => response.json())
      .then(user => {
        if (user) {
          this.props.loadUser(user.user[0]);
          this.nameRef.current.value = '';
          this.emailRef.current.value = '';
          this.setState({ name: '', email: ''})
        }
      })
  }
  
  onSubmitChangePassword = () => {
    const { currentPassword, newPassword, confirmPassword } = this.state;

    if (newPassword !== confirmPassword) {
      return alert('New password and confirm password do not match')
    }
    const body = { currentPassword, newPassword, email: this.props.user.email}
    fetch(`https://pacific-brook-10585.herokuapp.com/changePassword`,
    // fetch(`http://127.0.0.1:3000/changePassword`,
      {
        method: 'PATCH',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(body)
      })
      .then(response => {

        if (response.status === 200) {
          this.currentPasswordRef.current.value = '';
          this.newPasswordRef.current.value = '';
          this.confirmPasswordRef.current.value = '';
          this.setState(initialState);
        }
      })
  }
  
  onSubmitDeleteAccount = async () => {
    const { email } = this.props.user;
    fetch(`https://pacific-brook-10585.herokuapp.com/deleteMe`,
    // fetch(`http://127.0.0.1:3000/deleteMe`, 
    {
      method: 'DELETE',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({email})
    })
      .then(response => {
        if (response.status === 204) {
          this.props.onRouteChange('signout');
        }
      })
  }
  
  render() {
    const { name, email, entries, joined } = this.props.user;
    const date = joined.split('-')
    return(
      <div className='w-100-ns overflow-y-scroll'>
        <h1 className="tl fw6 ph0 mv0-l mh6-l">Profile Settings</h1>
        <div className='flex center w-two-thirds-l'>
          
          <div className='flex flex-column flex-auto br3 ba b--black-10 shadow-5 center'>
            <div className='flex flex-column flex-auto center items-center mt4 ph3 w-100'>
              <div className='flex flex-column flex-auto self-start tl'>
                <h1 className="f3 fw6 pb1 ma0">Profile Information</h1>
                <h4 className='ma0 pb1'>{`Joined: ${date[1]}/${date[0]}`}</h4 >
                <h4 className='ma0 pb1'>{`Entries: ${entries}`}</h4 >
              </div>
              <h3 className='ma0 mt4 self-start-ns underline'>Edit Information</h3>
              <fieldset id="change-information" className="ba b--transparent pa0 mh0">
                <div className="mt3 flex-auto">
                  <label className="db fw6 lh-copy f6" htmlFor="name">Name</label>
                  <input
                    ref={this.nameRef}
                    placeholder={name}
                    onChange={this.onNameChange}
                    className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100 border-box" 
                    type="name" 
                    name="name" 
                    id="name" />
                </div>
                <div className="mt3 flex-auto">
                  <label className="db fw6 lh-copy f6" htmlFor="email">Email</label>
                  <input 
                    ref={this.emailRef}
                    placeholder={email}
                    onChange={this.onEmailChange}
                    className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100 border-box" 
                    type="email" 
                    name="email"  
                    id="email" />
                </div>
                
              </fieldset>
              <div className="self-end-ns mv3 mh5">
                <input 
                  className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib"
                  type="submit" 
                  value="Save Changes"
                  onClick={this.onSubmitChangeInformation}
                />
              </div>
            </div>
            <div className='flex flex-column flex-auto center items-center mt4 ph3 w-100'>
            <h3 className='ma0 mt4 self-start-ns underline'>Change Password</h3>
              <fieldset id="change-password" className="ba b--transparent pa0 mh0">
                <div className="mt3 flex-auto">
                  <label className="db fw6 lh-copy f6" htmlFor="current-password">Current Password</label>
                  <input
                    ref={this.currentPasswordRef}
                    onChange={this.onCurrentPasswordChange}
                    className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100 border-box" 
                    type="password" 
                    name="current-password" 
                    id="current-password" />
                </div>
                <div className="mt3 flex-auto">
                  <label className="db fw6 lh-copy f6" htmlFor="new-password">New Password</label>
                  <input 
                    ref={this.newPasswordRef}
                    onChange={this.onNewPasswordChange}
                    className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100 border-box" 
                    type="password" 
                    name="new-password" 
                    id="new-password" />
                </div>
                <div className="mt3 flex-auto">
                  <label className="db fw6 lh-copy f6" htmlFor="Confirm-password">Confirm New Password</label>
                  <input 
                    ref={this.confirmPasswordRef}
                    onChange={this.onConfirmPasswordChange}
                    className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100 border-box" 
                    type="password" 
                    name="confirm-password" 
                    id="confirm-password" />
                </div>
                
              </fieldset>
              <div className="self-end-ns mv3 mh5">
                <input 
                  className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib"
                  type="submit" 
                  value="Change Password"
                  onClick={this.onSubmitChangePassword}
                />
              </div>
            </div>
            <div className="self-end-ns ml3 mt4 pa1">
                <input 
                  className="b ph2 pv1 input-reset ba b--black bg-transparent grow pointer f6 dib"
                  type="submit" 
                  value="Delete Account"
                  onClick={this.onSubmitDeleteAccount}
                />
              </div>
          </div>
        </div>
      </div>
      
    )
  }
};

export default ProfileOverview;