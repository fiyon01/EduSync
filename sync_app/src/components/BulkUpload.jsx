import React, { useState, useRef } from 'react';
import Papa from 'papaparse';
import { 
  FaUpload, FaTrash, FaCheckCircle, FaExclamationTriangle,
  FaUserGraduate, FaUserTie, FaPhone, FaMoneyBillWave, FaIdCard,
  FaVenusMars, FaCalendarAlt, FaGraduationCap, FaFileCsv
} from 'react-icons/fa';

const BulkUpload = ({ onUpload }) => {
  const [file, setFile] = useState(null);
  const [previewData, setPreviewData] = useState([]);
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [success, setSuccess] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(10);
  const fileInputRef = useRef(null);

  // Required fields based on database schema
  const requiredFields = [
    { key: 'admissionnumber', label: 'Admission Number', icon: <FaIdCard className="mr-1" /> },
    { key: 'firstname', label: 'First Name', icon: <FaUserGraduate className="mr-1" /> },
    { key: 'lastname', label: 'Last Name', icon: <FaUserGraduate className="mr-1" /> },
    { key: 'gender', label: 'Gender', icon: <FaVenusMars className="mr-1" /> },
    { key: 'dateofbirth', label: 'Date of Birth', icon: <FaCalendarAlt className="mr-1" /> },
    { key: 'parentname', label: 'Parent Name', icon: <FaUserTie className="mr-1" /> },
    { key: 'parentcontact', label: 'Parent Contact', icon: <FaPhone className="mr-1" /> },
    { key: 'kcpeindex', label: 'KCPE Index', icon: <FaGraduationCap className="mr-1" /> },
    { key: 'kcpeemarks', label: 'KCPE Marks', icon: <FaGraduationCap className="mr-1" /> },
    { key: 'enrollmentdate', label: 'Enrollment Date', icon: <FaCalendarAlt className="mr-1" /> }
  ];

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFile(file);
    setLoading(true);
    setSuccess(false);
    setErrors([]);
    setCurrentPage(1);

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (header) => {
        return header
          .toLowerCase()
          .replace(/ /g, '')
          .replace(/[^a-z0-9]/g, '');
      },
      complete: (results) => {
        const validationErrors = [];
        const validatedData = [];

        results.data.forEach((row, index) => {
          const rowErrors = [];
          const validatedRow = {};

          // Validate required fields
          requiredFields.forEach(field => {
            if (!row[field.key] && row[field.key] !== 0) {
              rowErrors.push(`Missing ${field.label}`);
            } else {
              validatedRow[field.key] = row[field.key];
            }
          });

          // Validate specific fields
          if (row.gender && !['male', 'female'].includes(row.gender.toLowerCase())) {
            rowErrors.push("Gender must be 'male' or 'female'");
          }

          if (row.dateofbirth && isNaN(new Date(row.dateofbirth))) {
            rowErrors.push("Invalid date format for Date of Birth (use YYYY-MM-DD)");
          }

          if (row.enrollmentdate && isNaN(new Date(row.enrollmentdate))) {
            rowErrors.push("Invalid date format for Enrollment Date (use YYYY-MM-DD)");
          }

          if (row.kcpeemarks && isNaN(parseFloat(row.kcpeemarks))) {
            rowErrors.push("KCPE marks must be a number");
          }

          if (rowErrors.length > 0) {
            validationErrors.push({
              ...row,
              errors: rowErrors,
              row: index + 1
            });
          } else {
            // Format data for database
            validatedRow.admission_number = row.admissionnumber;
            validatedRow.first_name = row.firstname;
            validatedRow.last_name = row.lastname;
            validatedRow.gender = row.gender.toLowerCase();
            validatedRow.date_of_birth = new Date(row.dateofbirth).toISOString().split('T')[0];
            validatedRow.parent_name = row.parentname;
            validatedRow.parent_phone = row.parentcontact;
            validatedRow.kcpe_index = row.kcpeindex;
            validatedRow.kcpe_marks = parseFloat(row.kcpeemarks);
            validatedRow.enrollment_date = new Date(row.enrollmentdate).toISOString().split('T')[0];
            
            validatedData.push(validatedRow);
          }
        });

        setErrors(validationErrors);
        setPreviewData(validatedData);
        setLoading(false);
      },
      error: (error) => {
        console.error("CSV Parsing Error:", error);
        setErrors([{ error: "Failed to parse CSV file", details: error.message }]);
        setLoading(false);
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (errors.length > 0 || previewData.length === 0) return;

    setUploading(true);
    setUploadProgress(0);
    setSuccess(false);

    try {
      const response = await fetch('/api/students/bulk', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        },
        body: JSON.stringify({ students: previewData })
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        setUploadProgress(100);
        if (typeof onUpload === 'function') {
          onUpload(data.insertedStudents);
        }
        handleClearFile();
      } else {
        setErrors([{ error: data.message || 'Failed to upload students' }]);
      }
    } catch (err) {
      setErrors([{ error: 'Network error. Please try again.' }]);
    } finally {
      setUploading(false);
    }
  };

  const handleClearFile = () => {
    setFile(null);
    setPreviewData([]);
    setErrors([]);
    setSuccess(false);
    setUploadProgress(0);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Pagination logic
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = previewData.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.ceil(previewData.length / rowsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg border border-gray-200">
      <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-blue-600 flex items-center gap-2">
        <FaUpload className="text-blue-500" /> Bulk Upload Students
      </h2>
      
      {/* Success Message */}
      {success && (
        <div className="mb-4 sm:mb-6 bg-green-50 border-l-4 border-green-500 p-4 rounded-r">
          <div className="flex items-center">
            <FaCheckCircle className="text-green-500 mr-2 text-lg" />
            <span className="text-green-700 font-medium">Students uploaded successfully!</span>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
        {/* File Input */}
        <div>
          <label className="block text-sm sm:text-base font-medium text-gray-700 mb-2">
            Upload CSV File
          </label>
          <div className="relative">
            <div className="flex items-center gap-4">
              <label className="w-full">
                <div className="flex flex-col items-center justify-center px-4 py-6 bg-white border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-colors">
                  <FaFileCsv className="text-blue-500 text-3xl mb-2" />
                  <p className="text-sm sm:text-base text-gray-600 mb-1">
                    {file ? file.name : 'Click to select CSV file'}
                  </p>
                  <p className="text-xs text-gray-500">
                    {file ? 'File selected' : 'Supports: .csv'}
                  </p>
                </div>
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="hidden"
                  accept=".csv"
                  required
                  ref={fileInputRef}
                />
              </label>
            </div>
          </div>
          <div className="mt-3 text-sm text-gray-600">
            <p className="font-medium">CSV must include these required fields:</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 mt-2">
              {requiredFields.map((field, index) => (
                <div key={index} className="flex items-center text-xs sm:text-sm bg-gray-50 px-2 py-1 rounded">
                  {field.icon}
                  <span className="ml-1">{field.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Loading State */}
        {(loading || uploading) && (
          <div className="text-center py-4 text-gray-600">
            <div className="flex flex-col items-center justify-center">
              <div className="relative w-full bg-gray-200 rounded-full h-4 mb-3">
                <div 
                  className="absolute top-0 left-0 bg-blue-500 h-4 rounded-full transition-all duration-300 ease-out"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
              <div className="flex items-center justify-center gap-2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
                <span className="text-sm sm:text-base">
                  {loading ? 'Analyzing file...' : `Uploading students... ${uploadProgress}%`}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Preview Data */}
        {previewData.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <FaCheckCircle className="text-green-500" /> 
              <span>Valid Students Ready for Upload ({previewData.length})</span>
            </h3>
            
            <div className="overflow-x-auto border border-gray-200 rounded-lg shadow-sm">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs sm:text-sm font-medium text-gray-700 uppercase tracking-wider border-b border-gray-200">
                      <div className="flex items-center gap-1">
                        <FaIdCard className="text-gray-400" />
                        Adm No.
                      </div>
                    </th>
                    <th className="px-4 py-3 text-left text-xs sm:text-sm font-medium text-gray-700 uppercase tracking-wider border-b border-gray-200">
                      Name
                    </th>
                    <th className="px-4 py-3 text-left text-xs sm:text-sm font-medium text-gray-700 uppercase tracking-wider border-b border-gray-200">
                      <div className="flex items-center gap-1">
                        <FaVenusMars className="text-gray-400" />
                        Gender
                      </div>
                    </th>
                    <th className="px-4 py-3 text-left text-xs sm:text-sm font-medium text-gray-700 uppercase tracking-wider border-b border-gray-200">
                      <div className="flex items-center gap-1">
                        <FaCalendarAlt className="text-gray-400" />
                        DOB
                      </div>
                    </th>
                    <th className="px-4 py-3 text-left text-xs sm:text-sm font-medium text-gray-700 uppercase tracking-wider border-b border-gray-200">
                      <div className="flex items-center gap-1">
                        <FaUserTie className="text-gray-400" />
                        Parent
                      </div>
                    </th>
                    <th className="px-4 py-3 text-left text-xs sm:text-sm font-medium text-gray-700 uppercase tracking-wider border-b border-gray-200">
                      <div className="flex items-center gap-1">
                        <FaGraduationCap className="text-gray-400" />
                        KCPE
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentRows.map((student, index) => (
                    <tr key={index} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 whitespace-nowrap text-xs sm:text-sm text-gray-700 border-b border-gray-200">
                        {student.admission_number}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-xs sm:text-sm text-gray-700 border-b border-gray-200">
                        {student.first_name} {student.last_name}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-xs sm:text-sm text-gray-700 capitalize border-b border-gray-200">
                        {student.gender}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-xs sm:text-sm text-gray-700 border-b border-gray-200">
                        {student.date_of_birth}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-xs sm:text-sm text-gray-700 border-b border-gray-200">
                        <div className="flex items-center gap-2">
                          <span>{student.parent_name}</span>
                          <span className="text-gray-400">|</span>
                          <FaPhone className="text-gray-400" />
                          <span>{student.parent_phone}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-xs sm:text-sm text-gray-700 border-b border-gray-200">
                        {student.kcpe_marks} ({student.kcpe_index})
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  Showing {indexOfFirstRow + 1} to {Math.min(indexOfLastRow, previewData.length)} of {previewData.length} students
                </div>
                <div className="flex space-x-1">
                  <button
                    type="button"
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => paginate(i + 1)}
                      className={`px-3 py-1 border text-sm font-medium rounded-md ${currentPage === i + 1 ? 'bg-blue-500 text-white border-blue-500' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => paginate(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Validation Errors */}
        {errors.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-red-600 flex items-center gap-2">
              <FaExclamationTriangle className="text-red-500" /> 
              <span>Errors Found ({errors.length})</span>
            </h3>
            
            <div className="overflow-x-auto border border-red-200 rounded-lg shadow-sm">
              <table className="min-w-full divide-y divide-red-200">
                <thead className="bg-red-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs sm:text-sm font-medium text-red-700 uppercase tracking-wider border-b border-red-200">
                      Row
                    </th>
                    <th className="px-4 py-3 text-left text-xs sm:text-sm font-medium text-red-700 uppercase tracking-wider border-b border-red-200">
                      Adm No.
                    </th>
                    <th className="px-4 py-3 text-left text-xs sm:text-sm font-medium text-red-700 uppercase tracking-wider border-b border-red-200">
                      Name
                    </th>
                    <th className="px-4 py-3 text-left text-xs sm:text-sm font-medium text-red-700 uppercase tracking-wider border-b border-red-200">
                      Errors
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-red-100">
                  {errors.slice(0, 10).map((error, index) => (
                    <tr key={index} className="hover:bg-red-50 transition-colors">
                      <td className="px-4 py-3 whitespace-nowrap text-xs sm:text-sm text-red-600 border-b border-red-200">
                        {error.row}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-xs sm:text-sm text-gray-700 border-b border-red-200">
                        {error.admissionnumber || 'N/A'}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-xs sm:text-sm text-gray-700 border-b border-red-200">
                        {error.firstname || ''} {error.lastname || ''}
                      </td>
                      <td className="px-4 py-3 text-xs sm:text-sm text-red-600 border-b border-red-200">
                        <ul className="list-disc list-inside space-y-1">
                          {error.errors?.map((err, i) => (
                            <li key={i}>{err}</li>
                          )) || error.error}
                        </ul>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {errors.length > 10 && (
              <div className="text-sm text-gray-500">
                Showing first 10 errors of {errors.length} total errors
              </div>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <button
            type="button"
            onClick={handleClearFile}
            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 p-3 rounded-md flex items-center justify-center gap-2 transition-colors font-medium border border-gray-300"
            disabled={loading || uploading}
          >
            <FaTrash /> Clear
          </button>
          <button
            type="submit"
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-md flex items-center justify-center gap-2 transition-colors font-medium disabled:opacity-70 disabled:cursor-not-allowed"
            disabled={errors.length > 0 || previewData.length === 0 || loading || uploading}
          >
            {uploading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Uploading ({uploadProgress}%)
              </>
            ) : (
              <>
                <FaUpload /> Upload Students
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BulkUpload;