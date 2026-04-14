export type TaskCategory =
  | 'coding'
  | 'writing'
  | 'analysis'
  | 'customer_support'
  | 'data_processing'
  | 'math'
  | 'creative'
  | 'general';

export interface ParsedTask {
  originalInput: string;
  category: TaskCategory;
  subtasks: string[];
  keywordMatches: Record<TaskCategory, number>;
}

const KEYWORD_MAP: Record<TaskCategory, string[]> = {
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

const CATEGORY_PRIORITY: TaskCategory[] = [
  'coding',
  'analysis',
  'data_processing',
  'math',
  'writing',
  'customer_support',
  'creative',
  'general'
];

const DEFAULT_SUBTASKS: Record<TaskCategory, string[]> = {
  coding: ['Write the code', 'Test the implementation', 'Handle errors'],
  writing: ['Draft the content', 'Review and edit', 'Format for output'],
  analysis: ['Gather the data', 'Analyze patterns', 'Summarize findings'],
  customer_support: ['Understand the issue', 'Research solutions', 'Draft response'],
  data_processing: ['Extract the data', 'Transform and clean', 'Load to destination'],
  math: ['Set up the problem', 'Compute the solution', 'Verify the result'],
  creative: ['Brainstorm concepts', 'Develop the idea', 'Refine the output'],
  general: ['Understand the request', 'Process the task', 'Deliver the output']
};

export function parseTask(userInput: string): ParsedTask {
  // Input validation
  if (!userInput || userInput.trim().length === 0) {
    throw new Error('Task description cannot be empty');
  }

  if (userInput.length > 2000) {
    throw new Error('Task description must be under 2000 characters');
  }

  const trimmedInput = userInput.trim();
  const lowerInput = trimmedInput.toLowerCase();

  // Count keyword matches per category
  const keywordMatches: Record<TaskCategory, number> = {
    coding: 0,
    writing: 0,
    analysis: 0,
    customer_support: 0,
    data_processing: 0,
    math: 0,
    creative: 0,
    general: 0
  };

  // Split input into words once
  const words = lowerInput.split(/[\s\p{P}]/u).filter(w => w.length > 0);
  const wordSet = new Set(words);

  for (const [category, keywords] of Object.entries(KEYWORD_MAP)) {
    const cat = category as TaskCategory;
    for (const keyword of keywords) {
      if (wordSet.has(keyword)) {
        keywordMatches[cat]++;
      }
    }
  }

  // Determine category: highest count wins, ties broken by priority
  let selectedCategory: TaskCategory = 'general';
  let highestCount = 0;

  for (const category of CATEGORY_PRIORITY) {
    if (keywordMatches[category] > highestCount) {
      selectedCategory = category;
      highestCount = keywordMatches[category];
    }
  }

  // Extract subtasks from sentences
  let subtasks: string[] = [];

  // Split into sentences
  const sentences = trimmedInput.split(/[.!?;\n]+/).filter(s => s.trim().length > 0);

  // Filter sentences with at least 5 words
  const validSentences = sentences.filter(s => {
    const wordCount = s.trim().split(/\s+/).length;
    return wordCount >= 5;
  });

  if (validSentences.length > 0) {
    // Use valid sentences as subtasks, cap at 5
    subtasks = validSentences.map(s => s.trim()).slice(0, 5);
  } else {
    // Use default subtasks for this category
    subtasks = DEFAULT_SUBTASKS[selectedCategory];
  }

  return {
    originalInput: trimmedInput,
    category: selectedCategory,
    subtasks,
    keywordMatches
  };
}
