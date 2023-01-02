import React, { useContext } from "react";

const checkAlreadyUser = (uid) => {
  return fetch(
    `https://my-task-hub.vercel.app/checkuseralreadyindatabase?uid=${uid}`
  );
};

export default checkAlreadyUser;
