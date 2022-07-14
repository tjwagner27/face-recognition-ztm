//*************RANK******************************//
import React from 'react';

const Rank = ({ name, entries }) => {
    return (
      <div>
        <div className='white f3'>
          {`${name}, your current rank is...`}
        </div>
        <div>
          {entries}
        </div>
      </div>
    )
  }
  
  export default Rank;
  //*************RANK******************************//