import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, Edit, Trash2, Calendar } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import ExpenseForm from '../components/ExpenseForm';
import ExpenseList from '../components/ExpenseList';

const Expenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [filters, setFilters] = useState({
    category: 'all',
    startDate: '',
    endDate: '',
    search: ''
  });
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    total: 0
  });

  const categories = [
    'Breakfast', 'Lunch', 'Dinner', 'Shopping', 'Travel',
    'Entertainment', 'Healthcare', 'Education', 'Utilities',
    'Transportation', 'Other'
  ];

  useEffect(() => {
    fetchExpenses();
  }, [filters, pagination.page]);

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: pagination.page,
        limit: 10,
        ...filters
      });

      const response = await axios.get(`/api/expenses?${params}`);
      setExpenses(response.data.expenses);
      setPagination({
        page: response.data.currentPage,
        totalPages: response.data.totalPages,
        total: response.data.total
      });
    } catch (error) {
      console.error('Error fetching expenses:', error);
      toast.error('Failed to load expenses');
    } finally {
      setLoading(false);
    }
  };

  const handleAddExpense = async (expenseData) => {
    try {
      const response = await axios.post('/api/expenses', expenseData);
      setExpenses([response.data, ...expenses]);
      setShowForm(false);
      toast.success('Expense added successfully');
    } catch (error) {
      console.error('Error adding expense:', error);
      toast.error('Failed to add expense');
    }
  };

  const handleUpdateExpense = async (id, expenseData) => {
    try {
      const response = await axios.put(`/api/expenses/${id}`, expenseData);
      setExpenses(expenses.map(expense => 
        expense._id === id ? response.data : expense
      ));
      setEditingExpense(null);
      toast.success('Expense updated successfully');
    } catch (error) {
      console.error('Error updating expense:', error);
      toast.error('Failed to update expense');
    }
  };

  const handleDeleteExpense = async (id) => {
    if (!window.confirm('Are you sure you want to delete this expense?')) {
      return;
    }

    try {
      await axios.delete(`/api/expenses/${id}`);
      setExpenses(expenses.filter(expense => expense._id !== id));
      toast.success('Expense deleted successfully');
    } catch (error) {
      console.error('Error deleting expense:', error);
      toast.error('Failed to delete expense');
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Expenses</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Manage your expense records
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="btn btn-primary btn-md flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Expense
        </button>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="card-content">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Search
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search expenses..."
                  className="input pl-10"
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Category
              </label>
              <select
                className="input"
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
              >
                <option value="all">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Start Date
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="date"
                  className="input pl-10"
                  value={filters.startDate}
                  onChange={(e) => handleFilterChange('startDate', e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                End Date
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="date"
                  className="input pl-10"
                  value={filters.endDate}
                  onChange={(e) => handleFilterChange('endDate', e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Expense List */}
      <div className="card">
        <div className="card-header">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Expense Records ({pagination.total})
          </h3>
        </div>
        <div className="card-content">
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            </div>
          ) : expenses.length > 0 ? (
            <ExpenseList
              expenses={expenses}
              onEdit={setEditingExpense}
              onDelete={handleDeleteExpense}
            />
          ) : (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              No expenses found. Add your first expense to get started.
            </div>
          )}
        </div>
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-700 dark:text-gray-300">
            Showing {((pagination.page - 1) * 10) + 1} to {Math.min(pagination.page * 10, pagination.total)} of {pagination.total} results
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
              className="btn btn-secondary btn-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span className="px-3 py-1 text-sm text-gray-700 dark:text-gray-300">
              Page {pagination.page} of {pagination.totalPages}
            </span>
            <button
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page === pagination.totalPages}
              className="btn btn-secondary btn-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Expense Form Modal */}
      {showForm && (
        <ExpenseForm
          onSubmit={handleAddExpense}
          onCancel={() => setShowForm(false)}
        />
      )}

      {/* Edit Expense Modal */}
      {editingExpense && (
        <ExpenseForm
          expense={editingExpense}
          onSubmit={(data) => handleUpdateExpense(editingExpense._id, data)}
          onCancel={() => setEditingExpense(null)}
        />
      )}
    </div>
  );
};

export default Expenses;
