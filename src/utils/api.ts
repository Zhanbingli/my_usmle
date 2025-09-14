import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { getAuth } from 'firebase/auth';
import { ApiResponse } from '../types';

class ApiClient {
  private instance: AxiosInstance;

  constructor(baseURL?: string) {
    // 优先使用环境变量，其次使用相对路径（通过代理/重写）
    const defaultBaseURL = process.env.REACT_APP_API_BASE_URL || '/api';

    this.instance = axios.create({
      baseURL: baseURL || defaultBaseURL,
      timeout: 30000,  // 增加超时时间到30秒
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // 请求拦截器
    this.instance.interceptors.request.use(
      async (config) => {
        // 自动添加Firebase认证token
        try {
          const auth = getAuth();
          const user = auth.currentUser;
          if (user) {
            const token = await user.getIdToken();
            config.headers.Authorization = `Bearer ${token}`;
          }
        } catch (error) {
          console.error('Error getting auth token:', error);
        }
        
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // 响应拦截器
    this.instance.interceptors.response.use(
      (response: AxiosResponse<ApiResponse>) => {
        return response;
      },
      async (error) => {
        const originalRequest = error.config;
        
        // 如果是401错误且未重试过，尝试刷新token
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          
          try {
            const auth = getAuth();
            const user = auth.currentUser;
            if (user) {
              const newToken = await user.getIdToken(true); // 强制刷新token
              originalRequest.headers.Authorization = `Bearer ${newToken}`;
              return this.instance(originalRequest);
            }
          } catch (refreshError) {
            console.error('Token refresh failed:', refreshError);
            // 跳转到登录页面
            window.location.href = '/login';
            return Promise.reject(refreshError);
          }
        }
        
        // 全局错误处理
        console.error('API Error:', {
          message: error.message,
          url: error.config?.url,
          status: error.response?.status,
          data: error.response?.data
        });
        
        if (error.response?.status === 401 && originalRequest._retry) {
          // 认证失败，跳转到登录页
          window.location.href = '/login';
        }
        
        return Promise.reject(error);
      }
    );
  }

  async get<T = any>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    const response = await this.instance.get<ApiResponse<T>>(url, config);
    return response.data;
  }

  async post<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    const response = await this.instance.post<ApiResponse<T>>(url, data, config);
    return response.data;
  }

  async put<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    const response = await this.instance.put<ApiResponse<T>>(url, data, config);
    return response.data;
  }

  async patch<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    const response = await this.instance.patch<ApiResponse<T>>(url, data, config);
    return response.data;
  }

  async delete<T = any>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    const response = await this.instance.delete<ApiResponse<T>>(url, config);
    return response.data;
  }
}

// 创建默认实例
export const apiClient = new ApiClient();

// 导出类以便创建其他实例
export { ApiClient }; 
