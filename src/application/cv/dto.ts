export type CvProfileViewModel = {
  name: string;
  role: string;
  location: string;
  web: string;
  summary: string;
  photo: string | null;
};

export type CvExperienceViewModel = {
  role: string;
  company: string;
  period: string;
  summary: string;
  achievements: readonly string[];
  stack: readonly string[];
};

export type CvLanguageViewModel = {
  name: string;
  level: string;
};

export type CvEducationViewModel = {
  institution: string;
  period: string;
  summary?: string;
  title: string;
};

export type CvCertificationViewModel = {
  issuedAt?: string;
  issuer: string;
  name: string;
  url?: string;
};

export type CvViewModel = {
  contacts: {
    email: string | null;
    github: string | null;
    linkedin: string | null;
  };
  certifications: readonly CvCertificationViewModel[];
  education: readonly CvEducationViewModel[];
  experience: readonly CvExperienceViewModel[];
  languages: readonly CvLanguageViewModel[];
  profile: CvProfileViewModel;
  skillNames: readonly string[];
};

export type CvPageViewModel = {
  cv: CvViewModel;
  description: string;
  title: string;
};
