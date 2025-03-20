// types.ts
export interface ResumeData {
    title?: string;
    summary?: Summary;
    additionalInformation?: AdditionalInformation;
    education?: EducationEntry[];
    experience?: ExperienceEntry[];
    skills?: string[];
  }
  
  interface Summary {
    professional_summary?: string;
  }
  
  interface AdditionalInformation {
    languages?: string | string[];
    citizenship?: string;
    availability?: string;
    interests?: string;
  }
  
  interface EducationEntry {
    institution?: string;
    degree?: string;
    startDate?: string;
    endDate?: string;
    details?: string;
  }
  
  interface ExperienceEntry {
    company?: string;
    role?: string;
    timeline?: string;
    description?: string;
    highlights?: string[];
  }