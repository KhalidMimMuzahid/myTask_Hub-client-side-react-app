import React, { useContext } from "react";

const uploadProfileToMongoDB = (userInfoForDB) => {
  return fetch("http://localhost:5001/insertusertodb", {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(userInfoForDB),
  });
};

export default uploadProfileToMongoDB;
