import React, { useState } from 'react';
import { FaEye, FaEdit, FaTrash, FaPrint } from 'react-icons/fa'; // Icons for actions

const ExamTimetable = () => {
  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const classes = ['Form 1', 'Form 2', 'Form 3', 'Form 4']; // Example classes
  const timeSlots = ['8:00-10:00', '10:30-12:30', '14:00-16:00']; // Example time slots

  const [exam, setExam] = useState({
    day: '',
    className: '',
    exams: [
      {
        subject: '',
        startTime: '',
        endTime: '',
        room: '',
        invigilator: '',
      },
    ],
  });

  const [exams, setExams] = useState([]); // List of saved exam timetables
  const [editIndex, setEditIndex] = useState(null); // Track the index of the exam being edited
  const [previewClass, setPreviewClass] = useState(null); // Track the class being previewed
  const [previewCombined, setPreviewCombined] = useState(false); // Track combined timetable preview

  const handleChange = (e, index) => {
    const { name, value } = e.target;
    if (index !== undefined) {
      const updatedExams = [...exam.exams];
      updatedExams[index] = { ...updatedExams[index], [name]: value };
      setExam({ ...exam, exams: updatedExams });
    } else {
      setExam({ ...exam, [name]: value });
    }
  };

  const handleAddExam = () => {
    setExam({
      ...exam,
      exams: [
        ...exam.exams,
        {
          subject: '',
          startTime: '',
          endTime: '',
          room: '',
          invigilator: '',
        },
      ],
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editIndex !== null) {
      // Update existing exam
      const updatedExams = [...exams];
      updatedExams[editIndex] = exam;
      setExams(updatedExams);
      setEditIndex(null);
    } else {
      // Add new exam
      setExams([...exams, exam]);
    }
    setExam({
      day: '',
      className: '',
      exams: [
        {
          subject: '',
          startTime: '',
          endTime: '',
          room: '',
          invigilator: '',
        },
      ],
    });
    alert('Exam timetable saved successfully!');
  };

  const handleEdit = (index) => {
    setExam(exams[index]);
    setEditIndex(index);
  };

  const handleDelete = (index) => {
    const updatedExams = exams.filter((_, i) => i !== index);
    setExams(updatedExams);
    alert('Exam timetable deleted successfully!');
  };

  const handlePrint = (index) => {
    const examToPrint = exams[index];
    alert(`Printing exam timetable for ${examToPrint.className} on ${examToPrint.day}`);
    // Implement PDF generation logic here
  };

  const handlePreview = (className) => {
    setPreviewClass(className);
    setPreviewCombined(false);
  };

  const handlePreviewCombined = () => {
    setPreviewCombined(true);
    setPreviewClass(null);
  };

  const handlePrintCombinedTimetable = () => {
    alert('Printing combined timetable for all classes');
    // Implement PDF generation logic for combined timetable here
  };

  const renderTimetable = (className) => {
    const timetable = {};
    daysOfWeek.forEach((day) => (timetable[day] = {}));

    exams
      .filter((exam) => !className || exam.className === className)
      .forEach((exam) => {
        exam.exams.forEach((examItem) => {
          const timeSlot = `${examItem.startTime}-${examItem.endTime}`;
          if (!timetable[exam.day][timeSlot]) {
            timetable[exam.day][timeSlot] = [];
          }
          timetable[exam.day][timeSlot].push({
            subject: examItem.subject,
            room: examItem.room,
            invigilator: examItem.invigilator,
            className: exam.className,
          });
        });
      });

    return (
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="p-3 border bg-gray-200">Day</th>
              {timeSlots.map((time) => (
                <th key={time} className="p-3 border bg-gray-200">
                  {time}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {daysOfWeek.map((day) => (
              <tr key={day}>
                <td className="p-3 border bg-gray-100">{day}</td>
                {timeSlots.map((time) => (
                  <td key={time} className="p-3 border">
                    {timetable[day][time]?.map((item, index) => (
                      <div key={index} className="mb-2">
                        <div><strong>{item.subject}</strong></div>
                        <div>Room: {item.room}</div>
                        <div>Invigilator: {item.invigilator}</div>
                        {previewCombined && <div>Class: {item.className}</div>}
                      </div>
                    ))}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const renderCombinedTimetable = () => {
    const combinedTimetable = {};
    daysOfWeek.forEach((day) => (combinedTimetable[day] = {}));

    exams.forEach((exam) => {
      exam.exams.forEach((examItem) => {
        const timeSlot = `${examItem.startTime}-${examItem.endTime}`;
        if (!combinedTimetable[exam.day][timeSlot]) {
          combinedTimetable[exam.day][timeSlot] = [];
        }
        combinedTimetable[exam.day][timeSlot].push({
          subject: examItem.subject,
          room: examItem.room,
          invigilator: examItem.invigilator,
          className: exam.className,
        });
      });
    });

    return (
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="p-3 border bg-gray-200">Day</th>
              {timeSlots.map((time) => (
                <th key={time} className="p-3 border bg-gray-200">
                  {time}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {daysOfWeek.map((day) => (
              <tr key={day}>
                <td className="p-3 border bg-gray-100">{day}</td>
                {timeSlots.map((time) => (
                  <td key={time} className="p-3 border">
                    {combinedTimetable[day][time]?.map((item, index) => (
                      <div key={index} className="mb-2">
                        <div><strong>{item.subject}</strong></div>
                        <div>Room: {item.room}</div>
                        <div>Invigilator: {item.invigilator}</div>
                        <div>Class: {item.className}</div>
                      </div>
                    ))}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Exam Timetable Setup</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Day</label>
          <select
            name="day"
            value={exam.day}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            required
          >
            <option value="">Select Day</option>
            {daysOfWeek.map((day) => (
              <option key={day} value={day}>
                {day}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Class Name</label>
          <select
            name="className"
            value={exam.className}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            required
          >
            <option value="">Select Class</option>
            {classes.map((cls) => (
              <option key={cls} value={cls}>
                {cls}
              </option>
            ))}
          </select>
        </div>
        {exam.exams.map((examItem, index) => (
          <div key={index} className="space-y-4 border p-4 rounded-lg">
            <div>
              <label className="block text-sm font-medium text-gray-700">Subject</label>
              <input
                type="text"
                name="subject"
                value={examItem.subject}
                onChange={(e) => handleChange(e, index)}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Start Time</label>
              <input
                type="time"
                name="startTime"
                value={examItem.startTime}
                onChange={(e) => handleChange(e, index)}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">End Time</label>
              <input
                type="time"
                name="endTime"
                value={examItem.endTime}
                onChange={(e) => handleChange(e, index)}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Room</label>
              <input
                type="text"
                name="room"
                value={examItem.room}
                onChange={(e) => handleChange(e, index)}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Invigilator</label>
              <input
                type="text"
                name="invigilator"
                value={examItem.invigilator}
                onChange={(e) => handleChange(e, index)}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                required
              />
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={handleAddExam}
          className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
        >
          Add Another Exam
        </button>
        <button
          type="submit"
          className="w-full bg-green-500 text-white p-2 rounded-md hover:bg-green-600"
        >
          {editIndex !== null ? 'Update Exam Timetable' : 'Save Exam Timetable'}
        </button>
      </form>

      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">Saved Exam Timetables</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-3 text-left">Day</th>
                <th className="p-3 text-left">Class</th>
                <th className="p-3 text-left">Exams</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {exams.map((exam, index) => (
                <tr key={index} className="hover:bg-gray-100">
                  <td className="p-3 border">{exam.day}</td>
                  <td className="p-3 border">{exam.className}</td>
                  <td className="p-3 border">
                    <ul>
                      {exam.exams.map((examItem, idx) => (
                        <li key={idx}>
                          {examItem.subject} ({examItem.startTime} - {examItem.endTime})
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td className="p-3 border">
                    <div className="flex space-x-3">
                      <button
                        onClick={() => handlePreview(exam.className)}
                        className="text-blue-500 hover:text-blue-700"
                        title="Preview"
                      >
                        <FaEye />
                      </button>
                      <button
                        onClick={() => handleEdit(index)}
                        className="text-yellow-500 hover:text-yellow-700"
                        title="Edit"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(index)}
                        className="text-red-500 hover:text-red-700"
                        title="Delete"
                      >
                        <FaTrash />
                      </button>
                      <button
                        onClick={() => handlePrint(index)}
                        className="text-green-500 hover:text-green-700"
                        title="Print"
                      >
                        <FaPrint />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-8">
        <button
          onClick={handlePreviewCombined}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 mr-4"
        >
          Preview Combined Timetable
        </button>
        <button
          onClick={handlePrintCombinedTimetable}
          className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
        >
          Print Combined Timetable
        </button>
      </div>

      {(previewClass || previewCombined) && (
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4">
            {previewCombined ? 'Combined Timetable' : `Timetable for ${previewClass}`}
          </h2>
          {previewCombined ? renderCombinedTimetable() : renderTimetable(previewClass)}
        </div>
      )}
    </div>
  );
};

export default ExamTimetable;