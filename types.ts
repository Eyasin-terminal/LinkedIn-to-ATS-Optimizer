
export interface Experience {
  title: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  highlights: string[];
}

export interface Education {
  degree: string;
  institution: string;
  location: string;
  graduationDate: string;
}

export interface ResumeData {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  linkedinUrl: string;
  professionalSummary: string;
  skills: {
    category: string;
    items: string[];
  }[];
  experience: Experience[];
  education: Education[];
  certifications: string[];
}
