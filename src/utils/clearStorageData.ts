/**
 * 清理旧的本地存储数据
 * 用于从旧的认证系统迁移到Firebase认证
 */
export const clearOldStorageData = () => {
  // 清理旧的认证token
  localStorage.removeItem('auth-token');
  
  // 清理旧的用户存储数据
  localStorage.removeItem('user-storage');
  
  // 清理可能的演示用户数据
  const keys = Object.keys(localStorage);
  keys.forEach(key => {
    if (key.startsWith('demo-') || key.includes('demo-user')) {
      localStorage.removeItem(key);
    }
  });
  
  console.log('已清理旧的本地存储数据');
};

/**
 * 检查是否需要清理旧数据
 */
export const shouldClearOldData = (): boolean => {
  return !!(localStorage.getItem('auth-token') || localStorage.getItem('user-storage'));
}; 