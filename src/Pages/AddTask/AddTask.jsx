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
import React from "react";
import { useForm } from "react-hook-form";

const AddTask = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const handleFormSubmit = (data) => {
    const { taskName, taskDescription } = data;
    console.log("taskName: ", taskName, "\ntaskDescription:", taskDescription);
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
