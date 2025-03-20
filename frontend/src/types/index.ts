export interface EducationEntry {
  institution: string;
  degree: string;
  year: string;
}

export interface ExperienceEntry {
  company: string;
  role: string;
  duration: string;
  description: string;
  highlights?: string[];
}

export interface Summary {
  professional_summary: string;
}

export interface AdditionalInformation {
  languages?: string | string[];
  citizenship?: string;
  availability?: string;
  interests?: string;
}

export interface ResumeData {
  title: string;
  summary: Summary;
  education: EducationEntry[];
  experience: ExperienceEntry[];
  skills: string[];
  additional_information: AdditionalInformation;
}