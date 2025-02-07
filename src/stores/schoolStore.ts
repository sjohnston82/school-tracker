import { create } from "zustand";

interface Class {
  id: string;
  name: string;
  color: string;
}

interface Assignment {
  id: string;
  title: string;
  dueDate: Date;
  classId: string;
  description?: string;
}

interface StoreState {
  classes: Class[];
  assignments: Assignment[];
  fetchClasses: () => Promise<void>;
  fetchAssignments: () => Promise<void>;
  addClass: (name: string, color: string) => Promise<void>;
  addAssignment: (
    title: string,
    dueDate: Date,
    classId: string,
    description?: string
  ) => Promise<void>;
}

export const useSchoolStore = create<StoreState>((set) => ({
  classes: [],
  assignments: [],
  fetchAssignments: async () => {
    try {
      const response = await fetch("/api/assignments");
      if (!response.ok) throw new Error("Failed to fetch assignments");

      const data = await response.json();
      set({ assignments: data });
    } catch (error) {
      console.error("Error fetching assignments:", error);
    }
  },

  fetchClasses: async () => {
    try {
      const response = await fetch("/api/classes");
      if (!response.ok) throw new Error("Failed to fetch classes");

      const data = await response.json();
      set({ classes: data });
    } catch (error) {
      console.error("Error fetching classes:", error);
    }
  },

  addClass: async (name, color) => {
    try {
      const response = await fetch("/api/classes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, color }),
      });

      if (!response.ok) throw new Error("Failed to add class");

      const newClass = await response.json();
      set((state) => ({ classes: [...state.classes, newClass] }));
    } catch (error) {
      console.error("Error adding class:", error);
    }
  },

  addAssignment: async (title, dueDate, classId, description = "") => {
    try {
      const response = await fetch("/api/assignments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, dueDate, classId, description }),
      });

      if (!response.ok) throw new Error("Failed to add assignment");

      const newAssignment = await response.json();
      set((state) => ({ assignments: [...state.assignments, newAssignment] }));
    } catch (error) {
      console.error("Error adding assignment:", error);
    }
  },
}));
