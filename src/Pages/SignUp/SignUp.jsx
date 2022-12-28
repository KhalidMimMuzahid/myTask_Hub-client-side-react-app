import React, { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Loader from "../../Components/Loader/Loader";
import { MyContext } from "../../MyProvider/MyProvider";
import checkAlreadyUser from "../../utilities/checkAlreadyUser/checkAlreadyUser";
import uploadImageToImageBB from "../../utilities/uploadImageToImageBB/uploadImageToImageBB";
import uploadProfileToMongoDB from "../../utilities/uploadProfileToMongoDB/uploadProfileToMongoDB";

const SignUp = () => {
  const { createUserWithEmail, updateUserProfile, currentUser, googleSignIn } =
    useContext(MyContext);
  const navigate = useNavigate();
  const [passwordError, setPasswordError] = useState("");
  const [isSignUpLoading, setIsSignUpLoading] = useState(false);
  const [googleSignInError, setGoogleSignInError] = useState("");
  const [emailPasswordSignUpError, setEmailPasswordSignUpError] = useState("");
  // console.log("initial, ", passwordError);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const signUpFormSubmit = (data) => {
    setEmailPasswordSignUpError("");
    setGoogleSignInError("");
    // console.log(data);
    if (data.password !== data.confirmPassword) {
      setPasswordError("password should be match");
      alert("your provided password are not match");
      return;
    }
    setIsSignUpLoading(true);
    // retrive data from user input form
    const name = data?.name;
    const email = data?.email;
    const password = data?.password;
    const image = data?.image[0];
    // create user to firebase
    createUserWithEmail(email, password)
      .then((userCredential) => {
        // user created succesfully
        const user = userCredential.user;
        console.log("user", user);
        const uid = user?.uid;
        // if user provide an image then ,
        if (image) {
          // image upload to image BB
          uploadImageToImageBB(image)
            .then((res) => res.json())
            .then((imageData) => {
              // console.log("image data", imageData);
              const imageLink = imageData?.data?.display_url;
              // console.log("imageLink", imageLink);
              // if image succesfully uploaded the image link have a link otherwise have a undefined value
              // if image succesfully uploaded , then ,
              if (imageLink) {
                const userInfo = {
                  displayName: name,
                  photoURL: imageLink,
                };
                // update user additional info ((displayName) and photoURL) to firebase
                updateUserProfile(userInfo)
                  .then(() => {
                    // if profile succesfully uploaded
                    // console.log("Profile updated!");
                    // console.log("currentUser", currentUser);
                    const userInfoForDB = {
                      name: name,
                      email: email,
                      profilePhoto: imageLink,
                      uid: uid,
                    };
                    // upload user info to mongodb database
                    uploadProfileToMongoDB(userInfoForDB)
                      .then((res) => res.json())
                      .then((data) => {
                        if (data?.acknowledged) {
                          // if user info succesfully updated to database
                          setIsSignUpLoading(false);
                          toast.success("user created successfully");
                          navigate("/");
                        }
                      });
                  })
                  .catch((error) => {
                    // An error occurred
                    // ...
                  });
              } else {
                // if there have any problem to get image Link from imageBB
                toast.error(
                  "your photo could not be uploaded.\nyou may upload later."
                );
                const userInfo = {
                  displayName: name,
                };
                // update user additional info (displayName) to firebase
                updateUserProfile(userInfo)
                  .then(() => {
                    // if profile succesfully updated
                    console.log("Profile updated!");
                    console.log("currentUser", currentUser);
                    const userInfoForDB = {
                      name: name,
                      email: email,
                      profilePhoto: "",
                      uid: uid,
                    };
                    // upload user info to mongodb database
                    uploadProfileToMongoDB(userInfoForDB)
                      .then((res) => res.json())
                      .then((data) => {
                        if (data?.acknowledged) {
                          setIsSignUpLoading(false);
                          toast.success("user created successfully");

                          navigate("/");
                        }
                      });
                  })
                  .catch((error) => {
                    // An error occurred
                    // ...
                  });
              }
            });
        } else {
          // if the image is not provided by the user
          const userInfo = {
            displayName: name,
          };
          // update user additional info (displayName) to firebase
          updateUserProfile(userInfo)
            .then(() => {
              // if profile succesfully updated
              // console.log("Profile updated!");
              // console.log("currentUser", currentUser);
              const userInfoForDB = {
                name: name,
                email: email,
                profilePhoto: "",
                uid: uid,
              };
              // upload user info to mongodb database
              uploadProfileToMongoDB(userInfoForDB)
                .then((res) => res.json())
                .then((data) => {
                  if (data?.acknowledged) {
                    toast.success("user created successfully");
                    navigate("/");
                    setIsSignUpLoading(false);
                  }
                });
            })
            .catch((error) => {
              // An error occurred
              // ...
            });
        }

        // ...
      })
      .catch((error) => {
        // could not sign up with any issue
        const errorCode = error.code;
        const errorMessage = error.message;
        // console.log("errorMessage", errorMessage);

        setEmailPasswordSignUpError(errorMessage);
        setIsSignUpLoading(false);

        // ..
      });
  };
  useEffect(() => {
    const subscription = watch((value, { name, type }) => {
      // console.log(value, name, type);
      // console.log("value", value);
      // console.log("name", name);
      // console.log("type", type);
      // console.log(
      //   "value?.password: ",
      //   value?.password,
      //   "value?.confirmPassword:",
      //   value?.confirmPassword,
      //   "passwordError:",
      //   passwordError
      // );
      if (value?.password === value?.confirmPassword) {
        setPasswordError("");
      } else {
        setPasswordError("password should be match");
      }
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  // const handlePasswordChange = (e) => {
  //   console.log(e.target.name, "=", e.target.value);
  //   const field = e.target.name;
  //   const value = e.target.value;
  //   const newPasswordError = { ...passwordError };
  //   newPasswordError[field] = value;
  //   setPasswordError(newPasswordError);
  // };
  const logInWithGoogle = () => {
    setEmailPasswordSignUpError("");
    setGoogleSignInError("");
    // console.log("clicked");
    setIsSignUpLoading(true);
    googleSignIn()
      .then((result) => {
        const user = result.user;
        // console.log("user", user);

        const userInfoForDB = {
          name: user.displayName,
          email: user.email,
          profilePhoto: user.photoURL,
          uid: user.uid,
        };
        // check this user is already have in database or not
        checkAlreadyUser(user.uid)
          .then((res) => res.json())
          .then((data) => {
            if (!data.isUserAlreadyExists) {
              // if the user is not already in database
              // console.log("the user is not already in database");
              // upload user info to mongodb database
              uploadProfileToMongoDB(userInfoForDB)
                .then((res) => res.json())
                .then((data) => {
                  if (data?.acknowledged) {
                    setIsSignUpLoading(false);
                    // toast.success("user created successfully");
                    navigate("/");
                  }
                });
            } else {
              // if the user is already in database
              // console.log("the user is already in database");
              setIsSignUpLoading(false);
              // toast.success("user created successfully");
              navigate("/");
            }
          });
      })
      .catch((error) => {
        const errorMessage = error.message;
        // console.log("errorMessage", errorMessage);
        setGoogleSignInError(errorMessage);
        setIsSignUpLoading(false);
        return;
      });
  };
  return (
    <div>
      <div>
        <div className="flex flex-col items-center min-h-screen pt-6 sm:justify-center sm:pt-0 bg-gray-50">
          <div>
            <a href="/">
              <h3 className="text-4xl font-bold text-purple-600">Logo</h3>
            </a>
          </div>
          <div className="w-full px-6 py-4 mt-6 overflow-hidden bg-white shadow-md sm:max-w-lg sm:rounded-lg">
            <form onSubmit={handleSubmit(signUpFormSubmit)}>
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 undefined"
                >
                  Name
                </label>
                <div className="flex flex-col items-start">
                  <input
                    {...register("name", {
                      required: { value: true, message: "Name is required" },
                      maxLength: {
                        value: 20,
                        message: "Max length cann't be more than 20 character",
                      },
                    })}
                    type="text"
                    name="name"
                    className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  />
                </div>
                {errors?.name && (
                  <p role="alert" className="text-red-500 font-bold">
                    {/* Name is required */}
                    {errors?.name?.message}
                  </p>
                )}
              </div>
              <div className="mt-4">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 undefined"
                >
                  Email
                </label>
                <div className="flex flex-col items-start">
                  <input
                    {...register("email", {
                      required: "Email is required",
                    })}
                    type="email"
                    name="email"
                    className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  />
                </div>
                {errors?.email && (
                  <p role="alert" className="text-red-500 font-bold">
                    {errors?.email?.message}
                  </p>
                )}
              </div>

              <div className="form-control w-full flex flex-col">
                <label className="label ">
                  <span className="label-text">Profile Picture (optional)</span>
                </label>
                <input
                  type="file"
                  {...register("image")}
                  className="file-input file-input-bordered file-input-xs w-full "
                />
              </div>
              <div className="mt-4">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 undefined"
                >
                  Password
                </label>
                <div className="flex flex-col items-start">
                  <input
                    {...register("password", {
                      required: {
                        value: true,
                        message: "Please enter your password",
                      },
                    })}
                    type="password"
                    name="password"
                    className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  />
                </div>
                {errors?.password && (
                  <p role="alert" className="text-red-500 font-bold">
                    {/* Name is required */}
                    {errors?.password?.message}
                  </p>
                )}
              </div>
              <div className="mt-4">
                <label
                  htmlFor="password_confirmation"
                  className="block text-sm font-medium text-gray-700 undefined"
                >
                  Confirm Password
                </label>
                <div className="flex flex-col items-start">
                  <input
                    {...register("confirmPassword", {
                      required: {
                        value: true,
                        message: "Please confirm your password",
                      },
                    })}
                    type="password"
                    name="confirmPassword"
                    className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  />
                </div>
                {errors?.confirmPassword && (
                  <p role="alert" className="text-red-500 font-bold">
                    {errors?.confirmPassword?.message}
                  </p>
                )}
                {passwordError && !errors?.confirmPassword && (
                  <p role="alert" className="text-red-500 font-bold">
                    {passwordError}
                  </p>
                )}
              </div>
              <div className="flex items-center mt-4">
                <button className="w-full px-4 py-2 tracking-wide text-white transition-colors duration-200 transform bg-purple-700 rounded-md hover:bg-purple-600 focus:outline-none focus:bg-purple-600">
                  Register
                </button>
              </div>
              {emailPasswordSignUpError && (
                <p role="alert" className="text-red-500 font-bold">
                  {emailPasswordSignUpError}
                </p>
              )}

              {isSignUpLoading && (
                <>
                  <Loader type="" />
                  <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
                    <div className="relative w-auto my-6 mx-auto max-w-3xl">
                      {/*content*/}

                      <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                        {" "}
                      </div>
                    </div>
                  </div>
                  <div className="opacity-25 fixed inset-0 z-40 bg-black">
                    {" "}
                  </div>
                </>
              )}
            </form>

            <div className="mt-4 text-grey-600">
              Already have an account?{" "}
              <span>
                <Link className="text-purple-600 hover:underline" to="/signin">
                  Go to signIn
                </Link>
              </span>
            </div>
            <div className="flex items-center w-full my-4">
              <hr className="w-full" />
              <p className="px-3 ">OR</p>
              <hr className="w-full" />
            </div>
            <div className="my-6 space-y-2">
              <button
                onClick={logInWithGoogle}
                aria-label="Login with Google"
                type="button"
                className="flex items-center justify-center w-full p-2 space-x-4 border rounded-md focus:ring-2 focus:ring-offset-1 dark:border-gray-400 focus:ring-violet-400"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 32 32"
                  className="w-5 h-5 fill-current"
                >
                  <path d="M16.318 13.714v5.484h9.078c-0.37 2.354-2.745 6.901-9.078 6.901-5.458 0-9.917-4.521-9.917-10.099s4.458-10.099 9.917-10.099c3.109 0 5.193 1.318 6.38 2.464l4.339-4.182c-2.786-2.599-6.396-4.182-10.719-4.182-8.844 0-16 7.151-16 16s7.156 16 16 16c9.234 0 15.365-6.49 15.365-15.635 0-1.052-0.115-1.854-0.255-2.651z"></path>
                </svg>
                <p>Login with Google</p>
              </button>
              {googleSignInError && (
                <p role="alert" className="text-red-500 font-bold">
                  {googleSignInError}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
