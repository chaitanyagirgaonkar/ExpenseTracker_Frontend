import React, { useState, useEffect } from 'react';
import { DollarSign, AlertCircle, TrendingUp, TrendingDown, Settings } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const Budget = () => {
  const [budget, setBudget] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    monthlyBudget: '',
    categoryBudgets: []
  });

  const categories = [
    'Breakfast', 'Lunch', 'Dinner', 'Shopping', 'Travel',
    'Entertainment', 'Healthcare', 'Education', 'Utilities',
    'Transportation', 'Other'
  ];

  useEffect(() => {
    fetchBudget();
  }, []);

  const fetchBudget = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/budget');
      setBudget(response.data);
    } catch (error) {
      console.error('Error fetching budget:', error);
      toast.error('Failed to load budget data');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const budgetData = {
        monthlyBudget: parseFloat(formData.monthlyBudget),
        categoryBudgets: formData.categoryBudgets.filter(cb => cb.amount > 0)
      };

      await axios.post('/api/budget', budgetData);
      await fetchBudget();
      setShowForm(false);
      setFormData({ monthlyBudget: '', categoryBudgets: [] });
      toast.success('Budget updated successfully');
    } catch (error) {
      console.error('Error updating budget:', error);
      toast.error('Failed to update budget');
    }
  };

  const handleCategoryBudgetChange = (category, amount) => {
    setFormData(prev => ({
      ...prev,
      categoryBudgets: prev.categoryBudgets.map(cb => 
        cb.category === category ? { ...cb, amount: parseFloat(amount) || 0 } : cb
      ).filter(cb => cb.amount > 0)
    }));
  };

  const addCategoryBudget = (category) => {
    if (!formData.categoryBudgets.find(cb => cb.category === category)) {
      setFormData(prev => ({
        ...prev,
        categoryBudgets: [...prev.categoryBudgets, { category, amount: 0 }]
      }));
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Budget Management</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Set and track your monthly budget
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="btn btn-primary btn-md flex items-center"
        >
          <Settings className="h-4 w-4 mr-2" />
          {budget ? 'Update Budget' : 'Set Budget'}
        </button>
      </div>

      {/* Budget Overview */}
      {budget && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="card">
            <div className="card-content">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <DollarSign className="h-8 w-8 text-primary-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                      Monthly Budget
                    </dt>
                    <dd className="text-lg font-medium text-gray-900 dark:text-white">
                      ₹{budget.monthlyBudget?.toFixed(2) || '0.00'}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-content">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <TrendingUp className="h-8 w-8 text-danger-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                      Total Spent
                    </dt>
                    <dd className="text-lg font-medium text-gray-900 dark:text-white">
                      ₹{budget.totalSpent?.toFixed(2) || '0.00'}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-content">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <TrendingDown className={`h-8 w-8 ${budget.savings >= 0 ? 'text-success-600' : 'text-danger-600'}`} />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                      Savings
                    </dt>
                    <dd className={`text-lg font-medium ${budget.savings >= 0 ? 'text-success-600' : 'text-danger-600'}`}>
                      ₹{budget.savings?.toFixed(2) || '0.00'}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Budget Progress */}
      {budget && (
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Budget Progress</h3>
          </div>
          <div className="card-content">
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
                  <span>Spent: ₹{budget.totalSpent?.toFixed(2) || '0.00'}</span>
                  <span>Budget: ₹{budget.monthlyBudget?.toFixed(2) || '0.00'}</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                  <div
                    className={`h-3 rounded-full ${
                      budget.budgetUtilization > 100 
                        ? 'bg-danger-500' 
                        : budget.budgetUtilization > 80 
                        ? 'bg-warning-500' 
                        : 'bg-success-500'
                    }`}
                    style={{ width: `${Math.min(budget.budgetUtilization, 100)}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                  <span>{budget.budgetUtilization?.toFixed(1)}% utilized</span>
                  {budget.budgetUtilization > 100 && (
                    <span className="text-danger-600 flex items-center">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      Over budget
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Category Budgets */}
      {budget?.categoryBudgets?.length > 0 && (
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Category Budgets</h3>
          </div>
          <div className="card-content">
            <div className="space-y-4">
              {budget.categoryBudgets.map((categoryBudget) => (
                <div key={categoryBudget.category} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium text-gray-900 dark:text-white">
                      {categoryBudget.category}
                    </span>
                    <span className="text-gray-600 dark:text-gray-400">
                      ₹{categoryBudget.amount?.toFixed(2) || '0.00'}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="h-2 rounded-full bg-primary-500"
                      style={{ width: '100%' }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Budget Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setShowForm(false)}></div>
            
            <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
              <div className="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                  {budget ? 'Update Budget' : 'Set Monthly Budget'}
                </h3>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Monthly Budget *
                    </label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        required
                        className="input pl-10"
                        placeholder="0.00"
                        value={formData.monthlyBudget}
                        onChange={(e) => setFormData(prev => ({ ...prev, monthlyBudget: e.target.value }))}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Category Budgets (Optional)
                    </label>
                    <div className="space-y-3">
                      {categories.map(category => (
                        <div key={category} className="flex items-center space-x-3">
                          <div className="flex-1">
                            <label className="block text-sm text-gray-600 dark:text-gray-400">
                              {category}
                            </label>
                          </div>
                          <div className="w-32">
                            <input
                              type="number"
                              step="0.01"
                              min="0"
                              className="input"
                              placeholder="0.00"
                              value={formData.categoryBudgets.find(cb => cb.category === category)?.amount || ''}
                              onChange={(e) => handleCategoryBudgetChange(category, e.target.value)}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowForm(false)}
                      className="btn btn-secondary btn-md"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn btn-primary btn-md"
                    >
                      {budget ? 'Update Budget' : 'Set Budget'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Budget;
