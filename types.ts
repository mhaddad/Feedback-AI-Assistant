export enum FeedbackModelType {
  SBI = 'SBI',
  PPP = '3P',
  STAR = 'STAR',
  CNV = 'CNV'
}

export interface FeedbackField {
  id: string;
  label: string;
  placeholder: string;
  description: string;
  isOptional?: boolean;
}

export interface FeedbackModelDef {
  type: FeedbackModelType;
  title: string;
  description: string;
  iconName: string;
  fields: FeedbackField[];
}

export interface FeedbackEntry {
  id: string;
  recipientName: string;
  authorName: string;
  relationship: string;
  modelType: FeedbackModelType;
  inputData: Record<string, string>;
  generatedText: string;
  createdAt: string; // ISO Date string
  updatedAt?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export type AppState = 'auth' | 'dashboard' | 'create' | 'review' | 'settings';
