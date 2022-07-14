//potential improvements to work on...
//1) shared component form for sign in and register that accepts props to create form
//2) delete user request
import React, { Component } from 'react';
import Navigation from './components/Navigation';
import Logo from './components/Logo';
import ImageLinkForm from './components/ImageLinkForm';
import Rank from './components/Rank';
import FaceRecognition from './components/FaceRecognition';
import Signin from './components/Signin';
import Register from './components/Register';
import './App.css';

const initialState = {
  input: '',
  imageUrl: '',
  box: {},
  route: 'signin',
  isSignedIn: false,
  user: {
    id: '',
    email: '',
    name: '',
    entries: 0,
    joined: ''
  }
}
class App extends Component {
  constructor() {
    super();
    this.state = initialState;
  }

  loadUser = (data) => {
    this.setState({user: {
      id: data.id,
      name: data.name,
      email: data.email,
      entries: data.entries,
      joined: data.joined
    }})
  }

  calculateFaceLocation = (data) => {
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputImage');
    const width = Number(image.width);
    const height = Number(image.height);
    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height)
    }
  }
  
  displayFaceBox = (box) => {
    this.setState({box: box})
    console.log(box, 'displayFaceBox')
  }
  
  onInputChange = (event) => {
     this.setState({input: event.target.value})
  }
  
  onPhotoSubmit = () => {
    this.setState({imageUrl: this.state.input})
      fetch('https://pacific-brook-10585.herokuapp.com/imageurl', {
          method: 'post',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            input: this.state.input
        })
      })
      .then(response => response.json())
      .then(response => {
        if(response) {
          fetch('https://pacific-brook-10585.herokuapp.com/image', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              id: this.state.user.id
          })
        })
            .then(response => response.json())
            .then(count => {
              this.setState(Object.assign(this.state.user, { entries: count }))
      //count can we use ...rest or prev => prev + entries?
              })
              .catch(console.log)
            }
      this.displayFaceBox(this.calculateFaceLocation(response))
    })
    .catch(err => console.log(err));
  }
  
  onRouteChange = (route) => {
    if (route === 'signout') {
      this.setState(initialState)
    } else if (route === 'home') {
      this.setState({isSignedIn: true})
    }
    this.setState({route: route});
  }

  render() {
    const { isSignedIn, route, box, imageUrl } = this.state;
    return (
      <div className='App'>
        <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange}/>
        {this.state.route === 'home' 
        ? <>
            <Logo />
            <Rank name={this.state.user.name} entries={this.state.user.entries}/>
            <ImageLinkForm onInputChange={this.onInputChange} onPhotoSubmit={this.onPhotoSubmit} />
            <FaceRecognition box={box} imageUrl={imageUrl}/>
          </>
        : ( route === 'signin' || route === 'signout'
            ? <Signin 
                loadUser={this.loadUser} 
                onRouteChange={this.onRouteChange}
              />
            : <Register 
                loadUser={this.loadUser} 
                onRouteChange={this.onRouteChange}
              />
          )
        }
      </div>
    );
  }
}


export default App;