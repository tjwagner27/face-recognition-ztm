import React, { Component } from 'react';
import ParticlesBg from 'particles-bg'
import Navigation from './components/Navigation';
import Logo from './components/Logo';
import ImageLinkForm from './components/ImageLinkForm';
import Rank from './components/Rank';
import FaceRecognition from './components/FaceRecognition';
import ProfileOverview from './components/ProfileOverview';
import SigninRegister from './components/SigninRegister';
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
  },
  loading: false
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
    // console.log(box, 'displayFaceBox')
  }
  
  onInputChange = (event) => {
     this.setState({input: event.target.value})
  }
  
  onPhotoSubmit = () => {
    if (!this.state.loading) {
      this.setState({loading: true})
      this.setState({imageUrl: this.state.input})
        //deloyed
        fetch('https://pacific-brook-10585.herokuapp.com/imageurl', {
        // // testing
        // fetch(`http://127.0.0.1:3000/imageurl`, {
            method: 'post',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              input: this.state.input
          })
        })
        .then(response => response.json())
        .then(response => {
          if(response) {
            //deployed
            fetch('https://pacific-brook-10585.herokuapp.com/image', {
            // testing
            // fetch(`http://127.0.0.1:3000/image`, {
              method: 'put',
              headers: {'Content-Type': 'application/json'},
              body: JSON.stringify({
                id: this.state.user.id
            })
          })
              .then(response => response.json())
              .then(count => {
                this.setState(Object.assign(this.state.user, { entries: count }))
                })
              }
        this.displayFaceBox(this.calculateFaceLocation(response))
        setTimeout(() => this.setState({loading: false}), 5000)
      })
      .catch(err => console.log(err));
    }
  }
  
  onRouteChange = (route) => {
    if (route === 'signout') {
      this.setState(initialState)
    } else if (route === 'home') {
      this.setState({isSignedIn: true, route: 'home'})
    } else if (route === 'profile') {
      this.setState({route: route})
    } else {
      this.setState(initialState);
      this.setState({route: route});
    }
  }
  
  render() {
    const { isSignedIn, route, box, imageUrl, user } = this.state;
    let currentView;
    if (route === 'home' || route === 'guest') {
      currentView = 
      <>
        <Logo />
        {route === 'home' &&
          <Rank name={user.name} entries={user.entries}/>
        }
        <ImageLinkForm onInputChange={this.onInputChange} onPhotoSubmit={this.onPhotoSubmit} />
        <FaceRecognition box={box} imageUrl={imageUrl}/>
      </>
    } else if (route === 'profile') {
      currentView = 
      <ProfileOverview 
        user={user} 
        route={route}
        loadUser={this.loadUser} 
        onRouteChange={this.onRouteChange}
      />
    } else {
      currentView = <SigninRegister 
        route={route}
        loadUser={this.loadUser} 
        onRouteChange={this.onRouteChange}
      />
    }
    return (
      <div className='App'>
        <ParticlesBg color="#81B29A" type="cobweb" bg={true} />
        <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange}/>
        {currentView}        
      </div>
    );
  }
}


export default App;