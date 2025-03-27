import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  FaMoneyBillWave,
  FaFileInvoiceDollar,
  FaReceipt,
  FaChartLine,
  FaChartPie,
  FaChartBar,
  FaFilePdf,
  FaFileExcel,
  FaFileCsv,
  FaTrash,
  FaEdit,
  FaEye,
  FaPlus,
  FaBell,
  FaUserGraduate,
  FaMoneyCheckAlt,
  FaCalendarAlt,
  FaDollarSign,
  FaInfoCircle,
  FaSearch,
  FaCheckCircle,
  FaExclamationCircle,
  FaSpinner,
  FaUsers,
  FaUserTie,
  FaBalanceScale,
  FaCashRegister
} from "react-icons/fa";
import { toast } from "react-toastify";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';

const FinancialManagementSystem = ({ schoolId }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Fee Management State
  const [students, setStudents] = useState([]);
  const [feeStructures, setFeeStructures] = useState([]);
  const [payments, setPayments] = useState([]);
  const [receipts, setReceipts] = useState([]);
  
  // Expense Management State
  const [expenses, setExpenses] = useState([]);
  const [expenseCategories, setExpenseCategories] = useState([]);
  
  // Payroll State
  const [staff, setStaff] = useState([]);
  const [payroll, setPayroll] = useState([]);
  const [salaryPayments, setSalaryPayments] = useState([]);
  
  // Budget State
  const [budgets, setBudgets] = useState([]);
  
  // Reports State
  const [reports, setReports] = useState([]);
  const [reportPeriod, setReportPeriod] = useState({
    start: new Date(new Date().getFullYear(), 0, 1).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  });
  
  // Form States
  const [feePaymentForm, setFeePaymentForm] = useState({
    student_id: "",
    fee_item_id: "",
    term_id: "",
    amount: "",
    payment_date: new Date().toISOString().split('T')[0],
    payment_method: "MPesa",
    transaction_code: ""
  });
  
  const [expenseForm, setExpenseForm] = useState({
    category_id: "",
    amount: "",
    expense_date: new Date().toISOString().split('T')[0],
    description: "",
    payment_method: "Bank",
    reference_number: ""
  });
  
  const [payrollForm, setPayrollForm] = useState({
    staff_id: "",
    basic_salary: "",
    house_allowance: "0",
    medical_allowance: "0",
    transport_allowance: "0",
    other_allowance: "0",
    nhif_deduction: "0",
    nssf_deduction: "0",
    paye_deduction: "0",
    other_deductions: "0",
    bank_name: "",
    bank_account: "",
    payment_method: "Bank"
  });
  
  const [budgetForm, setBudgetForm] = useState({
    academic_year_id: "",
    term_id: "",
    name: "",
    total_amount: "",
    description: ""
  });

  // Fetch all financial data with proper error handling
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch all necessary data in parallel
      const [
        studentsRes, 
        feeStructuresRes, 
        paymentsRes, 
        receiptsRes,
        expensesRes, 
        categoriesRes, 
        staffRes, 
        payrollRes,
        salaryPaymentsRes, 
        budgetsRes, 
        reportsRes
      ] = await Promise.all([
        axios.get(`/api/students`, { params: { schoolId, includeUser: true, includeClass: true } }),
        axios.get(`/api/fee-structures`, { params: { schoolId, includeItems: true } }),
        axios.get(`/api/fee-payments`, { 
          params: { 
            schoolId,
            includeStudent: true,
            includeFeeItem: true,
            includeTerm: true,
            includeReceivedBy: true
          }
        }),
        axios.get(`/api/receipts`, { params: { schoolId, includeStudent: true } }),
        axios.get(`/api/expenses`, { 
          params: { 
            schoolId,
            includeCategory: true,
            includeRecordedBy: true,
            includeApprovedBy: true
          }
        }),
        axios.get(`/api/expense-categories`, { params: { schoolId } }),
        axios.get(`/api/teachers`, { 
          params: { 
            schoolId,
            includeUser: true,
            includePayroll: true
          }
        }),
        axios.get(`/api/payroll`, { params: { schoolId, includeStaff: true } }),
        axios.get(`/api/salary-payments`, { 
          params: { 
            schoolId,
            includePayroll: true,
            includeRecordedBy: true
          }
        }),
        axios.get(`/api/budgets`, { 
          params: { 
            schoolId,
            includeItems: true,
            includeAcademicYear: true,
            includeTerm: true
          }
        }),
        axios.get(`/api/financial-reports`, { params: { schoolId } })
      ]);
      
      // Set all data with proper null checks and array validation
      setStudents(Array.isArray(studentsRes?.data) ? studentsRes.data : []);
      setFeeStructures(Array.isArray(feeStructuresRes?.data) ? feeStructuresRes.data : []);
      setPayments(Array.isArray(paymentsRes?.data) ? paymentsRes.data : []);
      setReceipts(Array.isArray(receiptsRes?.data) ? receiptsRes.data : []);
      setExpenses(Array.isArray(expensesRes?.data) ? expensesRes.data : []);
      setExpenseCategories(Array.isArray(categoriesRes?.data) ? categoriesRes.data : []);
      setStaff(Array.isArray(staffRes?.data) ? staffRes.data : []);
      setPayroll(Array.isArray(payrollRes?.data) ? payrollRes.data : []);
      setSalaryPayments(Array.isArray(salaryPaymentsRes?.data) ? salaryPaymentsRes.data : []);
      setBudgets(Array.isArray(budgetsRes?.data) ? budgetsRes.data : []);
      setReports(Array.isArray(reportsRes?.data) ? reportsRes.data : []);
      
    } catch (err) {
      console.error('Failed to load financial data:', err);
      setError('Failed to load financial data');
      toast.error('Failed to load financial data');
      // Reset all states to empty arrays on error
      setStudents([]);
      setFeeStructures([]);
      setPayments([]);
      setReceipts([]);
      setExpenses([]);
      setExpenseCategories([]);
      setStaff([]);
      setPayroll([]);
      setSalaryPayments([]);
      setBudgets([]);
      setReports([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [schoolId]);

  // Calculate financial summaries with proper null checks
  const financialSummary = {
    totalFeeIncome: (payments || []).reduce((sum, p) => sum + (p?.amount || 0), 0),
    totalExpenses: (expenses || []).reduce((sum, e) => sum + (e?.amount || 0), 0),
    totalSalaries: (salaryPayments || []).reduce((sum, s) => sum + (s?.amount || 0), 0),
    netProfit: function() {
      return this.totalFeeIncome - this.totalExpenses - this.totalSalaries;
    }
  };

  // Handle fee payment submission with validation
  const handleFeePayment = async () => {
    try {
      if (!feePaymentForm.student_id || !feePaymentForm.amount || !feePaymentForm.payment_date) {
        toast.error("Please fill all required fields");
        return;
      }

      // Create payment and receipt
      await axios.post('/api/fee-payments', {
        ...feePaymentForm,
        school_id: schoolId,
        received_by: localStorage.getItem('userId'),
        status: 'completed'
      });

      await axios.post('/api/receipts', {
        school_id: schoolId,
        student_id: feePaymentForm.student_id,
        amount: feePaymentForm.amount,
        payment_date: feePaymentForm.payment_date,
        payment_method: feePaymentForm.payment_method,
        received_by: localStorage.getItem('userId'),
        transaction_reference: feePaymentForm.transaction_code,
        notes: `Payment for ${feePaymentForm.fee_item_id ? 'specific fee item' : 'general fees'}`
      });

      // Refresh data
      await fetchData();
      toast.success("Payment recorded and receipt generated successfully");
      
      // Reset form
      setFeePaymentForm({
        student_id: "",
        fee_item_id: "",
        term_id: "",
        amount: "",
        payment_date: new Date().toISOString().split('T')[0],
        payment_method: "MPesa",
        transaction_code: ""
      });

    } catch (err) {
      console.error('Failed to record payment:', err);
      toast.error('Failed to record payment');
    }
  };

  // Handle expense submission with validation
  const handleExpense = async () => {
    try {
      if (!expenseForm.category_id || !expenseForm.amount || !expenseForm.expense_date) {
        toast.error("Please fill all required fields");
        return;
      }

      await axios.post('/api/expenses', {
        ...expenseForm,
        school_id: schoolId,
        recorded_by: localStorage.getItem('userId'),
        status: 'Approved'
      });

      await fetchData();
      toast.success("Expense recorded successfully");
      
      setExpenseForm({
        category_id: "",
        amount: "",
        expense_date: new Date().toISOString().split('T')[0],
        description: "",
        payment_method: "Bank",
        reference_number: ""
      });

    } catch (err) {
      console.error('Failed to record expense:', err);
      toast.error('Failed to record expense');
    }
  };

  // Handle payroll submission with validation
  const handlePayroll = async () => {
    try {
      if (!payrollForm.staff_id || !payrollForm.basic_salary) {
        toast.error("Please fill all required fields");
        return;
      }

      await axios.post('/api/payroll', {
        ...payrollForm,
        school_id: schoolId
      });

      await fetchData();
      toast.success("Payroll record added successfully");
      
      setPayrollForm({
        staff_id: "",
        basic_salary: "",
        house_allowance: "0",
        medical_allowance: "0",
        transport_allowance: "0",
        other_allowance: "0",
        nhif_deduction: "0",
        nssf_deduction: "0",
        paye_deduction: "0",
        other_deductions: "0",
        bank_name: "",
        bank_account: "",
        payment_method: "Bank"
      });

    } catch (err) {
      console.error('Failed to add payroll record:', err);
      toast.error('Failed to add payroll record');
    }
  };

  // Handle budget submission with validation
  const handleBudget = async () => {
    try {
      if (!budgetForm.academic_year_id || !budgetForm.name || !budgetForm.total_amount) {
        toast.error("Please fill all required fields");
        return;
      }

      await axios.post('/api/budgets', {
        ...budgetForm,
        school_id: schoolId,
        created_by: localStorage.getItem('userId'),
        status: 'Draft'
      });

      await fetchData();
      toast.success("Budget created successfully");
      
      setBudgetForm({
        academic_year_id: "",
        term_id: "",
        name: "",
        total_amount: "",
        description: ""
      });

    } catch (err) {
      console.error('Failed to create budget:', err);
      toast.error('Failed to create budget');
    }
  };

  // Generate financial report with validation
  const generateReport = async (reportType) => {
    try {
      if (!reportPeriod.start || !reportPeriod.end) {
        toast.error("Please select report period");
        return;
      }

      await axios.post('/api/financial-reports', {
        school_id: schoolId,
        report_type: reportType,
        period_start: reportPeriod.start,
        period_end: reportPeriod.end,
        generated_by: localStorage.getItem('userId')
      });

      await fetchData();
      toast.success(`${reportType} report generated successfully`);
      
    } catch (err) {
      console.error('Failed to generate report:', err);
      toast.error('Failed to generate report');
    }
  };

  // Calculate student fee stats with proper null checks
  const calculateStudentFeeStats = (studentId) => {
    if (!studentId || !Array.isArray(payments) || !Array.isArray(feeStructures)) {
      return { totalExpected: 0, totalPaid: 0, balance: 0, fullyPaid: false };
    }

    const studentPayments = payments.filter(p => p.student_id === studentId);
    const totalPaid = studentPayments.reduce((sum, p) => sum + (p?.amount || 0), 0);
    
    const feeItems = feeStructures.flatMap(s => 
      (s.fee_items || []).filter(i => !s.class_id || s.class_id === student.class_id)
    );
    
    const totalExpected = feeItems.reduce((sum, i) => sum + (i?.amount || 0), 0);
    const balance = totalExpected - totalPaid;
    
    return { 
      totalExpected, 
      totalPaid, 
      balance,
      fullyPaid: balance <= 0
    };
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <FaSpinner className="animate-spin text-4xl text-blue-500" />
        <span className="ml-2">Loading financial data...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-64 text-red-500">
        <div>{error}</div>
        <button 
          onClick={fetchData}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-blue-600 flex items-center gap-2">
        <FaMoneyBillWave className="text-blue-500" /> School Financial Management System
      </h1>

      {/* Financial Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Fee Income</p>
              <p className="text-2xl font-bold text-green-600">
                KSh {financialSummary.totalFeeIncome.toLocaleString()}
              </p>
            </div>
            <FaMoneyCheckAlt className="text-green-500 text-3xl" />
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow border border-red-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Expenses</p>
              <p className="text-2xl font-bold text-red-600">
                KSh {financialSummary.totalExpenses.toLocaleString()}
              </p>
            </div>
            <FaFileInvoiceDollar className="text-red-500 text-3xl" />
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Salary Payments</p>
              <p className="text-2xl font-bold text-purple-600">
                KSh {financialSummary.totalSalaries.toLocaleString()}
              </p>
            </div>
            <FaUserTie className="text-purple-500 text-3xl" />
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Net Balance</p>
              <p className={`text-2xl font-bold ${
                financialSummary.netProfit() >= 0 ? 'text-blue-600' : 'text-orange-600'
              }`}>
                KSh {financialSummary.netProfit().toLocaleString()}
              </p>
            </div>
            <FaBalanceScale className="text-blue-500 text-3xl" />
          </div>
        </div>
      </div>

      {/* Main Tabs */}
      <Tabs selectedIndex={activeTab} onSelect={index => setActiveTab(index)}>
        <TabList className="flex bg-white rounded-t-lg shadow">
          <Tab className="px-4 py-2 cursor-pointer focus:outline-none border-b-2 border-transparent hover:border-blue-500">
            <div className="flex items-center gap-2">
              <FaMoneyCheckAlt /> Fee Management
            </div>
          </Tab>
          <Tab className="px-4 py-2 cursor-pointer focus:outline-none border-b-2 border-transparent hover:border-blue-500">
            <div className="flex items-center gap-2">
              <FaFileInvoiceDollar /> Expenses
            </div>
          </Tab>
          <Tab className="px-4 py-2 cursor-pointer focus:outline-none border-b-2 border-transparent hover:border-blue-500">
            <div className="flex items-center gap-2">
              <FaUserTie /> Payroll
            </div>
          </Tab>
          <Tab className="px-4 py-2 cursor-pointer focus:outline-none border-b-2 border-transparent hover:border-blue-500">
            <div className="flex items-center gap-2">
              <FaChartPie /> Budgets
            </div>
          </Tab>
          <Tab className="px-4 py-2 cursor-pointer focus:outline-none border-b-2 border-transparent hover:border-blue-500">
            <div className="flex items-center gap-2">
              <FaChartBar /> Reports
            </div>
          </Tab>
        </TabList>

        {/* Fee Management Tab */}
        <TabPanel>
          <div className="p-6 bg-white rounded-b-lg shadow-lg border border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Fee Payment Form */}
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <FaPlus className="text-blue-500" /> Record Fee Payment
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Student*</label>
                    <select
                      value={feePaymentForm.student_id}
                      onChange={(e) => setFeePaymentForm({...feePaymentForm, student_id: e.target.value})}
                      className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                      required
                    >
                      <option value="">Select Student</option>
                      {students.map(student => (
                        <option key={student.id} value={student.id}>
                          {student.user?.first_name} {student.user?.last_name} ({student.admission_number})
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Amount*</label>
                    <input
                      type="number"
                      value={feePaymentForm.amount}
                      onChange={(e) => setFeePaymentForm({...feePaymentForm, amount: e.target.value})}
                      className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Payment Date*</label>
                    <input
                      type="date"
                      value={feePaymentForm.payment_date}
                      onChange={(e) => setFeePaymentForm({...feePaymentForm, payment_date: e.target.value})}
                      className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Payment Method*</label>
                    <select
                      value={feePaymentForm.payment_method}
                      onChange={(e) => setFeePaymentForm({...feePaymentForm, payment_method: e.target.value})}
                      className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                      required
                    >
                      <option value="MPesa">MPesa</option>
                      <option value="Cash">Cash</option>
                      <option value="Bank">Bank Transfer</option>
                      <option value="Cheque">Cheque</option>
                    </select>
                  </div>
                  
                  <button
                    onClick={handleFeePayment}
                    className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 flex items-center justify-center gap-2"
                  >
                    <FaMoneyCheckAlt /> Record Payment
                  </button>
                </div>
              </div>
              
              {/* Recent Payments */}
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <FaReceipt className="text-green-500" /> Recent Payments
                </h2>
                <div className="overflow-y-auto max-h-96">
                  {payments.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">No recent payments found</p>
                  ) : (
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Student</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {payments.slice(0, 5).map(payment => (
                          <tr key={payment.id}>
                            <td className="px-4 py-2 whitespace-nowrap">
                              {payment.student?.user?.first_name} {payment.student?.user?.last_name}
                            </td>
                            <td className="px-4 py-2 whitespace-nowrap">
                              KSh {payment.amount?.toLocaleString()}
                            </td>
                            <td className="px-4 py-2 whitespace-nowrap">
                              {new Date(payment.payment_date).toLocaleDateString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            </div>
            
            {/* Fee Balances Table */}
            <div className="mt-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <FaUserGraduate className="text-purple-500" /> Student Fee Balances
              </h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Student</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Class</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Expected</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Paid</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Balance</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {students.map(student => {
                      const stats = calculateStudentFeeStats(student.id);
                      return (
                        <tr key={student.id}>
                          <td className="px-4 py-2 whitespace-nowrap">
                            {student.user?.first_name} {student.user?.last_name}
                          </td>
                          <td className="px-4 py-2 whitespace-nowrap">
                            {student.class?.name || 'N/A'}
                          </td>
                          <td className="px-4 py-2 whitespace-nowrap">
                            KSh {stats.totalExpected.toLocaleString()}
                          </td>
                          <td className="px-4 py-2 whitespace-nowrap">
                            KSh {stats.totalPaid.toLocaleString()}
                          </td>
                          <td className="px-4 py-2 whitespace-nowrap">
                            KSh {stats.balance.toLocaleString()}
                          </td>
                          <td className="px-4 py-2 whitespace-nowrap">
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              stats.fullyPaid ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {stats.fullyPaid ? 'Paid' : 'Pending'}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </TabPanel>

        {/* Expenses Tab */}
        <TabPanel>
          <div className="p-6 bg-white rounded-b-lg shadow-lg border border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Expense Form */}
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <FaPlus className="text-blue-500" /> Record Expense
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Category*</label>
                    <select
                      value={expenseForm.category_id}
                      onChange={(e) => setExpenseForm({...expenseForm, category_id: e.target.value})}
                      className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                      required
                    >
                      <option value="">Select Category</option>
                      {expenseCategories.map(category => (
                        <option key={category.id} value={category.id}>{category.name}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Amount*</label>
                    <input
                      type="number"
                      value={expenseForm.amount}
                      onChange={(e) => setExpenseForm({...expenseForm, amount: e.target.value})}
                      className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Date*</label>
                    <input
                      type="date"
                      value={expenseForm.expense_date}
                      onChange={(e) => setExpenseForm({...expenseForm, expense_date: e.target.value})}
                      className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea
                      value={expenseForm.description}
                      onChange={(e) => setExpenseForm({...expenseForm, description: e.target.value})}
                      className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                      rows="2"
                    />
                  </div>
                  
                  <button
                    onClick={handleExpense}
                    className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 flex items-center justify-center gap-2"
                  >
                    <FaFileInvoiceDollar /> Record Expense
                  </button>
                </div>
              </div>
              
              {/* Recent Expenses */}
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <FaFileInvoiceDollar className="text-red-500" /> Recent Expenses
                </h2>
                <div className="overflow-y-auto max-h-96">
                  {expenses.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">No recent expenses found</p>
                  ) : (
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {expenses.slice(0, 5).map(expense => (
                          <tr key={expense.id}>
                            <td className="px-4 py-2 whitespace-nowrap">
                              {expense.category?.name}
                            </td>
                            <td className="px-4 py-2 whitespace-nowrap">
                              KSh {expense.amount?.toLocaleString()}
                            </td>
                            <td className="px-4 py-2 whitespace-nowrap">
                              {new Date(expense.expense_date).toLocaleDateString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            </div>
            
            {/* All Expenses Table */}
            <div className="mt-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <FaFileInvoiceDollar className="text-red-500" /> All Expenses
              </h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Method</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Reference</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {expenses.map(expense => (
                      <tr key={expense.id}>
                        <td className="px-4 py-2 whitespace-nowrap">
                          {new Date(expense.expense_date).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap">
                          {expense.category?.name}
                        </td>
                        <td className="px-4 py-2">
                          {expense.description}
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap">
                          KSh {expense.amount?.toLocaleString()}
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap capitalize">
                          {expense.payment_method}
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap">
                          {expense.reference_number || 'N/A'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </TabPanel>

        {/* Payroll Tab */}
        <TabPanel>
          <div className="p-6 bg-white rounded-b-lg shadow-lg border border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Payroll Form */}
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <FaPlus className="text-blue-500" /> Add Payroll Record
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Staff Member*</label>
                    <select
                      value={payrollForm.staff_id}
                      onChange={(e) => setPayrollForm({...payrollForm, staff_id: e.target.value})}
                      className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                      required
                    >
                      <option value="">Select Staff</option>
                      {staff.map(teacher => (
                        <option key={teacher.id} value={teacher.id}>
                          {teacher.user?.first_name} {teacher.user?.last_name}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Basic Salary*</label>
                    <input
                      type="number"
                      value={payrollForm.basic_salary}
                      onChange={(e) => setPayrollForm({...payrollForm, basic_salary: e.target.value})}
                      className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">House Allowance</label>
                      <input
                        type="number"
                        value={payrollForm.house_allowance}
                        onChange={(e) => setPayrollForm({...payrollForm, house_allowance: e.target.value})}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Medical Allowance</label>
                      <input
                        type="number"
                        value={payrollForm.medical_allowance}
                        onChange={(e) => setPayrollForm({...payrollForm, medical_allowance: e.target.value})}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">NHIF Deduction</label>
                      <input
                        type="number"
                        value={payrollForm.nhif_deduction}
                        onChange={(e) => setPayrollForm({...payrollForm, nhif_deduction: e.target.value})}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">NSSF Deduction</label>
                      <input
                        type="number"
                        value={payrollForm.nssf_deduction}
                        onChange={(e) => setPayrollForm({...payrollForm, nssf_deduction: e.target.value})}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                      />
                    </div>
                  </div>
                  
                  <button
                    onClick={handlePayroll}
                    className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 flex items-center justify-center gap-2"
                  >
                    <FaUserTie /> Save Payroll
                  </button>
                </div>
              </div>
              
              {/* Recent Salary Payments */}
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <FaCashRegister className="text-purple-500" /> Recent Salary Payments
                </h2>
                <div className="overflow-y-auto max-h-96">
                  {salaryPayments.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">No recent salary payments found</p>
                  ) : (
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Staff</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Month</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {salaryPayments.slice(0, 5).map(payment => (
                          <tr key={payment.id}>
                            <td className="px-4 py-2 whitespace-nowrap">
                              {payment.payroll?.staff?.user?.first_name} {payment.payroll?.staff?.user?.last_name}
                            </td>
                            <td className="px-4 py-2 whitespace-nowrap">
                              {new Date(payment.month).toLocaleDateString('default', { month: 'long', year: 'numeric' })}
                            </td>
                            <td className="px-4 py-2 whitespace-nowrap">
                              KSh {payment.amount?.toLocaleString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            </div>
            
            {/* Payroll Records Table */}
            <div className="mt-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <FaUserTie className="text-purple-500" /> Payroll Records
              </h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Staff</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Basic Salary</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Allowances</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Deductions</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Net Salary</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {payroll.map(record => (
                      <tr key={record.id}>
                        <td className="px-4 py-2 whitespace-nowrap">
                          {record.staff?.user?.first_name} {record.staff?.user?.last_name}
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap">
                          KSh {record.basic_salary?.toLocaleString()}
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap">
                          KSh {(
                            (record.house_allowance || 0) + 
                            (record.medical_allowance || 0) + 
                            (record.transport_allowance || 0) + 
                            (record.other_allowance || 0)
                          ).toLocaleString()}
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap">
                          KSh {(
                            (record.nhif_deduction || 0) + 
                            (record.nssf_deduction || 0) + 
                            (record.paye_deduction || 0) + 
                            (record.other_deductions || 0)
                          ).toLocaleString()}
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap font-semibold">
                          KSh {record.net_salary?.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </TabPanel>

        {/* Budgets Tab */}
        <TabPanel>
          <div className="p-6 bg-white rounded-b-lg shadow-lg border border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Budget Form */}
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <FaPlus className="text-blue-500" /> Create Budget
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Academic Year*</label>
                    <select
                      value={budgetForm.academic_year_id}
                      onChange={(e) => setBudgetForm({...budgetForm, academic_year_id: e.target.value})}
                      className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                      required
                    >
                      <option value="">Select Academic Year</option>
                      {/* Assuming you have academic years data */}
                      <option value="1">2023-2024</option>
                      <option value="2">2024-2025</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Term</label>
                    <select
                      value={budgetForm.term_id}
                      onChange={(e) => setBudgetForm({...budgetForm, term_id: e.target.value})}
                      className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                    >
                      <option value="">All Terms</option>
                      <option value="1">Term 1</option>
                      <option value="2">Term 2</option>
                      <option value="3">Term 3</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Budget Name*</label>
                    <input
                      type="text"
                      value={budgetForm.name}
                      onChange={(e) => setBudgetForm({...budgetForm, name: e.target.value})}
                      className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Total Amount*</label>
                    <input
                      type="number"
                      value={budgetForm.total_amount}
                      onChange={(e) => setBudgetForm({...budgetForm, total_amount: e.target.value})}
                      className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea
                      value={budgetForm.description}
                      onChange={(e) => setBudgetForm({...budgetForm, description: e.target.value})}
                      className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                      rows="3"
                    />
                  </div>
                  
                  <button
                    onClick={handleBudget}
                    className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 flex items-center justify-center gap-2"
                  >
                    <FaChartPie /> Create Budget
                  </button>
                </div>
              </div>
              
              {/* Budget Summary */}
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <FaChartPie className="text-green-500" /> Budget Summary
                </h2>
                <div className="space-y-4">
                  {budgets.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">No budgets created yet</p>
                  ) : (
                    <div className="space-y-4">
                      {budgets.map(budget => (
                        <div key={budget.id} className="border-b pb-4">
                          <h3 className="font-medium">{budget.name}</h3>
                          <p className="text-sm text-gray-600">
                            {budget.academic_year?.year} • {budget.term?.name || 'All Terms'}
                          </p>
                          <div className="flex justify-between mt-2">
                            <span className="text-sm">Total Budget:</span>
                            <span className="font-semibold">KSh {budget.total_amount?.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Status:</span>
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              budget.status === 'Approved' ? 'bg-green-100 text-green-800' :
                              budget.status === 'Draft' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {budget.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Budget Details Table */}
            <div className="mt-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <FaChartPie className="text-green-500" /> Budget Details
              </h2>
              <div className="overflow-x-auto">
                {budgets.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">No budgets available</p>
                ) : (
                  budgets.map(budget => (
                    <div key={budget.id} className="mb-8">
                      <h3 className="text-md font-semibold mb-2">
                        {budget.name} ({budget.academic_year?.year} • {budget.term?.name || 'All Terms'})
                        <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                          budget.status === 'Approved' ? 'bg-green-100 text-green-800' :
                          budget.status === 'Draft' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {budget.status}
                        </span>
                      </h3>
                      <table className="min-w-full divide-y divide-gray-200 mb-4">
                        <thead className="bg-gray-100">
                          <tr>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {budget.budget_items?.length > 0 ? (
                            budget.budget_items.map(item => (
                              <tr key={item.id}>
                                <td className="px-4 py-2 whitespace-nowrap">
                                  {item.category?.name}
                                </td>
                                <td className="px-4 py-2 whitespace-nowrap">
                                  KSh {item.amount?.toLocaleString()}
                                </td>
                                <td className="px-4 py-2">
                                  {item.description}
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan="3" className="px-4 py-2 text-center text-gray-500">
                                No items in this budget
                              </td>
                            </tr>
                          )}
                        </tbody>
                        <tfoot className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                              KSh {budget.total_amount?.toLocaleString()}
                            </th>
                            <th></th>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </TabPanel>

        {/* Reports Tab */}
        <TabPanel>
          <div className="p-6 bg-white rounded-b-lg shadow-lg border border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Report Period Selection */}
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <FaCalendarAlt className="text-blue-500" /> Select Report Period
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Start Date*</label>
                    <input
                      type="date"
                      value={reportPeriod.start}
                      onChange={(e) => setReportPeriod({...reportPeriod, start: e.target.value})}
                      className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">End Date*</label>
                    <input
                      type="date"
                      value={reportPeriod.end}
                      onChange={(e) => setReportPeriod({...reportPeriod, end: e.target.value})}
                      className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                      required
                    />
                  </div>
                </div>
              </div>
              
              {/* Report Actions */}
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <FaChartLine className="text-green-500" /> Generate Reports
                </h2>
                <div className="grid grid-cols-1 gap-3">
                  <button
                    onClick={() => generateReport('Income Statement')}
                    className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 flex items-center justify-center gap-2"
                  >
                    <FaFilePdf /> Income Statement
                  </button>
                  
                  <button
                    onClick={() => generateReport('Fee Collection')}
                    className="w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 flex items-center justify-center gap-2"
                  >
                    <FaFileExcel /> Fee Collection Report
                  </button>
                  
                  <button
                    onClick={() => generateReport('Expense')}
                    className="w-full bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 flex items-center justify-center gap-2"
                  >
                    <FaFileCsv /> Expense Report
                  </button>
                  
                  <button
                    onClick={() => generateReport('Payroll')}
                    className="w-full bg-purple-500 text-white py-2 px-4 rounded-md hover:bg-purple-600 flex items-center justify-center gap-2"
                  >
                    <FaUsers /> Payroll Report
                  </button>
                </div>
              </div>
            </div>
            
            {/* Generated Reports */}
            <div>
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <FaChartBar className="text-purple-500" /> Generated Reports
              </h2>
              {reports.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No reports generated yet</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Report Type</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Period</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Generated On</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Generated By</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {reports.map(report => (
                        <tr key={report.id}>
                          <td className="px-4 py-2 whitespace-nowrap">
                            {report.report_type}
                          </td>
                          <td className="px-4 py-2 whitespace-nowrap">
                            {new Date(report.period_start).toLocaleDateString()} - {new Date(report.period_end).toLocaleDateString()}
                          </td>
                          <td className="px-4 py-2 whitespace-nowrap">
                            {new Date(report.generated_at).toLocaleString()}
                          </td>
                          <td className="px-4 py-2 whitespace-nowrap">
                            {report.generated_by_user?.first_name} {report.generated_by_user?.last_name}
                          </td>
                          <td className="px-4 py-2 whitespace-nowrap">
                            <button className="text-blue-500 hover:text-blue-700 mr-2">
                              <FaEye />
                            </button>
                            <button className="text-green-500 hover:text-green-700 mr-2">
                              <FaFilePdf />
                            </button>
                            <button className="text-purple-500 hover:text-purple-700">
                              <FaFileExcel />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </TabPanel>
      </Tabs>
    </div>
  );
};

export default FinancialManagementSystem;