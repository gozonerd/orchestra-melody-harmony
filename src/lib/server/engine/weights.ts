import type { TaskCategory } from './taskParser';

export interface BenchmarkWeights {
  coding: number;
  reasoning: number;
  math: number;
  chat: number;
  vision: number;
}

export const CATEGORY_WEIGHTS: Record<TaskCategory, BenchmarkWeights> = {
  coding: { coding: 0.4, reasoning: 0.25, math: 0.15, chat: 0.1, vision: 0.1 },
  writing: { coding: 0.05, reasoning: 0.2, math: 0.05, chat: 0.6, vision: 0.1 },
  analysis: { coding: 0.15, reasoning: 0.35, math: 0.25, chat: 0.15, vision: 0.1 },
  customer_support: { coding: 0.05, reasoning: 0.2, math: 0.05, chat: 0.6, vision: 0.1 },
  data_processing: { coding: 0.3, reasoning: 0.25, math: 0.2, chat: 0.15, vision: 0.1 },
  math: { coding: 0.1, reasoning: 0.25, math: 0.5, chat: 0.05, vision: 0.1 },
  creative: { coding: 0.05, reasoning: 0.2, math: 0.05, chat: 0.6, vision: 0.1 },
  general: { coding: 0.2, reasoning: 0.25, math: 0.15, chat: 0.3, vision: 0.1 }
};

const SUBTASK_KEYWORD_MAP: Record<TaskCategory, string[]> = {
  coding: [
    'code',
    'program',
    'debug',
    'function',
    'api',
    'endpoint',
    'script',
    'refactor',
    'compile',
    'deploy',
    'software',
    'developer',
    'bug',
    'test',
    'unit test',
    'integration',
    'frontend',
    'backend',
    'fullstack',
    'react',
    'svelte',
    'python',
    'javascript',
    'typescript',
    'rust',
    'go',
    'java',
    'sql',
    'database',
    'query',
    'orm',
    'git',
    'ci',
    'cd',
    'devops',
    'docker',
    'kubernetes'
  ],
  writing: [
    'write',
    'draft',
    'essay',
    'article',
    'blog',
    'copy',
    'content',
    'email',
    'letter',
    'report',
    'documentation',
    'proofread',
    'edit',
    'grammar',
    'tone',
    'rewrite',
    'summarize',
    'translate',
    'narrative',
    'story',
    'proposal',
    'brief'
  ],
  analysis: [
    'analyze',
    'analysis',
    'research',
    'data',
    'insight',
    'trend',
    'pattern',
    'compare',
    'evaluate',
    'assess',
    'review',
    'audit',
    'investigate',
    'benchmark',
    'metrics',
    'statistics',
    'survey',
    'findings',
    'correlate'
  ],
  customer_support: [
    'customer',
    'support',
    'ticket',
    'helpdesk',
    'chat',
    'respond',
    'complaint',
    'issue',
    'escalate',
    'resolution',
    'faq',
    'troubleshoot',
    'onboard',
    'feedback',
    'satisfaction',
    'csat',
    'nps'
  ],
  data_processing: [
    'extract',
    'transform',
    'load',
    'etl',
    'parse',
    'scrape',
    'clean',
    'normalize',
    'pipeline',
    'batch',
    'ingest',
    'migrate',
    'convert',
    'format',
    'csv',
    'json',
    'xml',
    'spreadsheet',
    'database'
  ],
  math: [
    'math',
    'calculate',
    'equation',
    'formula',
    'statistics',
    'probability',
    'algebra',
    'calculus',
    'geometry',
    'proof',
    'theorem',
    'numerical',
    'compute',
    'model',
    'predict',
    'regression',
    'optimization'
  ],
  creative: [
    'creative',
    'design',
    'brainstorm',
    'idea',
    'concept',
    'innovate',
    'imagine',
    'art',
    'visual',
    'mockup',
    'prototype',
    'storyboard',
    'campaign',
    'slogan',
    'tagline',
    'brand'
  ],
  general: []
};

export function categorizeSubtask(subtask: string, parentCategory: TaskCategory): TaskCategory {
  const lowerSubtask = subtask.toLowerCase();
  const words = lowerSubtask.split(/[\s\p{P}]/u).filter(w => w.length > 0);
  const wordSet = new Set(words);

  // Count keyword matches per category
  const matches: Record<TaskCategory, number> = {
    coding: 0,
    writing: 0,
    analysis: 0,
    customer_support: 0,
    data_processing: 0,
    math: 0,
    creative: 0,
    general: 0
  };

  for (const [category, keywords] of Object.entries(SUBTASK_KEYWORD_MAP)) {
    const cat = category as TaskCategory;
    for (const keyword of keywords) {
      if (wordSet.has(keyword)) {
        matches[cat]++;
      }
    }
  }

  // Find category with most matches
  let bestCategory: TaskCategory = parentCategory;
  let bestCount = matches[parentCategory];

  for (const [category, count] of Object.entries(matches)) {
    const cat = category as TaskCategory;
    if (count > bestCount) {
      bestCategory = cat;
      bestCount = count;
    }
  }

  return bestCategory;
}
