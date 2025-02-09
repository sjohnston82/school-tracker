import React, { useState } from "react";
import { useSchoolStore } from "@/stores/schoolStore";
import { Button } from "../ui/Button";

const ClassInput = () => {
  const [selectedColor, setSelectedColor] = useState<string>("#000000");
  const [newClass, setNewClass] = useState<string>("");
  const [addingClass, setAddingClass] = useState(false);

  const { addClass } = useSchoolStore();

  const handleAddClass = () => {
    if (newClass.trim() !== "") {
      addClass(newClass, selectedColor);
      setNewClass("");
      setSelectedColor("#000000");
      setAddingClass(false);
    }
  };

  return (
    <div className="flex items-center space-x-2 flex-col ">
      {!addingClass ? (
        <Button onClick={() => setAddingClass(true)}>Add New Class</Button>
      ) : (
        <div className="flex flex-col space-y-4">
          <div className="flex justify-center">
            <input
              type="text"
              value={newClass}
              onChange={(e) => setNewClass(e.target.value)}
              placeholder="Class Name"
              className="border p-2 rounded-lg px-6"
            />

            <input
              type="color"
              value={selectedColor}
              onChange={(e) => setSelectedColor(e.target.value)}
              className="w-12 h-12 p-1 border "
              id="color"
            />
          </div>
          <div className="flex justify-center gap-3">
            <Button onClick={handleAddClass}>Add Class</Button>
            <Button onClick={() => setAddingClass(false)}>Cancel</Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClassInput;
