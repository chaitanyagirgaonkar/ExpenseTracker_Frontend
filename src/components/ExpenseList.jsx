import React from 'react';
import { Edit, Trash2, DollarSign, Calendar, Tag } from 'lucide-react';

const ExpenseList = ({ expenses, onEdit, onDelete }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Breakfast': 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400',
      'Lunch': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
      'Dinner': 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
      'Shopping': 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400',
      'Travel': 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
      'Entertainment': 'bg-pink-100 text-pink-800 dark:bg-pink-900/20 dark:text-pink-400',
      'Healthcare': 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
      'Education': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/20 dark:text-indigo-400',
      'Utilities': 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400',
      'Transportation': 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/20 dark:text-cyan-400',
      'Other': 'bg-slate-100 text-slate-800 dark:bg-slate-900/20 dark:text-slate-400'
    };
    return colors[category] || colors['Other'];
  };

  return (
    <div className="space-y-4">
      {expenses.map((expense) => (
        <div
          key={expense._id}
          className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition-shadow"
        >
          <div className="flex-1">
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <div className="h-10 w-10 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
                  <DollarSign className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(expense.category)}`}>
                    <Tag className="h-3 w-3 mr-1" />
                    {expense.category}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                    <Calendar className="h-3 w-3 mr-1" />
                    {formatDate(expense.date)}
                  </span>
                </div>
                <p className="text-sm text-gray-900 dark:text-white font-medium">
                  ₹{expense.amount.toFixed(2)}
                </p>
                {expense.description && (
                  <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                    {expense.description}
                  </p>
                )}
                <div className="flex items-center space-x-4 mt-1">
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    Payment: {expense.paymentMethod}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onEdit(expense)}
              className="p-2 text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
            >
              <Edit className="h-4 w-4" />
            </button>
            <button
              onClick={() => onDelete(expense._id)}
              className="p-2 text-gray-400 hover:text-danger-600 dark:hover:text-danger-400 transition-colors"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ExpenseList;
