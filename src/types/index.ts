// 用户相关类型
export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export enum UserRole {
  STUDENT = 'student',
  DOCTOR = 'doctor',
  TEACHER = 'teacher',
  ADMIN = 'admin'
}

// 病例相关类型
export interface Case {
  id: string;
  title: string;
  description: string;
  difficulty: Difficulty;
  specialty: Specialty;
  symptoms: string[];
  diagnosis: string[];
  treatment: string[];
  createdAt: string;
  updatedAt: string;
}

export enum Difficulty {
  BEGINNER = 'beginner',
  INTERMEDIATE = 'intermediate',
  ADVANCED = 'advanced'
}

export enum Specialty {
  INTERNAL_MEDICINE = 'internal_medicine',
  SURGERY = 'surgery',
  PEDIATRICS = 'pediatrics',
  CARDIOLOGY = 'cardiology',
  NEUROLOGY = 'neurology',
  PSYCHIATRY = 'psychiatry',
  EMERGENCY = 'emergency'
}

// AI问诊相关类型
export interface QuerySession {
  id: string;
  userId: string;
  title: string;
  messages: Message[];
  status: SessionStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: string;
}

export enum MessageRole {
  USER = 'user',
  ASSISTANT = 'assistant',
  SYSTEM = 'system'
}

export enum SessionStatus {
  ACTIVE = 'active',
  COMPLETED = 'completed',
  ARCHIVED = 'archived'
}

// PubMed相关类型
export interface Article {
  pmid: string;
  title: string;
  authors: string[];
  abstract: string;
  journal: string;
  publishDate: string;
  doi?: string;
  keywords: string[];
  url: string;
}

export interface SearchResult {
  query: string;
  totalCount: number;
  articles: Article[];
  page: number;
  pageSize: number;
}

// API响应类型
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// 通用UI状态类型
export interface LoadingState {
  isLoading: boolean;
  error: string | null;
}

// 分页类型
export interface PaginationParams {
  page: number;
  pageSize: number;
  total?: number;
}

// 表单状态类型
export interface FormState<T> {
  data: T;
  errors: Partial<Record<keyof T, string>>;
  isSubmitting: boolean;
  isDirty: boolean;
} 