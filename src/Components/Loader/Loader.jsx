import React from "react";
import { MagnifyingGlass, RotatingLines } from "react-loader-spinner";

const Loader = ({ type }) => {
  if (type === "radial") {
    return (
      <div className="flex justify-center items-center">
        <RotatingLines
          strokeColor="grey"
          strokeWidth="5"
          animationDuration="0.75"
          width="96"
          visible={true}
        />
      </div>
    );
  } else if (type === "search") {
    return (
      <div className="flex justify-center items-center">
        <MagnifyingGlass
          visible={true}
          height="80"
          width="80"
          ariaLabel="MagnifyingGlass-loading"
          wrapperStyle={{}}
          wrapperClass="MagnifyingGlass-wrapper"
          glassColor="#c0efff"
          color="#e15b64"
        />
      </div>
    );
  } else if (type === "progressor") {
    return (
      <div className="flex justify-center items-center">
        <div className=" w-3/4 mx-auto">
          <progress className="progress w-full"></progress>
        </div>
      </div>
    );
  } else {
    return (
      <div className="flex justify-center items-center">
        <RotatingLines
          strokeColor="grey"
          strokeWidth="5"
          animationDuration="0.75"
          width="96"
          visible={true}
        />
      </div>
    );
  }
};

export default Loader;
