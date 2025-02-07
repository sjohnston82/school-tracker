import { useEffect, useState } from "react";
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

const classColors = [
  "bg-red-400",
  "bg-blue-400",
  "bg-green-400",
  "bg-yellow-400",
];

const Calendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [classes, setClasses] = useState<{ name: string; color: string }[]>([]);
  const [newClass, setNewClass] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>(classColors[0]);

  const start = startOfWeek(startOfMonth(currentDate));
  const end = endOfWeek(endOfMonth(currentDate));
  const days = eachDayOfInterval({ start, end });

  const handlePrev = () => setCurrentDate(subMonths(currentDate, 1));
  const handleNext = () => setCurrentDate(addMonths(currentDate, 1));
  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    setModalOpen(true);
  };

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await fetch("/api/classes");
        if (!response.ok) {
          throw new Error("Failed to fetch classes");
        }
        const data = await response.json();
        setClasses(data);
      } catch (error) {
        console.error("Error fetching classes:", error);
      }
    };

    fetchClasses();
  }, []);

  const addClass = async () => {
    if (newClass.trim() !== "") {
      try {
        const response = await fetch("/api/classes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: newClass, color: selectedColor }),
        });

        if (!response.ok) {
          throw new Error("Failed to add class");
        }

        const savedClass = await response.json();
        setClasses([...classes, savedClass]);

        // Reset input fields
        setNewClass("");
        setSelectedColor(classColors[0]);
      } catch (error) {
        console.error("Error adding class:", error);
      }
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
        {days.map((day) => (
          <div
            key={day.toString()}
            className={`p-4 border rounded cursor-pointer ${
              isSameMonth(day, currentDate) ? "bg-white" : "bg-gray-200"
            } ${
              isSameDay(day, selectedDate ?? new Date())
                ? "border-blue-500"
                : ""
            }`}
            onClick={() => handleDateClick(day)}
          >
            {format(day, "d")}
          </div>
        ))}
      </div>

      {modalOpen && selectedDate && (
        <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
          <div>
            <h2 className="text-lg font-bold">
              Assignments for {format(selectedDate, "MMMM d, yyyy")}
            </h2>
            <p>Add or view assignment details here.</p>
            <Button onClick={() => setModalOpen(false)}>Close</Button>
          </div>
        </Modal>
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
          <Button onClick={addClass}>Add Class</Button>
        </div>
        <div className="mt-2">
          {classes.map((cls) => (
            <div
              key={cls.name}
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
