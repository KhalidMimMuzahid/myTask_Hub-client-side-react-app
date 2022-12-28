import React, { useContext } from "react";

const checkAlreadyUser = (uid) => {
  return fetch(`http://localhost:5001/checkuseralreadyindatabase?uid=${uid}`);
};

export default checkAlreadyUser;
