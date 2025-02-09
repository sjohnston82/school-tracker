"use client";

import { format, isSameDay } from "date-fns";
import { useState } from "react";
import { useSchoolStore } from "../stores/schoolStore";
import { useClickOutside } from "@/lib/hooks/useClickOutside";
import { BsTrash3Fill } from "react-icons/bs";
import { Button } from "./ui/Button";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: Date | number | string;
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const SelectedDayModal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  selectedDate,
  setModalOpen,
}) => {
  const [addingAssignment, setAddingAssignment] = useState<boolean>(false);
  const { classes, addAssignment, assignments, deleteAssignment } =
    useSchoolStore();

  const ref = useClickOutside(() => {
    setModalOpen(false);
  });

  if (!isOpen) return null;

  const filteredAssignments = assignments.filter(
    (assignment) =>
      selectedDate && isSameDay(new Date(assignment.dueDate), selectedDate)
  );

  const handleDelete = async (assignmentId: string) => {
    await deleteAssignment(assignmentId);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div
        ref={ref}
        className="bg-white p-6 rounded-lg shadow-lg w-[25vw] flex flex-col justify-center items-center "
      >
        <button
          className="absolute top-2 right-2 text-gray-600 hover:text-black"
          onClick={onClose}
        >
          &times;
        </button>
        <div className="flex flex-col items-center gap-8">
          <h2 className="text-lg font-bold text-center">
            Assignments for {format(selectedDate, "MMMM d, yyyy")}
          </h2>
          {/* Assignments List */}
          <div className="flex w-full">
            {filteredAssignments.length > 0 ? (
              <ul className="w-full">
                {filteredAssignments.map((assignment) => {
                  const assignmentClass = classes.find(
                    (cls) => cls.id === assignment.classId
                  );
                  return (
                    <li key={assignment.id} className="p-2 border rounded mt-2 ">
                      <div className="flex justify-between">
                        <div className="">
                          <strong>{assignment.title}</strong>
                          <p>{assignment.description || "No description"}</p>
                          {assignmentClass && (
                            <p className="text-sm text-gray-600">
                              Class: {assignmentClass.name}
                            </p>
                          )}
                        </div>
                        <div
                          className="flex justify-center items-center pr-4 cursor-pointer"
                          onClick={() => handleDelete(assignment.id)}
                        >
                          <BsTrash3Fill size={25} />
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p>No assignments added yet.</p>
            )}
            {/* Add Assignment Form */}
          </div>

          {addingAssignment && (
            <form
              className=""
              onSubmit={(event) => {
                event.preventDefault(); // Prevent form refresh
                const formData = new FormData(event.currentTarget);
                const title = formData.get("title") as string;
                const description = formData.get("description") as string; // Optional
                const dueDate = selectedDate;
                const classId = formData.get("class") as string;

                if (!title || !classId) {
                  alert("Please fill in all required fields.");
                  return;
                }

                addAssignment(
                  title,
                  dueDate as Date,
                  classId,
                  description || ""
                );
                setAddingAssignment(false); // Close form after submission
              }}
            >
              <p className="">Which class is this assignment for?</p>
              <select name="class">
                {classes.map((cls) => (
                  <option value={cls.id} key={cls.id}>
                    {cls.name}
                  </option>
                ))}
              </select>

              <input
                type="text"
                name="title"
                id="title"
                placeholder="Assignment Title"
                required
              />

              <textarea
                name="description"
                placeholder="Assignment Description (optional)"
                id="description"
              />

              <button type="submit">Save Assignment</button>
            </form>
          )}
          <div className="flex gap-4">
            {!addingAssignment && (
              <Button onClick={() => setAddingAssignment(true)}>
                Add New Assignment
              </Button>
            )}

            <Button onClick={() => setModalOpen(false)}>Close</Button>
          </div>
        </div>
      </div>
    </div>
  );
};
