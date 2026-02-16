import React from 'react';

export enum Role {
  USER = 'user',
  MODEL = 'model',
}

export type AppView = 'chat' | 'explorer' | 'learning' | 'quiz' | 'police_guide' | 'glossary' | 'civics' | 'drafting' | 'scotus' | 'state_laws' | 'founding_docs' | 'briefcase' | 'educator' | 'tribute' | 'jury' | 'deployment' | 'global_map' | 'debate_dojo' | 'legal_aid' | 'civil_rights';

export type TutorMode = 'standard' | 'socratic';

export interface GroundingSource {
  title: string;
  uri: string;
}

export interface Message {
  id: string;
  role: Role;
  content: string;
  isStreaming?: boolean;
  groundingSources?: GroundingSource[];
  timestamp: Date;
}

export interface ChatState {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
}

export interface LegalTopic {
  id: string;
  title: string;
  prompt: string;
  icon: React.ReactNode;
}

export interface LearningTopic {
  id: string;
  title: string;
  description: string;
  prompt: string;
  duration: string; // e.g. "5 min read"
}

export interface LearningModule {
  id: string;
  title: string;
  description: string;
  topics: LearningTopic[];
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswerIndex: number; // 0-3
  explanation: string;
  topic: string; // e.g., "Criminal Law"
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

export interface UserStats {
  xp: number;
  level: 'Law Student' | 'Associate' | 'Senior Counsel' | 'Partner';
  topicScores: Record<string, number>; // e.g. { "Criminal Law": 5, "Torts": -2 }
  questionsAnswered: number;
}

export interface GlossaryTerm {
  id: string;
  term: string;
  definition: string;
  category: 'Source of Law' | 'Concept' | 'Procedure' | 'People' | 'Civil Rights';
  prompt: string;
}

export interface DraftTemplate {
  id: string;
  title: string;
  description: string;
  prompt: string;
  difficulty: 'Beginner' | 'Intermediate';
}

export interface RecordType {
  id: string;
  title: string;
  description: string;
  prompt: string;
}

export interface ScotusCase {
  term: string;
  name: string;
  holding: string[];
  impact: string[];
  prompt: string;
}

export interface FoundingDoc {
  id: string;
  title: string;
  year: string;
  description: string;
  facts: string[];
  prompt: string;
}

export interface ConstitutionSection {
  id: string;
  title: string;
  subtitle?: string;
  content: string;
}

export interface Bookmark {
  id: string;
  type: 'case' | 'term' | 'statute' | 'doc';
  title: string;
  subtitle?: string;
  prompt: string; // The prompt to use when "Discussing" this item
  timestamp: number;
}

export interface LegalAidResource {
  name: string;
  description: string;
  url: string;
  category: 'National' | 'State' | 'Specialized';
}