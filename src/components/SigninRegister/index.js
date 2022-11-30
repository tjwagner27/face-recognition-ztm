import React, { Component } from 'react';
const initialState = {
  email: '',
  password: '',
  name: '',
  errorMessage: '',
}

class SigninRegister extends Component {
  constructor(props) {
    super(props);
    this.state = initialState;
  }

  onNameChange = (event) => {
    this.setState({name: event.target.value})
  }
  
  onEmailChange = (event) => {
    this.setState({email: event.target.value})
  }
  
  onPasswordChange = (event) => {
    this.setState({password: event.target.value})
  }

  onSubmit= () => {
    const route = this.props.route;
    const body = {
      password: this.state.password,
      email: this.state.email,
    }
    if (route === 'register') body.name = this.state.name;
    
    //deployed
    fetch(`https://pacific-brook-10585.herokuapp.com/${route}`, {
    // testing
    // fetch(`http://127.0.0.1:3000/${route}`, {
      method: 'post',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(body)
    })
      .then(response => response.json())
      .then(res => {
        if (!res.id) this.setState({errorMessage: res});
        else {
          this.props.loadUser(res);
          this.props.onRouteChange('home');
        }
      })
  }

  render () {
    const { route, onRouteChange } = this.props;
    const page = route === 'register' ? 'Register' : 'Sign In'
    return (
      <article className="br3 ba b--black-10 mv4 w-100 w-50-m w-25-l mw6 shadow-5 center">
        <main className="pa4 black-80">
          <div className="measure">
            <fieldset id="sign_up" className="ba b--transparent ph0 mh0">
              <legend className="f1 fw6 ph0 mh0">{`${page}`}</legend>
              
              {route === 'register' &&
                <div className="mt3">
                  <label className="db fw6 lh-copy f6" htmlFor="name">Name</label>
                  <input 
                    className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100" 
                    type="text" 
                    name="name"  
                    id="name" 
                    onChange={this.onNameChange}
                  />
                </div>
              }
              
              <div className="mt3">
                <label className="db fw6 lh-copy f6" htmlFor="email-address">Email</label>
                <input 
                  className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100" 
                  type="email" 
                  name="email-address"  
                  id="email-address" 
                  onChange={this.onEmailChange}
                />
              </div>
              <div className="mv3">
                <label className="db fw6 lh-copy f6" htmlFor="password">Password</label>
                <input 
                  className="b pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100" 
                  type="password" 
                  name="password"  
                  id="password"
                  onChange={this.onPasswordChange}
                />
              </div>
            </fieldset>
            {this.state.errorMessage.length > 0 &&
              <div className='ba b--red red bg-white-50 pa2 ma2'>
                {this.state.errorMessage}
              </div>
            }
            <div className="">
              <input 
                className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib"
                type="submit" 
                value={`${page}`}
                onClick={this.onSubmit}
              />
            </div>
            {route === 'signin' &&
              <div className="lh-copy mt3">
                <p onClick={() => onRouteChange('register')} className="f6 link dim black db pointer">Register</p>
              </div>
            }
            <div className="lh-copy">
              <p onClick={() => onRouteChange('guest')} className="f6 link dim black db pointer underline">Guest User</p>
            </div>
          </div>
        </main>
      </article>
    )}
  }
  
  export default SigninRegister;