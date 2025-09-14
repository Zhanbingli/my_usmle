import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { 
  Users, DollarSign, TrendingUp, Activity, 
  MessageCircle, Award 
} from 'lucide-react';

interface AnalyticsData {
  userGrowth: Array<{ month: string; users: number; paid: number }>;
  revenueData: Array<{ month: string; revenue: number; mrr: number }>;
  userEngagement: Array<{ metric: string; value: number; change: number }>;
  subscriptionTiers: Array<{ name: string; value: number; color: string }>;
  aiUsage: Array<{ date: string; queries: number; accuracy: number }>;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

// Mock data - 在实际应用中应该从API获取
const MOCK_DATA: AnalyticsData = {
  userGrowth: [
    { month: '2024-01', users: 150, paid: 15 },
    { month: '2024-02', users: 280, paid: 42 },
    { month: '2024-03', users: 420, paid: 89 },
    { month: '2024-04', users: 650, paid: 156 },
    { month: '2024-05', users: 890, paid: 234 },
    { month: '2024-06', users: 1200, paid: 348 }
  ],
  revenueData: [
    { month: '2024-01', revenue: 2980, mrr: 2980 },
    { month: '2024-02', revenue: 8360, mrr: 8360 },
    { month: '2024-03', revenue: 17780, mrr: 17780 },
    { month: '2024-04', revenue: 31120, mrr: 31120 },
    { month: '2024-05', revenue: 46660, mrr: 46660 },
    { month: '2024-06', revenue: 69440, mrr: 69440 }
  ],
  userEngagement: [
    { metric: '日活跃用户', value: 342, change: 15.2 },
    { metric: '月留存率', value: 78.5, change: 5.3 },
    { metric: '平均会话时长', value: 12.4, change: -2.1 },
    { metric: 'AI咨询次数', value: 1547, change: 23.8 }
  ],
  subscriptionTiers: [
    { name: '免费版', value: 852, color: COLORS[0] },
    { name: '基础版', value: 234, color: COLORS[1] },
    { name: '专业版', value: 98, color: COLORS[2] },
    { name: '企业版', value: 16, color: COLORS[3] }
  ],
  aiUsage: [
    { date: '2024-06-01', queries: 234, accuracy: 89.2 },
    { date: '2024-06-02', queries: 267, accuracy: 91.1 },
    { date: '2024-06-03', queries: 298, accuracy: 88.7 },
    { date: '2024-06-04', queries: 312, accuracy: 92.3 },
    { date: '2024-06-05', queries: 345, accuracy: 90.8 },
    { date: '2024-06-06', queries: 378, accuracy: 93.1 },
    { date: '2024-06-07', queries: 398, accuracy: 91.5 }
  ]
};

export const UserAnalytics: React.FC = () => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [timeRange, setTimeRange] = useState('30d');
  const [loading, setLoading] = useState(true);

  

  useEffect(() => {
    // 模拟API调用
    setTimeout(() => {
      setAnalyticsData(MOCK_DATA);
      setLoading(false);
    }, 1000);
  }, [timeRange]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!analyticsData) return null;

  const MetricCard = ({ 
    title, 
    value, 
    change, 
    icon: Icon, 
    format = 'number' 
  }: {
    title: string;
    value: number;
    change: number;
    icon: any;
    format?: 'number' | 'currency' | 'percentage';
  }) => {
    const formatValue = (val: number) => {
      switch (format) {
        case 'currency':
          return `¥${val.toLocaleString()}`;
        case 'percentage':
          return `${val}%`;
        default:
          return val.toLocaleString();
      }
    };

    return (
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-2xl font-bold text-gray-900">{formatValue(value)}</p>
          </div>
          <Icon className="h-8 w-8 text-blue-600" />
        </div>
        <div className="mt-4 flex items-center">
          <span className={`text-sm font-medium ${
            change >= 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            {change >= 0 ? '+' : ''}{change}%
          </span>
          <span className="text-sm text-gray-500 ml-2">vs 上月</span>
        </div>
      </div>
    );
  };

  return (
    <div className="p-6 space-y-6">
      {/* 页面标题和时间范围选择 */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">数据分析仪表板</h1>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2 bg-white"
        >
          <option value="7d">最近7天</option>
          <option value="30d">最近30天</option>
          <option value="90d">最近90天</option>
          <option value="1y">最近1年</option>
        </select>
      </div>

      {/* 关键指标卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="总用户数"
          value={analyticsData.userGrowth[analyticsData.userGrowth.length - 1].users}
          change={15.2}
          icon={Users}
        />
        <MetricCard
          title="月收入 (MRR)"
          value={analyticsData.revenueData[analyticsData.revenueData.length - 1].mrr}
          change={23.8}
          icon={DollarSign}
          format="currency"
        />
        <MetricCard
          title="付费转化率"
          value={29.0}
          change={3.2}
          icon={TrendingUp}
          format="percentage"
        />
        <MetricCard
          title="今日AI咨询"
          value={1547}
          change={12.4}
          icon={MessageCircle}
        />
      </div>

      {/* 用户增长趋势 */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">用户增长趋势</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={analyticsData.userGrowth}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="users" 
              stroke="#8884d8" 
              name="总用户数"
              strokeWidth={2}
            />
            <Line 
              type="monotone" 
              dataKey="paid" 
              stroke="#82ca9d" 
              name="付费用户数"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 收入趋势 */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">收入趋势</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={analyticsData.revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value: number) => `¥${value.toLocaleString()}`} />
              <Bar dataKey="revenue" fill="#8884d8" name="月收入" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* 订阅分布 */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">订阅分布</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={analyticsData.subscriptionTiers}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }: { name: string; percent: number }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {analyticsData.subscriptionTiers.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 用户参与度指标 */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">用户参与度</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {analyticsData.userEngagement.map((metric, index) => (
            <div key={index} className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{metric.metric}</p>
                  <p className="text-xl font-bold text-gray-900">
                    {metric.metric.includes('率') || metric.metric.includes('时长') 
                      ? `${metric.value}${metric.metric.includes('时长') ? '分钟' : '%'}`
                      : metric.value.toLocaleString()
                    }
                  </p>
                </div>
                <span className={`text-sm font-medium ${
                  metric.change >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {metric.change >= 0 ? '+' : ''}{metric.change}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI使用情况 */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">AI咨询使用情况</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={analyticsData.aiUsage}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip />
            <Legend />
            <Bar yAxisId="left" dataKey="queries" fill="#8884d8" name="咨询次数" />
            <Line 
              yAxisId="right" 
              type="monotone" 
              dataKey="accuracy" 
              stroke="#ff7300" 
              name="准确率 (%)"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* 实时指标 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-lg text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">在线用户</p>
              <p className="text-2xl font-bold">89</p>
            </div>
            <Activity className="h-8 w-8 opacity-90" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 rounded-lg text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">今日注册</p>
              <p className="text-2xl font-bold">23</p>
            </div>
            <Users className="h-8 w-8 opacity-90" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-6 rounded-lg text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">客户满意度</p>
              <p className="text-2xl font-bold">4.8/5</p>
            </div>
            <Award className="h-8 w-8 opacity-90" />
          </div>
        </div>
      </div>

      {/* 导出和报告选项 */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">数据导出</h2>
        <div className="flex flex-wrap gap-4">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            导出用户数据
          </button>
          <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
            生成收入报告
          </button>
          <button className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700">
            AI使用分析
          </button>
          <button className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700">
            完整报表
          </button>
        </div>
      </div>
    </div>
  );
}; 
