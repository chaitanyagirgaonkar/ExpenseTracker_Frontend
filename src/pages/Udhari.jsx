import React, { useState, useEffect } from 'react';
import { Plus, Users, DollarSign, CheckCircle, AlertCircle, Edit, Trash2 } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import UdhariForm from '../components/UdhariForm';

const Udhari = () => {
  const [records, setRecords] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [filters, setFilters] = useState({
    type: 'all',
    status: 'all'
  });

  useEffect(() => {
    fetchRecords();
    fetchSummary();
  }, [filters]);

  const fetchRecords = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams(filters);
      const response = await axios.get(`/api/udhari?${params}`);
      setRecords(response.data.records);
    } catch (error) {
      console.error('Error fetching udhari records:', error);
      toast.error('Failed to load udhari records');
    } finally {
      setLoading(false);
    }
  };

  const fetchSummary = async () => {
    try {
      const response = await axios.get('/api/udhari/summary');
      setSummary(response.data);
    } catch (error) {
      console.error('Error fetching udhari summary:', error);
    }
  };

  const handleAddRecord = async (recordData) => {
    try {
      const response = await axios.post('/api/udhari', recordData);
      setRecords([response.data, ...records]);
      setShowForm(false);
      fetchSummary();
      toast.success('Udhari record added successfully');
    } catch (error) {
      console.error('Error adding udhari record:', error);
      toast.error('Failed to add udhari record');
    }
  };

  const handleUpdateRecord = async (id, recordData) => {
    try {
      const response = await axios.put(`/api/udhari/${id}`, recordData);
      setRecords(records.map(record => 
        record._id === id ? response.data : record
      ));
      setEditingRecord(null);
      fetchSummary();
      toast.success('Udhari record updated successfully');
    } catch (error) {
      console.error('Error updating udhari record:', error);
      toast.error('Failed to update udhari record');
    }
  };

  const handleDeleteRecord = async (id) => {
    if (!window.confirm('Are you sure you want to delete this record?')) {
      return;
    }

    try {
      await axios.delete(`/api/udhari/${id}`);
      setRecords(records.filter(record => record._id !== id));
      fetchSummary();
      toast.success('Udhari record deleted successfully');
    } catch (error) {
      console.error('Error deleting udhari record:', error);
      toast.error('Failed to delete udhari record');
    }
  };

  const handleSettleRecord = async (id) => {
    try {
      await axios.put(`/api/udhari/${id}/settle`);
      setRecords(records.map(record => 
        record._id === id ? { ...record, status: 'settled', settledDate: new Date() } : record
      ));
      fetchSummary();
      toast.success('Record marked as settled');
    } catch (error) {
      console.error('Error settling record:', error);
      toast.error('Failed to settle record');
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Udhari Tracker</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Track your borrow and lend transactions
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="btn btn-primary btn-md flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Record
        </button>
      </div>

      {/* Summary Cards */}
      {summary && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="card">
            <div className="card-content">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <DollarSign className="h-8 w-8 text-success-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                      You Lent
                    </dt>
                    <dd className="text-lg font-medium text-success-600">
                      ₹{summary.lendTotal?.toFixed(2) || '0.00'}
                    </dd>
                    <dd className="text-xs text-gray-500 dark:text-gray-400">
                      {summary.lendCount} records
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
                  <DollarSign className="h-8 w-8 text-warning-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                      You Borrowed
                    </dt>
                    <dd className="text-lg font-medium text-warning-600">
                      ₹{summary.borrowTotal?.toFixed(2) || '0.00'}
                    </dd>
                    <dd className="text-xs text-gray-500 dark:text-gray-400">
                      {summary.borrowCount} records
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
                  <DollarSign className={`h-8 w-8 ${summary.netBalance >= 0 ? 'text-success-600' : 'text-danger-600'}`} />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                      Net Balance
                    </dt>
                    <dd className={`text-lg font-medium ${summary.netBalance >= 0 ? 'text-success-600' : 'text-danger-600'}`}>
                      ₹{summary.netBalance?.toFixed(2) || '0.00'}
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
                  <Users className="h-8 w-8 text-primary-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                      Total Records
                    </dt>
                    <dd className="text-lg font-medium text-gray-900 dark:text-white">
                      {summary.borrowCount + summary.lendCount}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="card">
        <div className="card-content">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Type
              </label>
              <select
                className="input"
                value={filters.type}
                onChange={(e) => handleFilterChange('type', e.target.value)}
              >
                <option value="all">All Types</option>
                <option value="borrow">Borrow</option>
                <option value="lend">Lend</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Status
              </label>
              <select
                className="input"
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="settled">Settled</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Records List */}
      <div className="card">
        <div className="card-header">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Udhari Records ({records.length})
          </h3>
        </div>
        <div className="card-content">
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            </div>
          ) : records.length > 0 ? (
            <div className="space-y-4">
              {records.map((record) => (
                <div
                  key={record._id}
                  className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition-shadow"
                >
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                          record.type === 'lend' 
                            ? 'bg-success-100 dark:bg-success-900/20' 
                            : 'bg-warning-100 dark:bg-warning-900/20'
                        }`}>
                          <DollarSign className={`h-5 w-5 ${
                            record.type === 'lend' 
                              ? 'text-success-600 dark:text-success-400' 
                              : 'text-warning-600 dark:text-warning-400'
                          }`} />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            record.type === 'lend' 
                              ? 'bg-success-100 text-success-800 dark:bg-success-900/20 dark:text-success-400' 
                              : 'bg-warning-100 text-warning-800 dark:bg-warning-900/20 dark:text-warning-400'
                          }`}>
                            {record.type === 'lend' ? 'Lent' : 'Borrowed'}
                          </span>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            record.status === 'settled' 
                              ? 'bg-success-100 text-success-800 dark:bg-success-900/20 dark:text-success-400' 
                              : 'bg-warning-100 text-warning-800 dark:bg-warning-900/20 dark:text-warning-400'
                          }`}>
                            {record.status === 'settled' ? 'Settled' : 'Pending'}
                          </span>
                        </div>
                        <p className="text-sm text-gray-900 dark:text-white font-medium">
                          {record.personName} - ₹{record.amount.toFixed(2)}
                        </p>
                        {record.description && (
                          <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                            {record.description}
                          </p>
                        )}
                        <div className="flex items-center space-x-4 mt-1">
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            Date: {formatDate(record.date)}
                          </span>
                          {record.settledDate && (
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              Settled: {formatDate(record.settledDate)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {record.status === 'pending' && (
                      <button
                        onClick={() => handleSettleRecord(record._id)}
                        className="p-2 text-gray-400 hover:text-success-600 dark:hover:text-success-400 transition-colors"
                        title="Mark as settled"
                      >
                        <CheckCircle className="h-4 w-4" />
                      </button>
                    )}
                    <button
                      onClick={() => setEditingRecord(record)}
                      className="p-2 text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteRecord(record._id)}
                      className="p-2 text-gray-400 hover:text-danger-600 dark:hover:text-danger-400 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              No udhari records found. Add your first record to get started.
            </div>
          )}
        </div>
      </div>

      {/* Udhari Form Modal */}
      {showForm && (
        <UdhariForm
          onSubmit={handleAddRecord}
          onCancel={() => setShowForm(false)}
        />
      )}

      {/* Edit Udhari Modal */}
      {editingRecord && (
        <UdhariForm
          record={editingRecord}
          onSubmit={(data) => handleUpdateRecord(editingRecord._id, data)}
          onCancel={() => setEditingRecord(null)}
        />
      )}
    </div>
  );
};

export default Udhari;
