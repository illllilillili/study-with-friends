import React from 'react';

export interface SubjectTime {
  [subjectName: string]: number; // Time in seconds
}

export interface Friend {
  id: string;
  name: string;
  avatar: string;
  status: 'online' | 'offline' | 'studying';
  currentSubject?: string;
  studyData: SubjectTime;
}

export interface SubjectConfig {
  id: string;
  name: string;
  icon: React.ElementType;
  color: string;
}