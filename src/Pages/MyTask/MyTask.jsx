import React, { useContext, useEffect, useState } from "react";
import { MyContext } from "../../MyProvider/MyProvider";
import Loader from "../../Components/Loader/Loader";
const MyTask = () => {
  const [myTasks, setMyTasks] = useState([]);
  const { currentUser } = useContext(MyContext);
  useEffect(() => {
    fetch(`http://localhost:5001/myalltask?email=${currentUser?.email}`)
      .then((res) => res.json())
      .then((data) => setMyTasks(data));
  }, [currentUser]);
  if (myTasks.length === 0) {
    return (
      <div>
        <Loader />
      </div>
    );
  }
  return (
    <div>
      <h1>my total task: {myTasks.length}</h1>
    </div>
  );
};

export default MyTask;
