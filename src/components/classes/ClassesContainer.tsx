"use client";

import React, { useState } from "react";
import { useSchoolStore } from "../../stores/schoolStore";
import { ClassModal } from "./ClassModal";
import ClassInput from "./ClassInput";
import { Class } from "@prisma/client";

const ClassesContainer = ({}) => {
  const { classes } = useSchoolStore();

  const [classModalOpen, setClassModalOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState<Class | null>(null);

  const handleClassClick = (cls: Class) => {
    setSelectedClass(cls);
    setClassModalOpen(true);
  };

  return (
    <div className="flex flex-col items-center">
      <ClassInput />
      <div className=" border rounded">
        <h2 className="text-lg font-bold">Manage Classes</h2>

        <div className=" flex flex-col  gap-4">
          {classes.map((cls) => {
            // Function to determine text color based on background
            const getTextColor = (bgColor: string) => {
              const r = parseInt(bgColor.substring(1, 3), 16);
              const g = parseInt(bgColor.substring(3, 5), 16);
              const b = parseInt(bgColor.substring(5, 7), 16);
              const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
              return luminance > 0.5 ? "#000000" : "#FFFFFF"; // Use black for light backgrounds, white for dark
            };

            return (
              <div
                key={cls.id}
                className="p-2  w-full text-2xl rounded font-bold text-center cursor-pointer"
                onClick={() => handleClassClick(cls as Class)}
                style={{
                  backgroundColor: cls.color,
                  color: getTextColor(cls.color),
                }}
              >
                {cls.name}
              </div>
            );
          })}
        </div>
          {classModalOpen && selectedClass && (
            <ClassModal
              setClassModalOpen={setClassModalOpen}
              classModalOpen={classModalOpen}
              classInfo={selectedClass}
            />
          )}
      </div>
    </div>
  );
};

export default ClassesContainer;
