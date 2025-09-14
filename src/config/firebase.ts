import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';

// Firebase配置
const firebaseConfig = {
  apiKey: "AIzaSyA7G30-vOx39AXGQTIr534_gKCkqkSqdlg",
  authDomain: "lizhanbing.firebaseapp.com",
  projectId: "lizhanbing",
  storageBucket: "lizhanbing.firebasestorage.app",
  messagingSenderId: "135313998344",
  appId: "1:135313998344:web:8785249f7a44ded15807bd",
  measurementId: "G-ERY8P6NRFK"
};

// 初始化Firebase
const app = initializeApp(firebaseConfig);

// 初始化服务
export const auth = getAuth(app);
export const db = getFirestore(app);

// 开发环境连接模拟器（可选）
if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
  // 只在开发环境且在浏览器中运行时连接模拟器
  // 取消注释以下行来使用本地模拟器
  // connectAuthEmulator(auth, 'http://127.0.0.1:9099');
  // connectFirestoreEmulator(db, '127.0.0.1', 8080);
}

// Analytics（仅在生产环境）
export const analytics = process.env.NODE_ENV === 'production' ? getAnalytics(app) : null;

export default app; 