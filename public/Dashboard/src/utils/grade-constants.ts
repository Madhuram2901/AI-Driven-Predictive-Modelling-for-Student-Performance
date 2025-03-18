// Grade mapping for GPA calculation
export const GRADE_MAPPING = {
  'S': 4.0,
  'A': 3.7,
  'B': 3.3,
  'C': 3.0,
  'D': 2.7,
  'E': 2.3,
  'F': 0.0
} as const;

// Percentage mapping for display
export const GRADE_PERCENTAGE = {
  'S': 95,
  'A': 90,
  'B': 85,
  'C': 80,
  'D': 75,
  'E': 70,
  'F': 65
} as const;

export type Grade = keyof typeof GRADE_MAPPING;

// Initial subjects with CS focus
export const initialSubjects = [
  { id: 1, name: 'Data Structures & Algorithms', grades: [] },
  { id: 2, name: 'Computer Organization', grades: [] },
  { id: 3, name: 'Software Engineering', grades: [] },
  { id: 4, name: 'Database Systems', grades: [] },
  { id: 5, name: 'Operating Systems', grades: [] },
  { id: 6, name: 'Computer Networks', grades: [] },
  { id: 7, name: 'Machine Learning', grades: [] },
  { id: 8, name: 'Web Development', grades: [] },
  { id: 9, name: 'Cybersecurity', grades: [] },
  { id: 10, name: 'Cloud Computing', grades: [] },
  { id: 11, name: 'Mobile App Development', grades: [] },
  { id: 12, name: 'Artificial Intelligence', grades: [] },
];

// Storage utilities
export const STORAGE_KEYS = {
  SUBJECTS: 'student_subjects',
  HISTORICAL_GPA: 'student_historical_gpa'
} as const;

export const getStoredSubjects = () => {
  const stored = localStorage.getItem(STORAGE_KEYS.SUBJECTS);
  return stored ? JSON.parse(stored) : initialSubjects;
};

export const getStoredHistoricalGPA = () => {
  const stored = localStorage.getItem(STORAGE_KEYS.HISTORICAL_GPA);
  return stored ? JSON.parse(stored) : [];
};

export const storeSubjects = (subjects: typeof initialSubjects) => {
  localStorage.setItem(STORAGE_KEYS.SUBJECTS, JSON.stringify(subjects));
};

export const storeHistoricalGPA = (gpa: Array<{ name: string; gpa: number }>) => {
  localStorage.setItem(STORAGE_KEYS.HISTORICAL_GPA, JSON.stringify(gpa));
}; 