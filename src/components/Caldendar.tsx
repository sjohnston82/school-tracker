"use client";

import { useState, useEffect } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  addMonths,
  subMonths,
  isSameMonth,
  isSameDay,
} from "date-fns";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { useSchoolStore } from "../stores/schoolStore";

const Calendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [newClass, setNewClass] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("#000000");
  const { classes, addClass, fetchClasses, fetchAssignments, assignments } =
    useSchoolStore();

  useEffect(() => {
    fetchClasses();
    fetchAssignments();
  }, [fetchClasses, fetchAssignments]);

  const start = startOfWeek(startOfMonth(currentDate));
  const end = endOfWeek(endOfMonth(currentDate));
  const days = eachDayOfInterval({ start, end });

  const handlePrev = () => setCurrentDate(subMonths(currentDate, 1));
  const handleNext = () => setCurrentDate(addMonths(currentDate, 1));
  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    setModalOpen(true);
  };

  const handleAddClass = () => {
    if (newClass.trim() !== "") {
      addClass(newClass, selectedColor);
      setNewClass("");
      setSelectedColor("#000000");
    }
  };

  return (
    <div className="w-[75vw] mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <Button onClick={handlePrev}>Previous</Button>
        <h2 className="text-xl font-bold">
          {format(currentDate, "MMMM yyyy")}
        </h2>
        <Button onClick={handleNext}>Next</Button>
      </div>

      <div className="grid grid-cols-7 gap-2 text-center">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className="font-semibold">
            {day}
          </div>
        ))}
        {days.map((day) => {
          const assignmentsForDay = assignments.filter((assignment) =>
            isSameDay(new Date(assignment.dueDate), day)
          );
          return (
            <div
              key={day.toString()}
              className={`relative p-4 border rounded cursor-pointer ${
                isSameMonth(day, currentDate) ? "bg-white" : "bg-gray-200"
              } ${
                isSameDay(day, selectedDate ?? new Date())
                  ? "border-blue-500"
                  : ""
              }`}
              onClick={() => handleDateClick(day)}
            >
              {format(day, "d")}
              {assignmentsForDay.length > 0 && (
                <div className="absolute bottom-1 right-1 flex space-x-1">
                  {assignmentsForDay.map((assignment) => {
                    const assignmentClass = classes.find(
                      (cls) => cls.id === assignment.classId
                    );
                    return assignmentClass ? (
                      <span
                        key={assignment.id}
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: assignmentClass.color }}
                      ></span>
                    ) : null;
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {modalOpen && selectedDate && (
        <Modal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          selectedDate={selectedDate}
          setModalOpen={setModalOpen}
        />
      )}

      <div className="mt-4 p-4 border rounded">
        <h2 className="text-lg font-bold">Manage Classes</h2>
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
        <div className="mt-2">
          {classes.map((cls) => (
            <div
              key={cls.id}
              className="p-2 rounded mt-1"
              style={{ backgroundColor: cls.color }}
            >
              {cls.name}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Calendar;
