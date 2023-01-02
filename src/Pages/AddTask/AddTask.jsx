import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Checkbox,
  Input,
  Textarea,
  Typography,
} from "@material-tailwind/react";
import React, { useContext } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { MyContext } from "../../MyProvider/MyProvider";

const AddTask = () => {
  const { currentUser } = useContext(MyContext);
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm();
  const handleFormSubmit = (data) => {
    console.log("xxx", currentUser);
    const { email: taskProviderEmail } = currentUser;
    const { taskName, taskDescription } = data;
    console.log("taskName: ", taskName, "\ntaskDescription:", taskDescription);
    fetch("https://my-task-hub.vercel.app/addtask", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ taskProviderEmail, taskName, taskDescription }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data?.acknowledged) {
          toast.success("task inserted successfully");
          reset();
        }
      });
  };
  return (
    <div className="mx-auto">
      <Card className="w-96 mx-auto mt-16">
        <CardHeader
          variant="gradient"
          color="blue"
          className="mb-4 grid h-28 place-items-center"
        >
          <Typography variant="h3" color="white">
            Add your task
          </Typography>
        </CardHeader>
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <CardBody className="flex flex-col gap-4">
            <Input
              {...register("taskName", {
                required: { value: true, message: "Task Name is required" },
              })}
              label="Task Name"
              size="lg"
            />
            {errors?.taskName && (
              <p className="font-bold text-red-700" role="alert">
                {errors?.taskName?.message}
              </p>
            )}
            <Textarea
              {...register("taskDescription", {
                required: {
                  value: true,
                  message: "Task Description is required",
                },
              })}
              label="Task Description"
            />
            {errors?.taskDescription && (
              <p className="font-bold text-red-700" role="alert">
                {errors?.taskDescription?.message}
              </p>
            )}
          </CardBody>
          <CardFooter className="pt-0">
            <Button type="submit" variant="gradient" fullWidth>
              Add Task
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default AddTask;
