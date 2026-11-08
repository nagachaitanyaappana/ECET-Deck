export type UserRole = 'ADMIN' | 'STUDENT';

export interface User {
  id: string;
  email: string;
  displayName: string;
  role: UserRole;
}

export interface AuthResponse {
  accessToken: string;
  tokenType: string;
  userId: string;
  email: string;
  displayName: string;
  role: UserRole;
}

export interface AvailableTest {
  id: string;
  title: string;
  testType: 'GRAND' | 'DAILY';
  scheduledDate?: string;
  questionCount: number;
  durationMinutes: number;
  totalMarks: number;
}

export interface QuestionOption {
  id: string;
  label: string;
  text: string;
}

export interface TestQuestion {
  id: string;
  subject: 'DCME' | 'MATHEMATICS' | 'PHYSICS' | 'CHEMISTRY';
  questionOrder: number;
  questionText: string;
  options: QuestionOption[];
  selectedOptionId?: string | null;
}

export interface AttemptDetail {
  attemptId: string;
  status: 'IN_PROGRESS' | 'SUBMITTED' | 'TIMED_OUT';
  startedAt: string;
  questions: TestQuestion[];
}

export interface StudentResultSummary {
  attemptId: string;
  title: string;
  testType: 'GRAND' | 'DAILY';
  status: string;
  score: number;
  correct: number;
  incorrect: number;
  unanswered: number;
  startedAt: string;
  submittedAt: string;
  elapsedSeconds?: number;
}

export interface ReviewOption {
  id: string;
  label: string;
  text: string;
  correct: boolean;
}

export interface ReviewQuestion {
  questionId: string;
  questionOrder: number;
  subject: 'DCME' | 'MATHEMATICS' | 'PHYSICS' | 'CHEMISTRY';
  questionText: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  explanation: string;
  resultStatus: 'CORRECT' | 'INCORRECT' | 'UNANSWERED';
  isWrong: boolean;
  selectedOptionId?: string | null;
  selectedOptionLabel?: string | null;
  selectedOptionText?: string | null;
  correctOptionId: string;
  correctOptionLabel: string;
  correctOptionText: string;
  options: ReviewOption[];
}

export interface AttemptReview {
  attemptId: string;
  testId: string;
  testTitle: string;
  testType: 'GRAND' | 'DAILY';
  status: string;
  studentDisplayName: string;
  studentEmail?: string;
  score: number;
  totalMarks: number;
  correctCount: number;
  incorrectCount: number;
  unansweredCount: number;
  startedAt: string;
  submittedAt: string;
  elapsedSeconds?: number;
  totalQuestions: number;
  reviewedQuestionsCount: number;
  wrongOnlyFilter: boolean;
  questions: ReviewQuestion[];
}

export interface LeaderboardEntry {
  studentId: string;
  displayName: string;
  email: string;
  testsCompleted: number;
  totalScore: number;
  averageScore: number;
  totalCorrect: number;
  totalIncorrect: number;
}
