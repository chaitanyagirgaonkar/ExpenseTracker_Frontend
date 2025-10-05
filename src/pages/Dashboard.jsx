import React, { useState, useEffect } from 'react';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  PieChart,
  BarChart3,
  Calendar,
  AlertCircle
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { PieChart as RechartsPieChart, Cell, ResponsiveContainer } from 'recharts';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer as BarResponsiveContainer } from 'recharts';
import { LineChart, Line, ResponsiveContainer as LineResponsiveContainer } from 'recharts';

const Dashboard = () => {
  const [analytics, setAnalytics] = useState(null);
  const [budget, setBudget] = useState(null);
  const [udhariSummary, setUdhariSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [analyticsRes, budgetRes, udhariRes] = await Promise.all([
        axios.get('/api/expenses/analytics'),
        axios.get('/api/budget'),
        axios.get('/api/udhari/summary')
      ]);

      console.log('Analytics data:', analyticsRes.data);
      console.log('Monthly trend data:', analyticsRes.data?.monthlyTrend);
      
      // Transform monthly trend data to ensure proper format
      const transformedAnalytics = {
        ...analyticsRes.data,
        monthlyTrend: analyticsRes.data?.monthlyTrend?.map(item => ({
          ...item,
          _id: item._id || { year: new Date().getFullYear(), month: new Date().getMonth() + 1 },
          total: item.total || 0
        })) || []
      };
      
      setAnalytics(transformedAnalytics);
      setBudget(budgetRes.data);
      setUdhariSummary(udhariRes.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#84cc16', '#f97316'];

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
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Overview of your financial activity
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="card">
          <div className="card-content">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <DollarSign className="h-8 w-8 text-primary-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                    Total Spent
                  </dt>
                  <dd className="text-lg font-medium text-gray-900 dark:text-white">
                    ₹{analytics?.totalSpent?.toFixed(2) || '0.00'}
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
                <TrendingUp className="h-8 w-8 text-success-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                    Monthly Budget
                  </dt>
                  <dd className="text-lg font-medium text-gray-900 dark:text-white">
                    ₹{budget?.monthlyBudget?.toFixed(2) || '0.00'}
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
                <TrendingDown className="h-8 w-8 text-warning-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                    Savings
                  </dt>
                  <dd className={`text-lg font-medium ${budget?.savings >= 0 ? 'text-success-600' : 'text-danger-600'}`}>
                    ₹{budget?.savings?.toFixed(2) || '0.00'}
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
                <PieChart className="h-8 w-8 text-primary-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                    Highest Category
                  </dt>
                  <dd className="text-lg font-medium text-gray-900 dark:text-white">
                    {analytics?.highestCategory?._id || 'N/A'}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

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
                  <span>Spent: ₹{analytics?.totalSpent?.toFixed(2) || '0.00'}</span>
                  <span>Budget: ₹{budget.monthlyBudget?.toFixed(2) || '0.00'}</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
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

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Breakdown Pie Chart */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Category Breakdown</h3>
          </div>
          <div className="card-content">
            {analytics?.categoryBreakdown?.length > 0 ? (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart>
                    <RechartsPieChart
                      data={analytics.categoryBreakdown}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="total"
                    >
                      {analytics.categoryBreakdown.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </RechartsPieChart>
                    <Tooltip formatter={(value) => [`₹${value.toFixed(2)}`, 'Amount']} />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-64 flex items-center justify-center text-gray-500 dark:text-gray-400">
                No expense data available
              </div>
            )}
          </div>
        </div>

        {/* Monthly Trend Line Chart */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Monthly Trend</h3>
          </div>
          <div className="card-content">
            {analytics?.monthlyTrend?.length > 0 ? (
              <div className="h-64">
                <LineResponsiveContainer width="100%" height="100%">
                  <LineChart data={analytics.monthlyTrend}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="_id" 
                      tickFormatter={(value) => {
                        try {
                          if (value && typeof value === 'object') {
                            if (value.year && value.month) {
                              return `${value.year}-${value.month.toString().padStart(2, '0')}`;
                            }
                          }
                          return '';
                        } catch (error) {
                          console.error('Error formatting tick:', error);
                          return '';
                        }
                      }}
                    />
                    <YAxis />
                    <Tooltip 
                      formatter={(value) => [`₹${value?.toFixed(2) || '0.00'}`, 'Amount']}
                      labelFormatter={(value) => {
                        try {
                          if (value && typeof value === 'object' && value.year && value.month) {
                            return `${value.year}-${value.month.toString().padStart(2, '0')}`;
                          }
                          return '';
                        } catch (error) {
                          return '';
                        }
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="total" 
                      stroke="#3b82f6" 
                      strokeWidth={2}
                      dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                    />
                  </LineChart>
                </LineResponsiveContainer>
              </div>
            ) : (
              <div className="h-64 flex items-center justify-center text-gray-500 dark:text-gray-400">
                No trend data available
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Udhari Summary */}
      {udhariSummary && (udhariSummary.borrowTotal > 0 || udhariSummary.lendTotal > 0) && (
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Udhari Summary</h3>
          </div>
          <div className="card-content">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="text-center p-4 bg-success-50 dark:bg-success-900/20 rounded-lg">
                <div className="text-2xl font-bold text-success-600 dark:text-success-400">
                  ₹{udhariSummary.lendTotal.toFixed(2)}
                </div>
                <div className="text-sm text-success-600 dark:text-success-400">
                  You Lent ({udhariSummary.lendCount} records)
                </div>
              </div>
              <div className="text-center p-4 bg-warning-50 dark:bg-warning-900/20 rounded-lg">
                <div className="text-2xl font-bold text-warning-600 dark:text-warning-400">
                  ₹{udhariSummary.borrowTotal.toFixed(2)}
                </div>
                <div className="text-sm text-warning-600 dark:text-warning-400">
                  You Borrowed ({udhariSummary.borrowCount} records)
                </div>
              </div>
            </div>
            <div className="mt-4 text-center">
              <div className={`text-lg font-medium ${udhariSummary.netBalance >= 0 ? 'text-success-600' : 'text-danger-600'}`}>
                Net Balance: ₹{udhariSummary.netBalance.toFixed(2)}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
