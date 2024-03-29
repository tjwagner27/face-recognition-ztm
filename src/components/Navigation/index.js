//*************NAGIVATION**********************//
import React from 'react';
import profileImg from './img/profile.png';
const Navigation = ({ onRouteChange, isSignedIn }) => {
      if (isSignedIn) {
        return (
          <nav style={{display: 'flex', justifyContent: 'flex-end'}}>
            <p className='f3 link dim black underline pa3 pointer'
              onClick={() => onRouteChange('home')}>Home</p>
            <p className='f3 link dim black underline pa3 pointer'
              onClick={() => onRouteChange('signout')}
            >
              Sign Out
            </p>
              <img 
                className='f3 link dim black pa3 pointer' 
                src={profileImg} 
                alt="Profile Icon Vector Png @clipartmax.com" 
                width="50" height="50" 
                onClick={() => onRouteChange('profile')}
                />
          </nav>   
        )
      } else {
        return (
            <nav style={{display: 'flex', justifyContent: 'flex-end'}}>
              <p className='f3 link dim black underline pa3 pointer'
                onClick={() => onRouteChange('signin')}
              >
                Sign In
              </p>
              <p className='f3 link dim black underline pa3 pointer'
                onClick={() => onRouteChange('register')}
              >
                Register
              </p>
            </nav>
        )
      }
  }
  export default Navigation
  //*************NAGIVATION**********************//