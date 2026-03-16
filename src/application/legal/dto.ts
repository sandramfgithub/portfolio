export type PolicySectionViewModel = {
  bullets: readonly string[];
  id:
    | 'collected'
    | 'contact'
    | 'legal-basis'
    | 'not-collected'
    | 'opt-out'
    | 'provider';
  paragraphs: readonly string[];
  title: string;
};

export type PrivacyPolicyPageViewModel = {
  contactEmail: string;
  controllerName: string;
  description: string;
  providerName: string;
  providerUrl: string;
  retention: string;
  sections: readonly PolicySectionViewModel[];
  summary: string;
  title: string;
};
