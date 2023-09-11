import React from 'react';
import { EmptyIcon } from '../../icons';
const Empty: React.FC = () => {
  return (
    <>
      <EmptyIcon className="fill-main sm:w-48 sm:h-48 w-32 h-32 m-auto" />
      <p className="text-center">
        Get Started by Adding a <b className="text-main">Note</b>
      </p>
    </>
  );
};

export default Empty;
