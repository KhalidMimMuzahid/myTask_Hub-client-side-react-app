import React, { useContext } from "react";

const uploadProfileToMongoDB = (userInfoForDB) => {
  return fetch("https://my-task-hub.vercel.app/insertusertodb", {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(userInfoForDB),
  });
};

export default uploadProfileToMongoDB;
