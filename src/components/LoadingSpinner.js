/** @format */

import React from 'react';
import FadeLoader from 'react-spinners/FadeLoader';
// import RiseLoader from "react-spinners/RiseLoader";

const LoadingSpinner = () => {
  return (
    <div>
      <div
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }}
      >
        <FadeLoader
          color="#36d7b7"
          height={15}
          width={5}
          radius={2}
          margin={2}
        />
      </div>
    </div>
  );
};

export default LoadingSpinner;
