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
import { SelectedDayModal } from "@/components/assignments/SelectedDayModal";
import { Button } from "@/components/ui/Button";
import { useSchoolStore } from "../stores/schoolStore";
import { MdAssignment } from "react-icons/md";

const Calendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  const { classes, fetchClasses, fetchAssignments, assignments } =
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

  return (
    <div className="h-full w-full overflow-hidden flex flex-col flex-grow  pb-[14vh]">
      <div className="flex justify-between items-center mb-4">
        <Button onClick={handlePrev}>Previous</Button>
        <h2 className="text-2xl font-bold">
          {format(currentDate, "MMMM yyyy")}
        </h2>
        <Button onClick={handleNext}>Next</Button>
      </div>

      <div className="grid grid-cols-7 gap-2 text-center ">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className="font-semibold text-xl">
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-2 flex-grow overflow-y-auto ">
        {days.map((day) => {
          const assignmentsForDay = assignments.filter((assignment) =>
            isSameDay(new Date(assignment.dueDate), day)
          );
          return (
            <div
              key={day.toString()}
              className={`relative p-4 border h-[12vh] shadow-md rounded cursor-pointer   ${
                isSameMonth(day, currentDate) ? "bg-white" : "bg-gray-300"
              } ${
                isSameDay(day, selectedDate ?? new Date())
                  ? "border-blue-500"
                  : ""
              }`}
              onClick={() => handleDateClick(day)}
            >
              <div className="flex ">
                <p className="text-3xl">{format(day, "d")}</p>
              </div>
              {assignmentsForDay.length > 0 && (
                <div className="absolute bottom-1 right-1 flex space-x-1">
                  {assignmentsForDay.map((assignment, index) => {
                    const assignmentClass = classes.find(
                      (cls) => cls.id === assignment.classId
                    );
                    return assignmentClass ? (
                      <MdAssignment
                        color={assignmentClass.color}
                        size={40}
                        key={index}
                      />
                    ) : null;
                  })}
                </div>
              )}
            </div>
          );
        })}
        <p className="text-lighterpurp text-center">I love you</p>
      </div>

      {modalOpen && selectedDate && (
        <SelectedDayModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          selectedDate={selectedDate}
          setModalOpen={setModalOpen}
        />
      )}
    </div>
  );
};

export default Calendar;
