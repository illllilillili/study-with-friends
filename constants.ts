import { BookOpen, Calculator, Languages, FlaskConical, History, Code } from 'lucide-react';
import { SubjectConfig, Friend } from './types';

export const SUBJECTS: SubjectConfig[] = [
  { id: 'korean', name: '국어', icon: BookOpen, color: 'bg-rose-100 text-rose-600' },
  { id: 'math', name: '수학', icon: Calculator, color: 'bg-blue-100 text-blue-600' },
  { id: 'english', name: '영어', icon: Languages, color: 'bg-yellow-100 text-yellow-600' },
  { id: 'science', name: '과학', icon: FlaskConical, color: 'bg-emerald-100 text-emerald-600' },
  { id: 'history', name: '한국사', icon: History, color: 'bg-amber-100 text-amber-600' },
  { id: 'coding', name: '코딩', icon: Code, color: 'bg-violet-100 text-violet-600' },
];

export const INITIAL_FRIENDS: Friend[] = [
  {
    id: '1',
    name: '김민수',
    avatar: 'https://picsum.photos/100/100?random=1',
    status: 'studying',
    currentSubject: 'math',
    studyData: {
      korean: 3600,
      math: 5400,
      english: 1800,
      science: 0,
      history: 0,
      coding: 7200
    }
  },
  {
    id: '2',
    name: '이영희',
    avatar: 'https://picsum.photos/100/100?random=2',
    status: 'offline',
    studyData: {
      korean: 7200,
      math: 3600,
      english: 5400,
      science: 2400,
      history: 1200,
      coding: 0
    }
  },
  {
    id: '3',
    name: '박지성',
    avatar: 'https://picsum.photos/100/100?random=3',
    status: 'online',
    studyData: {
      korean: 1200,
      math: 1200,
      english: 1200,
      science: 1200,
      history: 1200,
      coding: 1200
    }
  }
];