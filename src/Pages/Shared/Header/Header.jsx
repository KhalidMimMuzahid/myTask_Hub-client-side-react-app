import { useState, useEffect, useContext } from "react";
import {
  Navbar,
  MobileNav,
  Typography,
  Button,
  IconButton,
} from "@material-tailwind/react";
import { Link } from "react-router-dom";
import { MyContext } from "../../../MyProvider/MyProvider";
import { toast } from "react-toastify";

function Header() {
  const [openNav, setOpenNav] = useState(false);
  const { currentUser, handleSignOutUser } = useContext(MyContext);
  console.log(currentUser);

  useEffect(() => {
    window.addEventListener(
      "resize",
      () => window.innerWidth >= 960 && setOpenNav(false)
    );
  }, []);

  const navListx = (
    <ul className="mb-4 mt-2 flex flex-col gap-2 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center lg:gap-6">
      <Typography
        as="li"
        variant="small"
        color="blue-gray"
        className="p-1 font-normal"
      >
        <Link to="/" className="flex items-center">
          Pages
        </Link>
      </Typography>
      <Typography
        as="li"
        variant="small"
        color="blue-gray"
        className="p-1 font-normal"
      >
        <a href="#" className="flex items-center">
          Account
        </a>
      </Typography>
      <Typography
        as="li"
        variant="small"
        color="blue-gray"
        className="p-1 font-normal"
      >
        <a href="#" className="flex items-center">
          Blocks
        </a>
      </Typography>
      <Typography
        as="li"
        variant="small"
        color="blue-gray"
        className="p-1 font-normal"
      >
        <a href="#" className="flex items-center">
          Docs
        </a>
      </Typography>
    </ul>
  );
  const navList = [
    {
      name: "Add Task",
      navLink: "/addtask",
      id: "01",
    },
    {
      name: "My Task",
      navLink: "/mytask",
      id: "02",
    },
    {
      name: "Completed Task",
      navLink: "/completedtask",
      id: "03",
    },
  ];
  const handleSignOut = () => {
    handleSignOutUser()
      .then(() => {
        // Sign-out successful.
      })
      .catch((error) => {
        // An error happened.
        toast.error("something went wrong, please try again later");
      });
  };
  return (
    <Navbar className="w-full py-2 px-4 lg:px-8 lg:py-4">
      <div className="container mx-auto flex items-center justify-between text-blue-gray-900">
        <Typography
          as="a"
          href="#"
          variant="small"
          className="mr-4 cursor-pointer py-1.5 font-normal"
        >
          <span>myTask_Hub</span>
        </Typography>
        <div className="hidden lg:block">
          <ul className="mb-4 mt-2 flex flex-col gap-2 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center lg:gap-6">
            {navList?.map((eachNav) => (
              <Typography
                key={eachNav.id}
                as="li"
                variant="small"
                color="blue-gray"
                className="p-1 font-normal"
              >
                <Link to={eachNav?.navLink} className="flex items-center">
                  {eachNav?.name}
                </Link>
              </Typography>
            ))}
          </ul>
        </div>

        <div>
          <>
            {currentUser && currentUser?.uid ? (
              <>
                <Button
                  onClick={handleSignOut}
                  variant="gradient"
                  size="sm"
                  className="lg:inline-block hidden"
                >
                  <span>Sign Out</span>
                </Button>
                <Link to="/profile" className="mx-1 ">
                  <img
                    className="w-12 h-12 rounded-full inline-block"
                    src={currentUser?.photoURL}
                    alt=""
                  />
                </Link>
              </>
            ) : (
              <>
                <Link>
                  <Button variant="gradient" size="sm" className="inline-block">
                    <span>Sign In</span>
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button variant="gradient" size="sm" className="inline-block">
                    <span>Sign Up</span>
                  </Button>
                </Link>
              </>
            )}
          </>
          <IconButton
            variant="text"
            className="ml-auto h-6 w-6 text-inherit hover:bg-transparent focus:bg-transparent active:bg-transparent lg:hidden"
            ripple={false}
            onClick={() => setOpenNav(!openNav)}
          >
            {openNav ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                className="h-6 w-6"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </IconButton>
        </div>
      </div>
      <MobileNav open={openNav}>
        <ul className="mb-4 mt-2 flex flex-col gap-2 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center lg:gap-6">
          {navList?.map((eachNav) => (
            <Typography
              key={eachNav.id}
              as="li"
              variant="small"
              color="blue-gray"
              className="p-1 font-normal"
            >
              <Link to={eachNav?.navLink} className="flex items-center">
                {eachNav?.name}
              </Link>
            </Typography>
          ))}
        </ul>
        <Button
          onClick={handleSignOut}
          variant="gradient"
          size="sm"
          className="inline-block"
        >
          <span>Sign Out</span>
        </Button>
      </MobileNav>
    </Navbar>
  );
}

export default Header;
