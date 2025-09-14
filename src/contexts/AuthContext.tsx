import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User as FirebaseUser,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import { message } from 'antd';
import { clearOldStorageData, shouldClearOldData } from '../utils/clearStorageData';

// 用户信息接口
export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  role: 'student' | 'resident' | 'doctor' | 'admin';
  specialty?: string;
  institution?: string;
  graduationYear?: number;
  subscriptionTier: 'basic' | 'professional' | 'expert' | 'enterprise';
  createdAt: any;
  updatedAt: any;
  lastLoginAt: any;
}

// Auth Context接口
interface AuthContextType {
  currentUser: FirebaseUser | null;
  userProfile: UserProfile | null;
  loading: boolean;
  
  // 认证方法
  signup: (email: string, password: string, profile: Partial<UserProfile>) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateUserProfile: (updates: Partial<UserProfile>) => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  
  // 工具方法
  isLoggedIn: boolean;
  isAdmin: boolean;
  hasSubscription: (tier: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Google Auth Provider
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // 清理旧的存储数据（一次性迁移）
  useEffect(() => {
    if (shouldClearOldData()) {
      clearOldStorageData();
    }
  }, []);

  // 注册新用户
  const signup = async (email: string, password: string, profile: Partial<UserProfile>) => {
    try {
      const { user } = await createUserWithEmailAndPassword(auth, email, password);
      
      // 更新显示名称
      await updateProfile(user, {
        displayName: profile.displayName || email.split('@')[0]
      });

      // 创建用户档案
      const userProfileData: UserProfile = {
        uid: user.uid,
        email: user.email!,
        displayName: profile.displayName || email.split('@')[0],
        role: profile.role || 'student',
        specialty: profile.specialty,
        institution: profile.institution,
        graduationYear: profile.graduationYear,
        subscriptionTier: profile.subscriptionTier || 'basic',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        lastLoginAt: serverTimestamp()
      };

      await setDoc(doc(db, 'users', user.uid), userProfileData);
      setUserProfile(userProfileData);
      
      message.success('注册成功！');
    } catch (error: any) {
      console.error('注册失败:', error);
      message.error(getErrorMessage(error.code));
      throw error;
    }
  };

  // 登录
  const login = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      message.success('登录成功！');
    } catch (error: any) {
      console.error('登录失败:', error);
      message.error(getErrorMessage(error.code));
      throw error;
    }
  };

  // Google登录
  const loginWithGoogle = async () => {
    try {
      const { user } = await signInWithPopup(auth, googleProvider);
      
      // 检查用户是否已存在
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      
      if (!userDoc.exists()) {
        // 新用户，创建档案
        const userProfileData: UserProfile = {
          uid: user.uid,
          email: user.email!,
          displayName: user.displayName || user.email!.split('@')[0],
          role: 'student',
          subscriptionTier: 'basic',
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          lastLoginAt: serverTimestamp()
        };
        
        await setDoc(doc(db, 'users', user.uid), userProfileData);
        setUserProfile(userProfileData);
      } else {
        // 更新最后登录时间
        await setDoc(doc(db, 'users', user.uid), {
          lastLoginAt: serverTimestamp()
        }, { merge: true });
      }
      
      message.success('Google登录成功！');
    } catch (error: any) {
      console.error('Google登录失败:', error);
      message.error('Google登录失败，请稍后重试');
      throw error;
    }
  };

  // 登出
  const logout = async () => {
    try {
      await signOut(auth);
      setUserProfile(null);
      message.success('已安全退出');
    } catch (error: any) {
      console.error('登出失败:', error);
      message.error('登出失败，请稍后重试');
      throw error;
    }
  };

  // 重置密码
  const resetPassword = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email);
      message.success('密码重置邮件已发送！');
    } catch (error: any) {
      console.error('密码重置失败:', error);
      message.error(getErrorMessage(error.code));
      throw error;
    }
  };

  // 更新用户档案
  const updateUserProfile = async (updates: Partial<UserProfile>) => {
    if (!currentUser) throw new Error('用户未登录');
    
    try {
      const updatedProfile = {
        ...updates,
        updatedAt: serverTimestamp()
      };
      
      await setDoc(doc(db, 'users', currentUser.uid), updatedProfile, { merge: true });
      
      // 如果更新了显示名称，也更新Firebase Auth
      if (updates.displayName) {
        await updateProfile(currentUser, {
          displayName: updates.displayName
        });
      }
      
      // 更新本地状态
      setUserProfile(prev => prev ? { ...prev, ...updates } : null);
      message.success('档案更新成功！');
    } catch (error: any) {
      console.error('更新档案失败:', error);
      message.error('更新档案失败，请稍后重试');
      throw error;
    }
  };

  // 修改密码
  const changePassword = async (currentPassword: string, newPassword: string) => {
    if (!currentUser?.email) throw new Error('用户未登录');
    
    try {
      // 重新认证
      const credential = EmailAuthProvider.credential(currentUser.email, currentPassword);
      await reauthenticateWithCredential(currentUser, credential);
      
      // 更新密码
      await updatePassword(currentUser, newPassword);
      message.success('密码修改成功！');
    } catch (error: any) {
      console.error('密码修改失败:', error);
      message.error(getErrorMessage(error.code));
      throw error;
    }
  };

  // 获取用户档案
  const fetchUserProfile = async (uid: string) => {
    try {
      const userDoc = await getDoc(doc(db, 'users', uid));
      
      if (userDoc.exists()) {
        const profileData = userDoc.data() as UserProfile;
        setUserProfile(profileData);
        
        // 更新最后登录时间
        await setDoc(doc(db, 'users', uid), {
          lastLoginAt: serverTimestamp()
        }, { merge: true });
      } else {
        // 如果用户文档不存在，创建一个基本的档案
        const defaultProfile: UserProfile = {
          uid: uid,
          email: auth.currentUser?.email || '',
          displayName: auth.currentUser?.displayName || auth.currentUser?.email?.split('@')[0] || 'User',
          role: 'student',
          subscriptionTier: 'basic',
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          lastLoginAt: serverTimestamp()
        };
        
        await setDoc(doc(db, 'users', uid), defaultProfile);
        setUserProfile(defaultProfile);
      }
    } catch (error) {
      console.error('获取用户档案失败:', error);
    }
  };

  // 监听认证状态变化
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      
      if (user) {
        await fetchUserProfile(user.uid);
      } else {
        setUserProfile(null);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // 错误消息映射
  const getErrorMessage = (errorCode: string): string => {
    const errorMessages: Record<string, string> = {
      'auth/user-not-found': '用户不存在',
      'auth/wrong-password': '密码错误',
      'auth/email-already-in-use': '邮箱已被使用',
      'auth/weak-password': '密码强度不够',
      'auth/invalid-email': '邮箱格式无效',
      'auth/too-many-requests': '请求过于频繁，请稍后重试',
      'auth/network-request-failed': '网络连接失败',
      'auth/requires-recent-login': '需要重新登录',
      'auth/invalid-credential': '凭据无效'
    };
    
    return errorMessages[errorCode] || '操作失败，请稍后重试';
  };

  // 计算属性
  const isLoggedIn = !!currentUser;
  const isAdmin = userProfile?.role === 'admin';
  const hasSubscription = (tier: string) => {
    if (!userProfile) return false;
    const tiers = ['basic', 'professional', 'expert', 'enterprise'];
    const userTierIndex = tiers.indexOf(userProfile.subscriptionTier);
    const requiredTierIndex = tiers.indexOf(tier);
    return userTierIndex >= requiredTierIndex;
  };

  const value: AuthContextType = {
    currentUser,
    userProfile,
    loading,
    signup,
    login,
    logout,
    loginWithGoogle,
    resetPassword,
    updateUserProfile,
    changePassword,
    isLoggedIn,
    isAdmin,
    hasSubscription
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 