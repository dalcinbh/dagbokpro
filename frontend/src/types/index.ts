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
  }
  
  export interface ResumeData {
    title: string;
    summary: {
      professional_summary: string;
    };
    education: EducationEntry[];
    experience: ExperienceEntry[];
    skills: string[];
    additional_information: Record<string, any>;
  }