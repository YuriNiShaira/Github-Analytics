import React from 'react';
import { Oval } from 'react-loader-spinner';

const LoadingSpinner = ({ message = 'Loading...' }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <Oval
        height={40}
        width={40}
        color="#58a6ff"
        wrapperStyle={{}}
        wrapperClass=""
        visible={true}
        ariaLabel='oval-loading'
        secondaryColor="#30363d"
        strokeWidth={4}
        strokeWidthSecondary={4}
      />
      <p className="mt-4 text-github-muted text-sm">{message}</p>
    </div>
  );
};

export default LoadingSpinner;