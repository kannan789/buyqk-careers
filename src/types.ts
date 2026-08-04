export type WorkMode = 'Virtual / WFH' | 'On-site' | 'Hybrid';
export type ShiftType = 'Day Shift' | 'Rotational (24/7)' | 'Night Shift';
export type ExperienceLevel = 'Fresher (0 yrs)' | '1 - 3 Yrs' | '3 - 5 Yrs' | '5+ Yrs';

export interface UserAccount {
  id: string;
  email: string;
  fullName: string;
  phone?: string;
  role: 'candidate' | 'admin';
  city?: string;
  state?: string;
  pinCode?: string;
  highestQualification?: string;
  experienceYears?: string;
  currentCompany?: string;
  skills?: string[];
  preferredShift?: string;
  preferredLocation?: string;
  hasLaptopAndWifi?: boolean;
  resumeFileName?: string;
  resumeText?: string;
  createdAt: string;
}

export interface JobOpening {
  id: string;
  reqId: string;
  title: string;
  department: string;
  location: string;
  state: string;
  workMode: WorkMode;
  shiftType: ShiftType;
  experience: ExperienceLevel;
  education: string;
  salary: string;
  tags: string[];
  isHot?: boolean;
  isUrgent?: boolean;
  postedDate: string;
  description: string;
  responsibilities: string[];
  requirements: string[];
  preferredQualifications?: string[];
  benefits: string[];
  hiringProcess: string[];
  openingsCount: number;
}

export interface JobApplication {
  id: string;
  regId: string;
  candidateId?: string;
  jobId: string;
  jobTitle: string;
  reqId: string;
  department: string;
  fullName: string;
  email: string;
  phone: string;
  city: string;
  state: string;
  pinCode: string;
  gender: string;
  highestQualification: string;
  experienceYears: string;
  currentCompany?: string;
  skills: string[];
  preferredShift: string;
  preferredLocation: string;
  hasLaptopAndWifi: boolean;
  noticePeriod: string;
  expectedCtc?: string;
  resumeFileName: string;
  resumeText?: string;
  status: 'Submitted' | 'Resume Screened' | 'Virtual Assessment' | 'Interview Scheduled' | 'Offer Extended' | 'Rejected';
  recruiterNotes?: string;
  appliedAt: string;
}

export interface FilterState {
  searchQuery: string;
  department: string;
  location: string;
  experience: string;
  workMode: string;
  shiftType: string;
}
