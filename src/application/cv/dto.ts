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

export type CvViewModel = {
  profile: CvProfileViewModel;
  contacts: {
    github: string | null;
    linkedin: string | null;
    email: string | null;
  };
  experience: readonly CvExperienceViewModel[];
  languages: readonly CvLanguageViewModel[];
  skillNames: readonly string[];
};
