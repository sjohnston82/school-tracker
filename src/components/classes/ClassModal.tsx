"use client";

import { useClickOutside } from "@/lib/hooks/useClickOutside";
import { Class } from "@prisma/client";
import { useSchoolStore } from "@/stores/schoolStore";
import { useState } from "react";
import ConfirmDeleteModal from "./ConfirmDeleteModal";

interface IClassModal {
  setClassModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  classModalOpen: boolean;
  classInfo: Class;
}

export const ClassModal: React.FC<IClassModal> = ({
  setClassModalOpen,
  classModalOpen,
  classInfo,
}: IClassModal) => {
  const { assignments } = useSchoolStore();
  const [confirmDelete, setConfirmDelete] = useState(false);

  const ref = useClickOutside(() => {
    if (!confirmDelete) {
      setClassModalOpen(false);
    }
  });

  if (!classModalOpen) return null;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Filter assignments that belong to the current class and are today or in the future
  const futureAssignments = assignments
    .filter((assignment) => {
      const dueDate = new Date(assignment.dueDate);
      return assignment.classId === classInfo.id && dueDate >= today;
    })
    .sort(
      (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
    );

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-20">
      <div
        ref={ref}
        className="bg-white p-6 rounded-lg shadow-lg w-[15vw] space-y-4 flex flex-col items-center "
      >
        <h1 className="text-center text-3xl text-black">{classInfo.name}</h1>
        <div className="w-full flex flex-col items-center">
          {futureAssignments.length > 0 ? (
            <h2 className="text-center font-semibold text-xl">
              Upcoming Assignments
            </h2>
          ) : (<p className="">No upcoming assignments in this class.</p>)}
          <ul className="text-center">
            {futureAssignments.map((assignment) => (
              <li key={assignment.id}>
                <strong>{assignment.title}</strong> - Due:{" "}
                {new Date(assignment.dueDate).toLocaleDateString()}
              </li>
            ))}
          </ul>
          <button
            onClick={() => setConfirmDelete(true)}
            className="bg-red-500 text-white p-3 rounded-lg w-1/2 font-semibold mt-6"
          >
            Delete Class
          </button>
        </div>
      </div>
      {confirmDelete && (
        <ConfirmDeleteModal
          setClassModalOpen={setClassModalOpen}
          classInfo={classInfo}
          setConfirmDelete={setConfirmDelete}
        />
      )}
    </div>
  );
};
