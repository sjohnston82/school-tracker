"use client";

import { format, isSameDay } from "date-fns";
import { useState } from "react";
import { useSchoolStore } from "../../stores/schoolStore";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: Date | number | string;
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  selectedDate,
  setModalOpen,
}) => {
  const [addingAssignment, setAddingAssignment] = useState<boolean>(false);
  const { classes, addAssignment, assignments } = useSchoolStore();
  if (!isOpen) return null;

  const filteredAssignments = assignments.filter(
    (assignment) =>
      selectedDate && isSameDay(new Date(assignment.dueDate), selectedDate)
  );

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[25vw]">
        <button
          className="absolute top-2 right-2 text-gray-600 hover:text-black"
          onClick={onClose}
        >
          &times;
        </button>
        <div>
          <h2 className="text-lg font-bold">
            Assignments for {format(selectedDate, "MMMM d, yyyy")}
          </h2>
          {/* Assignments List */}
          <div>
            {filteredAssignments.length > 0 ? (
              <ul>
                {filteredAssignments.map((assignment) => {
                  const assignmentClass = classes.find(
                    (cls) => cls.id === assignment.classId
                  );
                  return (
                    <li key={assignment.id} className="p-2 border rounded mt-2">
                      <strong>{assignment.title}</strong>
                      <p>{assignment.description || "No description"}</p>
                      {assignmentClass && (
                        <p className="text-sm text-gray-600">
                          Class: {assignmentClass.name}
                        </p>
                      )}
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p>No assignments added yet.</p>
            )}
            {/* Add Assignment Form */}
          </div>

          {!addingAssignment && (
            <button onClick={() => setAddingAssignment(true)}>
              Add New Assignment
            </button>
          )}

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

          <button onClick={() => setModalOpen(false)} className="mt-4">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
