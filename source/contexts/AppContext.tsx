import React, { createContext, useContext, useState, ReactNode } from 'react';

interface PatientInfo {
  name: string;
  age: string;
  email: string;
}

interface QuizAnswer {
  question: string;
  answer: boolean;
}

interface AnalysisResult {
  diagnosis: string;
  confidence: number;
  riskLevel: 'low' | 'moderate' | 'high';
  recommendations: string;
}

interface AppContextType {
  patientInfo: PatientInfo;
  setPatientInfo: (info: PatientInfo) => void;
  quizAnswers: QuizAnswer[];
  setQuizAnswers: (answers: QuizAnswer[]) => void;
  uploadedImage: File | null;
  setUploadedImage: (file: File | null) => void;
  analysisResult: AnalysisResult | null;
  setAnalysisResult: (result: AnalysisResult | null) => void;
  resetApp: () => void;
}

const defaultPatientInfo: PatientInfo = { name: '', age: '', email: '' };
const defaultQuizAnswers: QuizAnswer[] = [];

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [patientInfo, setPatientInfo] = useState<PatientInfo>(defaultPatientInfo);
  const [quizAnswers, setQuizAnswers] = useState<QuizAnswer[]>(defaultQuizAnswers);
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);

  const resetApp = () => {
    setPatientInfo(defaultPatientInfo);
    setQuizAnswers(defaultQuizAnswers);
    setUploadedImage(null);
    setAnalysisResult(null);
  };

  return (
    <AppContext.Provider
      value={{
        patientInfo,
        setPatientInfo,
        quizAnswers,
        setQuizAnswers,
        uploadedImage,
        setUploadedImage,
        analysisResult,
        setAnalysisResult,
        resetApp,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
