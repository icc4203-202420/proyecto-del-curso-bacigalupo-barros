import React from 'react';

const LogOut = ({ onLogout }) => {
  return (
    <div>
      <button onClick={onLogout}>LogOut</button>
    </div>
  );
};

export default LogOut;
