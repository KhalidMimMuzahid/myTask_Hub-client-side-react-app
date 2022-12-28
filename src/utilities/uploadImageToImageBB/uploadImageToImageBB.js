const uploadImageToImageBB = (image) => {
  //   console.log("image", image);
  const imageHostKey = process.env.REACT_APP_imagebb_key;
  //   console.log(imageHostKey);
  const url = `https://api.imgbb.com/1/upload?key=${imageHostKey}`;
  //   console.log("url is, ", url);
  const formData = new FormData();
  formData.append("image", image);
  return fetch(url, {
    method: "POST",
    body: formData,
  });
};

export default uploadImageToImageBB;
