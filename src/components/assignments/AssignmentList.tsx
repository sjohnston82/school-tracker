import { isSameDay } from 'date-fns';
import { useSchoolStore } from '@/stores/schoolStore';
import React from 'react'
import { BsTrash3Fill } from 'react-icons/bs';

interface IAssignmentList {
  selectedDate: Date | number | string;
}

const AssignmentList = ({ selectedDate }: IAssignmentList) => {

  const { assignments, classes, deleteAssignment } = useSchoolStore();

  const filteredAssignments = assignments.filter(
    (assignment) =>
      selectedDate && isSameDay(new Date(assignment.dueDate), selectedDate)
  );

  const handleDelete = async (assignmentId: string) => {
    await deleteAssignment(assignmentId);
  };

  return (
  
          <div className="flex w-full">
            {filteredAssignments.length > 0 ? (
              <ul className="w-full">
                {filteredAssignments.map((assignment) => {
                  const assignmentClass = classes.find(
                    (cls) => cls.id === assignment.classId
                  );
                  return (
                    <li
                      key={assignment.id}
                      className="p-2 border rounded mt-2 bg-lightpurp shadow-black shadow-md "
                    >
                      <div className="flex justify-between gap-4">
                        <div className="">
                          <strong className="text-lg ">
                            {assignment.title}
                          </strong>
                          <p className="text-md ">
                            {assignment.description || "No description"}
                          </p>
                          {assignmentClass && (
                            <p className="text-lg ">
                              Class: {assignmentClass.name}
                            </p>
                          )}
                        </div>
                        <div
                          className="flex justify-center items-center pr-4 cursor-pointer"
                          onClick={() => handleDelete(assignment.id)}
                        >
                          <BsTrash3Fill size={25} />
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p>No assignments added yet.</p>
            )}
            {/* Add Assignment Form */}
          </div>
  )
}

export default AssignmentList