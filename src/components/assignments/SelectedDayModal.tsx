"use client";

import { format } from "date-fns";
import { useState } from "react";
import { useClickOutside } from "@/lib/hooks/useClickOutside";
import { Button } from "../ui/Button";
import AddAssignment from "./AddAssignment";
import AssignmentList from "./AssignmentList";

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

  const ref = useClickOutside(() => {
    setModalOpen(false);
  });

  if (!isOpen) return null;

  // const filteredAssignments = assignments.filter(
  //   (assignment) =>
  //     selectedDate && isSameDay(new Date(assignment.dueDate), selectedDate)
  // );

  // const handleDelete = async (assignmentId: string) => {
  //   await deleteAssignment(assignmentId);
  // };

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
          <AssignmentList selectedDate={selectedDate} />

          {addingAssignment && (
            <AddAssignment
              selectedDate={selectedDate}
              setAddingAssignment={setAddingAssignment}
            />
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
