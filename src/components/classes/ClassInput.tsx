import React, { useState } from "react";
import { useSchoolStore } from "@/stores/schoolStore";
import { Button } from "../ui/Button";

const ClassInput = () => {
  const [selectedColor, setSelectedColor] = useState<string>("#000000");
  const [newClass, setNewClass] = useState<string>("");

  const { addClass } = useSchoolStore();

  const handleAddClass = () => {
    if (newClass.trim() !== "") {
      addClass(newClass, selectedColor);
      setNewClass("");
      setSelectedColor("#000000");
    }
  };

  return (
    <div className="flex items-center space-x-2 mt-2">
      <input
        type="text"
        value={newClass}
        onChange={(e) => setNewClass(e.target.value)}
        placeholder="Class Name"
        className="border p-2 rounded"
      />
      <input
        type="color"
        value={selectedColor}
        onChange={(e) => setSelectedColor(e.target.value)}
        className="w-10 h-10 p-1 border rounded"
      />
      <Button onClick={handleAddClass}>Add Class</Button>
    </div>
  );
};

export default ClassInput;
