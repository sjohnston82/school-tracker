import React from "react";
import { useSchoolStore } from "@/stores/schoolStore";
import { Class } from "@prisma/client";
import { useClickOutside } from "@/lib/hooks/useClickOutside";

interface IConfirmDeleteModal {
  setClassModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setConfirmDelete: React.Dispatch<React.SetStateAction<boolean>>;
  classInfo: Class;
}

const ConfirmDeleteModal = ({
  setClassModalOpen,
  classInfo,
  setConfirmDelete
}: IConfirmDeleteModal) => {
  const { deleteClass } = useSchoolStore();

  const handleDelete = async (classId: string) => {
    console.log("✅ Delete button clicked for class:", classId); // Check if this logs

    try {
      await deleteClass(classId);
      console.log("✅ Class deleted successfully");
      setClassModalOpen(false);
    } catch (error) {
      console.error("❌ Error deleting class:", error);
    }
  };

  const ref = useClickOutside(() => {
    setClassModalOpen(false);
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-20">
      <div
        ref={ref}
        className="bg-white p-6 rounded-lg shadow-lg w-[15vw] space-y-4 flex flex-col items-center"
      >
        <p className="text-center">
          Are you sure you want to delete this class?
        </p>
        <p className="">
          All assignments associated with this class will also be deleted.
        </p>
        <div className="flex justify-around">
          <button
            className="bg-red-500 text-white px-4 py-2 rounded-lg z-50"
            onClick={(e) => {
              e.stopPropagation(); // Prevent click from propagating outside
              console.log("✅ Button clicked for class:", classInfo.id);
              handleDelete(classInfo.id);
            }}
          >
            Yes, Delete
          </button>

          <button className="" onClick={() => setConfirmDelete(false)}>No</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeleteModal;
