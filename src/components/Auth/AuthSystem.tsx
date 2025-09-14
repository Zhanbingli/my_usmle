import React, { useState } from 'react';
import { User, Lock, Mail, UserPlus, LogIn } from 'lucide-react';

interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: 'student' | 'resident' | 'doctor' | 'admin';
  specialty?: string;
  institution?: string;
  subscriptionTier: 'free' | 'basic' | 'professional' | 'enterprise';
  createdAt: string;
}

interface AuthState {
  user: UserProfile | null;
  isAuthenticated: boolean;
  loading: boolean;
}

export const AuthSystem: React.FC = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    loading: true
  });
  const [showLogin, setShowLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    role: 'student' as UserProfile['role'],
    specialty: '',
    institution: ''
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: 实现真实的登录逻辑
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        })
      });
      
      if (response.ok) {
        const userData = await response.json();
        setAuthState({
          user: userData.user,
          isAuthenticated: true,
          loading: false
        });
      }
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: 实现真实的注册逻辑
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (response.ok) {
        const userData = await response.json();
        setAuthState({
          user: userData.user,
          isAuthenticated: true,
          loading: false
        });
      }
    } catch (error) {
      console.error('Registration failed:', error);
    }
  };

  if (authState.loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (authState.isAuthenticated) {
    return (
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <User className="h-8 w-8 text-blue-600" />
                <div>
                  <p className="font-semibold text-gray-900">{authState.user?.name}</p>
                  <p className="text-sm text-gray-500">
                    {authState.user?.role} | {authState.user?.subscriptionTier}
                  </p>
                </div>
              </div>
            </div>
            <button
              onClick={() => setAuthState({ user: null, isAuthenticated: false, loading: false })}
              className="text-gray-500 hover:text-gray-700"
            >
              退出登录
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="bg-blue-600 p-3 rounded-full">
            <Lock className="h-8 w-8 text-white" />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          {showLogin ? '登录您的账户' : '创建新账户'}
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          专业医学AI助手，助力您的医学学习与临床决策
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form onSubmit={showLogin ? handleLogin : handleRegister} className="space-y-6">
            {!showLogin && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700">姓名</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="请输入您的姓名"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">身份</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value as UserProfile['role'] })}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="student">医学生</option>
                    <option value="resident">住院医师</option>
                    <option value="doctor">执业医师</option>
                    <option value="admin">管理员</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">专业/科室</label>
                  <input
                    type="text"
                    value={formData.specialty}
                    onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="如：内科、外科、儿科等"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">机构</label>
                  <input
                    type="text"
                    value={formData.institution}
                    onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="医院或医学院名称"
                  />
                </div>
              </>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700">邮箱</label>
              <div className="mt-1 relative">
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="block w-full border border-gray-300 rounded-md px-3 py-2 pl-10 shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="your.email@example.com"
                />
                <Mail className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">密码</label>
              <input
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="请输入密码"
              />
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {showLogin ? (
                  <>
                    <LogIn className="h-4 w-4 mr-2" />
                    登录
                  </>
                ) : (
                  <>
                    <UserPlus className="h-4 w-4 mr-2" />
                    注册
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="text-center">
              <button
                onClick={() => setShowLogin(!showLogin)}
                className="text-sm text-blue-600 hover:text-blue-500"
              >
                {showLogin ? '还没有账户？立即注册' : '已有账户？立即登录'}
              </button>
            </div>
          </div>

          {!showLogin && (
            <div className="mt-6 bg-blue-50 p-4 rounded-md">
              <h3 className="text-sm font-medium text-blue-800 mb-2">订阅计划</h3>
              <div className="space-y-2 text-sm text-blue-700">
                <p>• 免费版：每日5次AI咨询</p>
                <p>• 基础版：¥199/月，每日50次AI咨询</p>
                <p>• 专业版：¥399/月，无限AI咨询 + 高级功能</p>
                <p>• 企业版：定制方案，团队协作功能</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}; 
