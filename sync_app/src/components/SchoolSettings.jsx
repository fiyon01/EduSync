import React, { useState, useEffect } from 'react';
import { 
  FaSchool, FaCalendarAlt, FaBook, FaChalkboardTeacher,
  FaPlus, FaTrash, FaUsers, FaEdit, FaSave, FaCogs,
  FaGraduationCap, FaListAlt, FaInfoCircle, FaMapMarkerAlt, 
  FaGlobeAfrica, FaUserTie, FaMoneyBillWave
} from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { motion } from 'framer-motion';
import axios from 'axios';

const SchoolSettings = () => {
  // Enhanced state initialization with proper null checks
  const [data, setData] = useState({
    school: null,
    settings: null,
    academicYear: null,
    currentTerm: null,
    classes: [],
    teachers: [],
    subjects: []
  });
  
  const [formData, setFormData] = useState({
    schoolInfo: {
      name: '',
      code: '',
      motto: '',
      type: 'National',
      category: 'Mixed',
      address: '',
      county: '',
      sub_county: '',
      ward: '',
      phone: '',
      email: '',
      website: '',
      principal_name: '',
      principal_phone: ''
    },
    academicSettings: {
      academic_year_start: '',
      academic_year_end: '',
      current_term: 'Term 1',
      term_start_date: '',
      term_end_date: '',
      exam_percentage: 70,
      cat_percentage: 30,
      fees_payment_deadline: '',
      late_fee_penalty: 0
    }
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('schoolInfo');
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingClasses, setIsEditingClasses] = useState(false);
  const [isEditingSubjects, setIsEditingSubjects] = useState(false);

  const [newClass, setNewClass] = useState({
    name: '',
    stream: '',
    class_teacher_id: ''
  });
  
  const [newSubject, setNewSubject] = useState({
    name: '',
    code: '',
    category: 'Compulsory',
    is_examinable: true
  });
  
  const [editingClass, setEditingClass] = useState(null);
  const [editingSubject, setEditingSubject] = useState(null);

  // Enhanced data fetching with proper error handling
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const schoolId = localStorage.getItem("schoolId");
        if (!schoolId) {
          throw new Error("School ID not found in local storage");
        }
  
        const response = await axios.get(`http://localhost:3500/api/school?schoolId=${schoolId}`);
        
        if (!response.data?.success) {
          throw new Error("API request was not successful");
        }
  
        // Extract the first school from the array
        const schoolData = response.data.school?.[0] || {};
  
        // Update all data states with proper null checks
        setData({
          school: schoolData,
          settings: response.data.settings || {},
          academicYear: response.data.academicYear || {},
          currentTerm: response.data.currentTerm || {},
          classes: response.data.classes || [],
          teachers: response.data.teachers || [],
          subjects: response.data.subjects || []
        });
  
        // Update form data
        setFormData({
          schoolInfo: {
            name: schoolData.name || '',
            code: schoolData.code || '',
            motto: schoolData.motto || '',
            type: schoolData.type || 'National',
            category: schoolData.category || 'Mixed',
            address: schoolData.address || '',
            county: schoolData.county || '',
            sub_county: schoolData.sub_county || '',
            ward: schoolData.ward || '',
            phone: schoolData.phone || '',
            email: schoolData.email || '',
            website: schoolData.website || '',
            principal_name: schoolData.principal_name || '',
            principal_phone: schoolData.principal_phone || ''
          },
          academicSettings: {
            academic_year_start: response.data.settings?.academic_year_start?.split('T')[0] || '',
            academic_year_end: response.data.settings?.academic_year_end?.split('T')[0] || '',
            current_term: response.data.settings?.current_term || 'Term 1',
            term_start_date: response.data.settings?.term_start_date?.split('T')[0] || '',
            term_end_date: response.data.settings?.term_end_date?.split('T')[0] || '',
            exam_percentage: parseFloat(response.data.settings?.exam_percentage) || 70,
            cat_percentage: parseFloat(response.data.settings?.cat_percentage) || 30,
            fees_payment_deadline: response.data.settings?.fees_payment_deadline?.split('T')[0] || '',
            late_fee_penalty: parseFloat(response.data.settings?.late_fee_penalty) || 0
          }
        });
  
      } catch (error) {
        console.error("Data fetching error:", error);
        setError(error.message);
        toast.error(`Failed to load data: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
  }, []);

  // Enhanced input handlers
  const handleInputChange = (e, section) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [name]: value
      }
    }));
  };

  const handleClassInputChange = (e) => {
    const { name, value } = e.target;
    if (editingClass) {
      setEditingClass(prev => ({ ...prev, [name]: value }));
    } else {
      setNewClass(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubjectInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const inputValue = type === 'checkbox' ? checked : value;
    
    if (editingSubject) {
      setEditingSubject(prev => ({ ...prev, [name]: inputValue }));
    } else {
      setNewSubject(prev => ({ ...prev, [name]: inputValue }));
    }
  };

  const handleAddClass = async () => {
    if (!newClass.name || !newClass.stream) {
      toast.error('Class name and stream are required');
      return;
    }

    try {
      setLoading(true);
      const schoolId = localStorage.getItem("schoolId");
      const response = await axios.post('http://localhost:3500/api/classes', {
        ...newClass,
        academic_year_id: data.academicYear?.id,
        school_id: schoolId
      });
      
      setData(prev => ({
        ...prev,
        classes: [...prev.classes, response.data]
      }));
      
      setNewClass({ name: '', stream: '', class_teacher_id: '' });
      toast.success('Class added successfully');
    } catch (error) {
      toast.error('Failed to add class');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateClass = async () => {
    if (!editingClass?.name || !editingClass?.stream) {
      toast.error('Class name and stream are required');
      return;
    }

    try {
      setLoading(true);
      await axios.put(`http://localhost:3500/api/classes/${editingClass.id}`, editingClass);
      
      setData(prev => ({
        ...prev,
        classes: prev.classes.map(cls => 
          cls.id === editingClass.id ? editingClass : cls
        )
      }));
      
      setEditingClass(null);
      toast.success('Class updated successfully');
    } catch (error) {
      toast.error('Failed to update class');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClass = async (classId) => {
    try {
      setLoading(true);
      await axios.delete(`http://localhost:3500/api/classes/${classId}`);
      
      setData(prev => ({
        ...prev,
        classes: prev.classes.filter(c => c.id !== classId)
      }));
      
      toast.success('Class deleted successfully');
    } catch (error) {
      toast.error('Failed to delete class');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddSubject = async () => {
    if (!newSubject.name || !newSubject.code) {
      toast.error('Subject name and code are required');
      return;
    }

    try {
      setLoading(true);
      const schoolId = localStorage.getItem("schoolId");
      const response = await axios.post('http://localhost:3500/api/subjects', {
        ...newSubject,
        school_id: schoolId
      });
      
      setData(prev => ({
        ...prev,
        subjects: [...prev.subjects, response.data]
      }));
      
      setNewSubject({
        name: '',
        code: '',
        category: 'Compulsory',
        is_examinable: true
      });
      
      toast.success('Subject added successfully');
    } catch (error) {
      toast.error('Failed to add subject');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateSubject = async () => {
    if (!editingSubject?.name || !editingSubject?.code) {
      toast.error('Subject name and code are required');
      return;
    }

    try {
      setLoading(true);
      await axios.put(`http://localhost:3500/api/subjects/${editingSubject.id}`, editingSubject);
      
      setData(prev => ({
        ...prev,
        subjects: prev.subjects.map(sub => 
          sub.id === editingSubject.id ? editingSubject : sub
        )
      }));
      
      setEditingSubject(null);
      toast.success('Subject updated successfully');
    } catch (error) {
      toast.error('Failed to update subject');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSubject = async (subjectId) => {
    try {
      setLoading(true);
      await axios.delete(`http://localhost:3500/api/subjects/${subjectId}`);
      
      setData(prev => ({
        ...prev,
        subjects: prev.subjects.filter(s => s.id !== subjectId)
      }));
      
      toast.success('Subject deleted successfully');
    } catch (error) {
      toast.error('Failed to delete subject');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const schoolId = localStorage.getItem("schoolId");
    try {
      setLoading(true);
      
      await Promise.all([
        axios.put('http://localhost:3500/api/school/info', { ...formData.schoolInfo, id: schoolId }),
        axios.put('http://localhost:3500/api/school/settings', { ...formData.academicSettings, school_id: schoolId })
      ]);
      
      const response = await axios.get(`http://localhost:3500/api/school?schoolId=${schoolId}`);
      setData({
        ...data,
        school: response.data.school,
        settings: response.data.settings
      });
      
      toast.success('Settings updated successfully');
      setIsEditing(false);
      setIsEditingClasses(false);
      setIsEditingSubjects(false);
    } catch (error) {
      toast.error('Error updating settings');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Enhanced input styling with transitions and better focus states
  const inputClasses = `w-full px-4 py-2.5 text-gray-700 bg-gray-50 rounded-lg border-2 transition-all duration-300 focus:outline-none focus:ring-2 ${
    isEditing 
      ? 'border-blue-300 focus:border-blue-500 focus:ring-blue-200 hover:border-blue-400' 
      : 'border-gray-200 focus:border-gray-300 focus:ring-gray-100 hover:border-gray-300'
  }`;

  const labelClasses = "block text-sm font-medium text-gray-700 mb-1.5 flex items-center";

  const renderSchoolInfo = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className={labelClasses}><FaInfoCircle className="mr-2 text-blue-500" /> School Name</label>
          <input
            type="text"
            className={inputClasses}
            name="name"
            value={formData.schoolInfo.name}
            onChange={(e) => handleInputChange(e, 'schoolInfo')}
            disabled={!isEditing}
          />
        </div>
        <div>
          <label className={labelClasses}><FaInfoCircle className="mr-2 text-blue-500" /> School Code</label>
          <input
            type="text"
            className={inputClasses}
            name="code"
            value={formData.schoolInfo.code}
            onChange={(e) => handleInputChange(e, 'schoolInfo')}
            disabled={!isEditing}
          />
        </div>
        <div>
          <label className={labelClasses}><FaInfoCircle className="mr-2 text-blue-500" /> School Motto</label>
          <input
            type="text"
            className={inputClasses}
            name="motto"
            value={formData.schoolInfo.motto}
            onChange={(e) => handleInputChange(e, 'schoolInfo')}
            disabled={!isEditing}
          />
        </div>
        <div>
          <label className={labelClasses}><FaInfoCircle className="mr-2 text-blue-500" /> School Type</label>
          <select
            className={inputClasses}
            name="type"
            value={formData.schoolInfo.type}
            onChange={(e) => handleInputChange(e, 'schoolInfo')}
            disabled={!isEditing}
          >
            <option value="National">National</option>
            <option value="Extra-County">Extra-County</option>
            <option value="County">County</option>
            <option value="Sub-County">Sub-County</option>
            <option value="Private">Private</option>
          </select>
        </div>
        <div>
          <label className={labelClasses}><FaInfoCircle className="mr-2 text-blue-500" /> School Category</label>
          <select
            className={inputClasses}
            name="category"
            value={formData.schoolInfo.category}
            onChange={(e) => handleInputChange(e, 'schoolInfo')}
            disabled={!isEditing}
          >
            <option value="Boys">Boys</option>
            <option value="Girls">Girls</option>
            <option value="Mixed">Mixed</option>
          </select>
        </div>
        <div>
          <label className={labelClasses}><FaMapMarkerAlt className="mr-2 text-blue-500" /> Address</label>
          <input
            type="text"
            className={inputClasses}
            name="address"
            value={formData.schoolInfo.address}
            onChange={(e) => handleInputChange(e, 'schoolInfo')}
            disabled={!isEditing}
          />
        </div>
        <div>
          <label className={labelClasses}><FaMapMarkerAlt className="mr-2 text-blue-500" /> County</label>
          <input
            type="text"
            className={inputClasses}
            name="county"
            value={formData.schoolInfo.county}
            onChange={(e) => handleInputChange(e, 'schoolInfo')}
            disabled={!isEditing}
          />
        </div>
        <div>
          <label className={labelClasses}><FaMapMarkerAlt className="mr-2 text-blue-500" /> Sub-County</label>
          <input
            type="text"
            className={inputClasses}
            name="sub_county"
            value={formData.schoolInfo.sub_county}
            onChange={(e) => handleInputChange(e, 'schoolInfo')}
            disabled={!isEditing}
          />
        </div>
        <div>
          <label className={labelClasses}><FaMapMarkerAlt className="mr-2 text-blue-500" /> Ward</label>
          <input
            type="text"
            className={inputClasses}
            name="ward"
            value={formData.schoolInfo.ward}
            onChange={(e) => handleInputChange(e, 'schoolInfo')}
            disabled={!isEditing}
          />
        </div>
        <div>
          <label className={labelClasses}><FaInfoCircle className="mr-2 text-blue-500" /> Phone</label>
          <input
            type="text"
            className={inputClasses}
            name="phone"
            value={formData.schoolInfo.phone}
            onChange={(e) => handleInputChange(e, 'schoolInfo')}
            disabled={!isEditing}
          />
        </div>
        <div>
          <label className={labelClasses}><FaInfoCircle className="mr-2 text-blue-500" /> Email</label>
          <input
            type="email"
            className={inputClasses}
            name="email"
            value={formData.schoolInfo.email}
            onChange={(e) => handleInputChange(e, 'schoolInfo')}
            disabled={!isEditing}
          />
        </div>
        <div>
          <label className={labelClasses}><FaGlobeAfrica className="mr-2 text-blue-500" /> Website</label>
          <input
            type="text"
            className={inputClasses}
            name="website"
            value={formData.schoolInfo.website}
            onChange={(e) => handleInputChange(e, 'schoolInfo')}
            disabled={!isEditing}
          />
        </div>
        <div>
          <label className={labelClasses}><FaUserTie className="mr-2 text-blue-500" /> Principal Name</label>
          <input
            type="text"
            className={inputClasses}
            name="principal_name"
            value={formData.schoolInfo.principal_name}
            onChange={(e) => handleInputChange(e, 'schoolInfo')}
            disabled={!isEditing}
          />
        </div>
        <div>
          <label className={labelClasses}><FaUserTie className="mr-2 text-blue-500" /> Principal Phone</label>
          <input
            type="text"
            className={inputClasses}
            name="principal_phone"
            value={formData.schoolInfo.principal_phone}
            onChange={(e) => handleInputChange(e, 'schoolInfo')}
            disabled={!isEditing}
          />
        </div>
      </div>
    </motion.div>
  );

  const renderAcademicSettings = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className={labelClasses}><FaCalendarAlt className="mr-2 text-blue-500" /> Academic Year Start</label>
          <input
            type="date"
            className={inputClasses}
            name="academic_year_start"
            value={formData.academicSettings.academic_year_start}
            onChange={(e) => handleInputChange(e, 'academicSettings')}
            disabled={!isEditing}
          />
        </div>
        <div>
          <label className={labelClasses}><FaCalendarAlt className="mr-2 text-blue-500" /> Academic Year End</label>
          <input
            type="date"
            className={inputClasses}
            name="academic_year_end"
            value={formData.academicSettings.academic_year_end}
            onChange={(e) => handleInputChange(e, 'academicSettings')}
            disabled={!isEditing}
          />
        </div>
        <div>
          <label className={labelClasses}><FaCalendarAlt className="mr-2 text-blue-500" /> Current Term</label>
          <select
            className={inputClasses}
            name="current_term"
            value={formData.academicSettings.current_term}
            onChange={(e) => handleInputChange(e, 'academicSettings')}
            disabled={!isEditing}
          >
            <option value="Term 1">Term 1</option>
            <option value="Term 2">Term 2</option>
            <option value="Term 3">Term 3</option>
          </select>
        </div>
        <div>
          <label className={labelClasses}><FaCalendarAlt className="mr-2 text-blue-500" /> Term Start Date</label>
          <input
            type="date"
            className={inputClasses}
            name="term_start_date"
            value={formData.academicSettings.term_start_date}
            onChange={(e) => handleInputChange(e, 'academicSettings')}
            disabled={!isEditing}
          />
        </div>
        <div>
          <label className={labelClasses}><FaCalendarAlt className="mr-2 text-blue-500" /> Term End Date</label>
          <input
            type="date"
            className={inputClasses}
            name="term_end_date"
            value={formData.academicSettings.term_end_date}
            onChange={(e) => handleInputChange(e, 'academicSettings')}
            disabled={!isEditing}
          />
        </div>
        <div>
          <label className={labelClasses}><FaBook className="mr-2 text-blue-500" /> Exam Percentage</label>
          <input
            type="number"
            className={inputClasses}
            name="exam_percentage"
            value={formData.academicSettings.exam_percentage}
            onChange={(e) => handleInputChange(e, 'academicSettings')}
            disabled={!isEditing}
          />
        </div>
        <div>
          <label className={labelClasses}><FaBook className="mr-2 text-blue-500" /> CAT Percentage</label>
          <input
            type="number"
            className={inputClasses}
            name="cat_percentage"
            value={formData.academicSettings.cat_percentage}
            onChange={(e) => handleInputChange(e, 'academicSettings')}
            disabled={!isEditing}
          />
        </div>
        <div>
          <label className={labelClasses}><FaMoneyBillWave className="mr-2 text-blue-500" /> Fees Payment Deadline</label>
          <input
            type="date"
            className={inputClasses}
            name="fees_payment_deadline"
            value={formData.academicSettings.fees_payment_deadline}
            onChange={(e) => handleInputChange(e, 'academicSettings')}
            disabled={!isEditing}
          />
        </div>
        <div>
          <label className={labelClasses}><FaMoneyBillWave className="mr-2 text-blue-500" /> Late Fee Penalty</label>
          <input
            type="number"
            className={inputClasses}
            name="late_fee_penalty"
            value={formData.academicSettings.late_fee_penalty}
            onChange={(e) => handleInputChange(e, 'academicSettings')}
            disabled={!isEditing}
          />
        </div>
      </div>
    </motion.div>
  );

  const renderClassManagement = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <FaChalkboardTeacher className="text-blue-500" />
          Class Management
        </h3>
        
        {!isEditingClasses ? (
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition-colors"
            onClick={() => setIsEditingClasses(true)}
          >
            <FaEdit className="mr-2" />
            Edit Classes
          </motion.button>
        ) : (
          <div className="flex gap-2">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition-colors"
              onClick={() => {
                setIsEditingClasses(false);
                setEditingClass(null);
              }}
              disabled={loading}
            >
              <FaSave className="mr-2" />
              Done Editing
            </motion.button>
          </div>
        )}
      </div>
  
      {/* Add/Edit Class Form */}
      {isEditingClasses && (
        <motion.div
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-blue-50 p-4 rounded-lg border border-blue-200 shadow-sm"
        >
          <h4 className="text-md font-medium text-blue-800 mb-3 flex items-center gap-2">
            {editingClass ? (
              <FaEdit className="text-blue-600" />
            ) : (
              <FaPlus className="text-blue-600" />
            )}
            {editingClass ? 'Edit Class' : 'Add New Class'}
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className={labelClasses}>Class Name</label>
              <select
                className={`${inputClasses} ${editingClass ? 'bg-white' : 'bg-gray-50'}`}
                name="name"
                value={editingClass?.name || newClass.name}
                onChange={handleClassInputChange}
              >
                <option value="">Select Class</option>
                <option value="Form 1">Form 1</option>
                <option value="Form 2">Form 2</option>
                <option value="Form 3">Form 3</option>
                <option value="Form 4">Form 4</option>
              </select>
            </div>
            
            <div>
              <label className={labelClasses}>Stream</label>
              <select
                className={`${inputClasses} ${editingClass ? 'bg-white' : 'bg-gray-50'}`}
                name="stream"
                value={editingClass?.stream || newClass.stream}
                onChange={handleClassInputChange}
              >
                <option value="">Select Stream</option>
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="C">C</option>
                <option value="D">D</option>
              </select>
            </div>
            
            <div>
              <label className={labelClasses}>Class Teacher</label>
              <select
                className={`${inputClasses} ${editingClass ? 'bg-white' : 'bg-gray-50'}`}
                name="class_teacher_id"
                value={editingClass?.class_teacher_id || newClass.class_teacher_id}
                onChange={handleClassInputChange}
              >
                <option value="">Select Teacher</option>
                {data.teachers && data.teachers.map(teacher => (
                  <option key={teacher.id} value={teacher.id}>
                    {teacher.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="flex items-end gap-2">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                className={`w-full p-3 rounded-md flex items-center justify-center gap-2 transition-colors ${
                  editingClass 
                    ? 'bg-green-600 hover:bg-green-700 text-white' 
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
                onClick={editingClass ? handleUpdateClass : handleAddClass}
                disabled={loading}
              >
                {editingClass ? <FaSave /> : <FaPlus />} 
                {editingClass ? 'Update Class' : 'Add Class'}
              </motion.button>
              
              {editingClass && (
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  className="w-full p-3 rounded-md flex items-center justify-center gap-2 bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors"
                  onClick={() => setEditingClass(null)}
                >
                  Cancel
                </motion.button>
              )}
            </div>
          </div>
        </motion.div>
      )}
  
      {/* Classes Table */}
      <div className="overflow-x-auto border border-gray-200 rounded-lg shadow-sm">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-b border-gray-200">
                Class
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-b border-gray-200">
                Stream
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-b border-gray-200">
                Class Teacher
              </th>
              {isEditingClasses && (
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-b border-gray-200">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.classes && data.classes.length > 0 ? (
              data.classes.map(cls => (
                <tr key={cls.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 border-b border-gray-200">
                    <div className="flex items-center gap-2">
                      <FaUsers className="text-gray-400" />
                      {cls.name}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 border-b border-gray-200">
                    {cls.stream}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 border-b border-gray-200">
                    {cls.teacher_name || 'Not assigned'}
                  </td>
                  {isEditingClasses && (
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 border-b border-gray-200">
                      <div className="flex gap-3">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="text-blue-500 hover:text-blue-700 transition-colors"
                          onClick={() => setEditingClass(cls)}
                          disabled={loading}
                        >
                          <FaEdit />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="text-red-500 hover:text-red-700 transition-colors"
                          onClick={() => handleDeleteClass(cls.id)}
                          disabled={loading}
                        >
                          <FaTrash />
                        </motion.button>
                      </div>
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={isEditingClasses ? 4 : 3} className="px-6 py-6 text-center text-gray-500">
                  No classes found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </motion.div>
  );

  const renderSubjectManagement = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <FaBook className="text-blue-500" />
          Subject Management
        </h3>
        {!isEditingSubjects ? (
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition-colors"
            onClick={() => setIsEditingSubjects(true)}
          >
            <FaEdit className="mr-2" />
            Edit Subjects
          </motion.button>
        ) : (
          <div className="flex gap-2">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition-colors"
              onClick={() => {
                setIsEditingSubjects(false);
                setEditingSubject(null);
              }}
              disabled={loading}
            >
              <FaSave className="mr-2" />
              Done Editing
            </motion.button>
          </div>
        )}
      </div>
  
      {isEditingSubjects && (
        <motion.div
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-blue-50 p-4 rounded-lg border border-blue-200 shadow-sm"
        >
          <h4 className="text-md font-medium text-blue-800 mb-3 flex items-center gap-2">
            {editingSubject ? (
              <FaEdit className="text-blue-600" />
            ) : (
              <FaPlus className="text-blue-600" />
            )}
            {editingSubject ? 'Edit Subject' : 'Add New Subject'}
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className={labelClasses}>Subject Name</label>
              <input
                type="text"
                className={`${inputClasses} ${editingSubject ? 'bg-white' : 'bg-gray-50'}`}
                name="name"
                value={editingSubject?.name || newSubject.name}
                onChange={handleSubjectInputChange}
              />
            </div>
            <div>
              <label className={labelClasses}>Subject Code</label>
              <input
                type="text"
                className={`${inputClasses} ${editingSubject ? 'bg-white' : 'bg-gray-50'}`}
                name="code"
                value={editingSubject?.code || newSubject.code}
                onChange={handleSubjectInputChange}
              />
            </div>
            <div>
              <label className={labelClasses}>Category</label>
              <select
                className={`${inputClasses} ${editingSubject ? 'bg-white' : 'bg-gray-50'}`}
                name="category"
                value={editingSubject?.category || newSubject.category}
                onChange={handleSubjectInputChange}
              >
                <option value="Compulsory">Compulsory</option>
                <option value="Science">Science</option>
                <option value="Humanities">Humanities</option>
                <option value="Technical">Technical</option>
                <option value="Languages">Languages</option>
                <option value="Others">Others</option>
              </select>
            </div>
            <div className="flex items-center">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  className={`form-checkbox h-5 w-5 rounded text-blue-600 transition duration-150 ${
                    editingSubject ? 'bg-white' : 'bg-gray-50'
                  }`}
                  name="is_examinable"
                  checked={editingSubject?.is_examinable ?? newSubject.is_examinable}
                  onChange={handleSubjectInputChange}
                />
                <span className="text-gray-700">Examinable</span>
              </label>
            </div>
          </div>
          
          <div className="mt-4 flex gap-2">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              className={`px-4 py-2 rounded-md flex items-center gap-2 transition-colors ${
                editingSubject 
                  ? 'bg-green-600 hover:bg-green-700 text-white' 
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
              onClick={editingSubject ? handleUpdateSubject : handleAddSubject}
              disabled={loading}
            >
              {editingSubject ? <FaSave /> : <FaPlus />}
              {editingSubject ? 'Update Subject' : 'Add Subject'}
            </motion.button>
            
            {editingSubject && (
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                className="px-4 py-2 rounded-md flex items-center gap-2 bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors"
                onClick={() => setEditingSubject(null)}
              >
                Cancel
              </motion.button>
            )}
          </div>
        </motion.div>
      )}
  
      <div className="overflow-x-auto border border-gray-200 rounded-lg shadow-sm">
        {data?.subjects?.length > 0 ? (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-b border-gray-200">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-b border-gray-200">Code</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-b border-gray-200">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-b border-gray-200">Examinable</th>
                {isEditingSubjects && (
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-b border-gray-200">Actions</th>
                )}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.subjects.map(subject => (
                <tr key={subject.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 border-b border-gray-200">
                    {subject.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 border-b border-gray-200">
                    {subject.code}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 border-b border-gray-200">
                    {subject.category}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 border-b border-gray-200">
                    {subject.is_examinable ? (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        Yes
                      </span>
                    ) : (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                        No
                      </span>
                    )}
                  </td>
                  {isEditingSubjects && (
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 border-b border-gray-200">
                      <div className="flex gap-3">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="text-blue-500 hover:text-blue-700 transition-colors"
                          onClick={() => setEditingSubject(subject)}
                          disabled={loading}
                        >
                          <FaEdit />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="text-red-500 hover:text-red-700 transition-colors"
                          onClick={() => handleDeleteSubject(subject.id)}
                          disabled={loading}
                        >
                          <FaTrash />
                        </motion.button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="px-6 py-4 text-center text-gray-500">
            No subjects found
          </div>
        )}
      </div>
    </motion.div>
  );

  const tabButtonClasses = (isActive) => 
    `flex items-center px-4 py-3 text-sm font-medium rounded-t-lg transition-all duration-300 whitespace-nowrap ${
      isActive 
        ? 'text-blue-600 bg-white border-b-2 border-blue-500 shadow-sm' 
        : 'text-gray-500 hover:text-blue-500 hover:bg-gray-50'
    }`;

  return (
    <div className="flex flex-col h-full p-4 md:p-6 bg-gray-50 rounded-xl">
      {/* Header */}
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col md:flex-row md:items-center justify-between mb-6"
      >
        <div className="mb-4 md:mb-0">
          <h1 className="text-2xl font-bold text-gray-800 flex items-center">
            <FaCogs className="mr-3 text-blue-500" />
            School Settings
          </h1>
          <p className="text-gray-500 mt-1">
            Manage your school's basic information and academic configuration
          </p>
        </div>
        
        <div className="flex space-x-2">
          {!isEditing ? (
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition-colors"
              onClick={() => setIsEditing(true)}
            >
              <FaEdit className="mr-2" />
              Edit Settings
            </motion.button>
          ) : (
            <>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition-colors mr-2"
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                  </>
                ) : (
                  <>
                    <FaSave className="mr-2" />
                    Save Changes
                  </>
                )}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center px-4 py-2 bg-gray-200 text-gray-700 rounded-lg shadow hover:bg-gray-300 transition-colors"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </motion.button>
            </>
          )}
        </div>
      </motion.div>

      {/* Tabs and Content */}
      <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px overflow-x-auto">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={tabButtonClasses(activeTab === 'schoolInfo')}
              onClick={() => setActiveTab('schoolInfo')}
            >
              <FaSchool className="mr-2" />
              School Information
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={tabButtonClasses(activeTab === 'academicSettings')}
              onClick={() => setActiveTab('academicSettings')}
            >
              <FaCalendarAlt className="mr-2" />
              Academic Settings
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={tabButtonClasses(activeTab === 'classManagement')}
              onClick={() => setActiveTab('classManagement')}
            >
              <FaChalkboardTeacher className="mr-2" />
              Class Management
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={tabButtonClasses(activeTab === 'subjectManagement')}
              onClick={() => setActiveTab('subjectManagement')}
            >
              <FaBook className="mr-2" />
              Subject Management
            </motion.button>
          </nav>
        </div>
        
        {/* Content */}
        <div className="p-4 md:p-6" style={{ minHeight: '500px' }}>
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              {activeTab === 'schoolInfo' ? renderSchoolInfo() : 
               activeTab === 'academicSettings' ? renderAcademicSettings() : 
               activeTab === 'classManagement' ? renderClassManagement() :
               renderSubjectManagement()}
            </form>
          )}
        </div>
      </div>

      <ToastContainer 
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        toastClassName="shadow-lg"
        bodyClassName="text-sm font-medium"
        progressClassName="bg-blue-500"
      />
    </div>
  );
};

export default SchoolSettings;