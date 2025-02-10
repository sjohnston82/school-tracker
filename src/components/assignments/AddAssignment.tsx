"use client";

import React from "react";
import { useSchoolStore } from "@/stores/schoolStore";
import Select, { StylesConfig } from "react-select";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";

interface IAddAssignment {
  selectedDate: Date | number | string;
  setAddingAssignment: React.Dispatch<React.SetStateAction<boolean>>;
}

// Define a type for Select options
interface ClassOption {
  value: string;
  label: string;
  color: string;
}

const AddAssignment: React.FC<IAddAssignment> = ({
  selectedDate,
  setAddingAssignment,
}) => {
  const { addAssignment, classes } = useSchoolStore();

  // Map classes to react-select options
  const options: ClassOption[] = classes.map((cls) => ({
    value: cls.id,
    label: cls.name,
    color: cls.color,
  }));

  // Define custom styles for react-select
  const customStyles: StylesConfig<ClassOption, false> = {
    option: (styles, { data, isFocused, isSelected }) => ({
      ...styles,
      backgroundColor: isSelected
        ? data.color
        : isFocused
        ? `${data.color}80` // Lightened hover effect
        : "white",
      color: isSelected || isFocused ? "white" : "black",
    }),
    control: (styles) => ({
      ...styles,
      borderColor: "#ccc",
      boxShadow: "none",
    }),
    singleValue: (styles, { data }) => ({
      ...styles,
      color: data.color, // Match text color with class color
    }),
  };

  return (
    <form
      className="flex flex-col gap-4"
      onSubmit={(event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const title = formData.get("title") as string;
        const description = (formData.get("description") as string) || "";
        const classId = formData.get("class") as string;

        if (!title || !classId) {
          alert("Please fill in all required fields.");
          return;
        }

        addAssignment(title, selectedDate as Date, classId, description);
        setAddingAssignment(false);
      }}
    >
      <p className="text-center">Which class is this assignment for?</p>

      {/* React-Select for choosing a class */}
      <Select
        name="class"
        options={options}
        styles={customStyles}
        isSearchable={false} // Optional: disable searching
      />

      <Input
        type="text"
        name="title"
        id="title"
        placeholder="Assignment Title"
        required
      />
      <Textarea
        name="description"
        placeholder="Assignment Notes (optional)"
        id="description"
      />
      <button
        type="submit"
        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
      >
        Save Assignment
      </button>
    </form>
  );
};

export default AddAssignment;
