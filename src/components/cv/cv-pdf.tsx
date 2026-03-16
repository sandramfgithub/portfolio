import {
  Document,
  Font,
  Page,
  StyleSheet,
  Text,
  View,
} from '@react-pdf/renderer';
import type {
  CvCertificationViewModel,
  CvEducationViewModel,
  CvExperienceViewModel,
  CvLanguageViewModel,
  CvProfileViewModel,
} from '@/application/cv/dto';
import type { Lang } from '@/i18n/translations';

// ---------- Fonts ----------

Font.register({
  family: 'Outfit',
  fonts: [
    { src: '/fonts/Outfit-Regular.ttf', fontWeight: 400 },
    { src: '/fonts/Outfit-Medium.ttf', fontWeight: 500 },
    { src: '/fonts/Outfit-SemiBold.ttf', fontWeight: 600 },
  ],
});

Font.registerHyphenationCallback((word) => [word]);

// ---------- Colors (hex — react-pdf doesn't support oklch) ----------

const c = {
  primary: '#1A1A1A',
  foreground: '#1A1A1A',
  muted: '#6B6B6B',
  bgMuted: '#F0F0F0',
  border: '#E0E0E0',
  white: '#FFFFFF',
};

// ---------- Styles ----------

const s = StyleSheet.create({
  page: {
    fontFamily: 'Outfit',
    fontSize: 9,
    color: c.foreground,
    backgroundColor: c.white,
    paddingTop: 32,
    paddingBottom: 40,
    paddingHorizontal: 56,
  },

  // Header
  headerName: {
    fontSize: 22,
    fontWeight: 600,
    letterSpacing: -0.5,
  },
  headerRole: {
    fontSize: 11,
    fontWeight: 500,
    color: c.muted,
    marginTop: 2,
  },
  headerContact: {
    fontSize: 8,
    color: c.muted,
    marginTop: 6,
    flexDirection: 'column',
    gap: 2,
  },
  disclaimer: {
    fontSize: 7.5,
    color: c.muted,
    marginTop: 18,
  },

  // Sections
  sectionTitle: {
    fontSize: 7.5,
    fontWeight: 600,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    color: c.primary,
    marginBottom: 8,
    marginTop: 18,
  },
  separator: {
    height: 1,
    backgroundColor: c.border,
    marginBottom: 2,
  },

  // Profile
  summary: {
    fontSize: 9,
    lineHeight: 1.6,
    color: c.muted,
  },

  // Experience
  expHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 3,
  },
  expRole: {
    fontSize: 11,
    fontWeight: 600,
  },
  expCompany: {
    fontSize: 9,
    fontWeight: 500,
    color: c.muted,
  },
  expPeriod: {
    fontSize: 8,
    color: c.muted,
    fontWeight: 500,
  },
  expSummary: {
    fontSize: 9,
    lineHeight: 1.5,
    color: c.muted,
    marginBottom: 4,
  },
  achievement: {
    fontSize: 8.5,
    lineHeight: 1.5,
    color: c.foreground,
    paddingLeft: 10,
    marginBottom: 2,
  },
  achievementBullet: {
    position: 'absolute',
    left: 0,
    top: 0,
    color: c.primary,
    fontSize: 8.5,
  },
  expDivider: {
    marginTop: 12,
  },

  // Tags
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    marginTop: 6,
  },
  tag: {
    fontSize: 7,
    fontWeight: 500,
    color: c.foreground,
    backgroundColor: c.bgMuted,
    paddingHorizontal: 6,
    paddingVertical: 2.5,
    borderRadius: 4,
  },

  // Education and certifications
  metaRow: {
    marginBottom: 10,
  },
  metaTitle: {
    fontSize: 10,
    fontWeight: 600,
  },
  metaSubtitle: {
    fontSize: 8.5,
    color: c.muted,
    marginTop: 2,
  },
  metaSummary: {
    fontSize: 8.5,
    lineHeight: 1.5,
    color: c.muted,
    marginTop: 4,
  },

  // Two columns bottom
  twoCol: {
    flexDirection: 'row',
    gap: 24,
    marginTop: 18,
  },
  colLeft: {
    flex: 1,
  },
  colRight: {
    width: 180,
  },

  // Languages
  langRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  langName: {
    fontSize: 9,
    fontWeight: 500,
  },
  langLevel: {
    fontSize: 9,
    color: c.muted,
  },
});

// ---------- Props ----------

type CvPdfProps = {
  birthDateLabel: string;
  profile: CvProfileViewModel;
  experience: readonly CvExperienceViewModel[];
  education: readonly CvEducationViewModel[];
  certifications: readonly CvCertificationViewModel[];
  languages: readonly CvLanguageViewModel[];
  stack: readonly string[];
  downloadDisclaimer?: string;
  lang: Lang;
  contact: {
    github: string | null;
    linkedin: string | null;
    email: string | null;
  };
  sectionLabels?: {
    certifications: string;
    education: string;
    profile: string;
    experience: string;
    stack: string;
    languages: string;
  };
};

// ---------- Document ----------

export function CvPdfDocument({
  birthDateLabel,
  profile,
  experience,
  education,
  certifications,
  languages,
  stack,
  downloadDisclaimer,
  lang,
  contact,
  sectionLabels = {
    certifications: 'Certificaciones',
    education: 'Formación',
    profile: 'Perfil profesional',
    experience: 'Experiencia',
    stack: 'Stack técnico',
    languages: 'Idiomas',
  },
}: CvPdfProps) {
  const formatBirthDate = (birthDate: string) => {
    const date = new Date(`${birthDate}T00:00:00`);

    return new Intl.DateTimeFormat(lang === 'es' ? 'es-ES' : 'en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(date);
  };

  return (
    <Document author={profile.name} title={`CV — ${profile.name}`}>
      <Page size="A4" style={s.page}>
        {/* Header */}
        <View>
          <Text style={s.headerName}>{profile.name}</Text>
          <Text style={s.headerRole}>{profile.role}</Text>
          <View style={s.headerContact}>
            <Text>{profile.location}</Text>
            <Text>{`${birthDateLabel}: ${formatBirthDate(profile.birthDate)}`}</Text>
            <Text>{`Web: ${profile.web}`}</Text>
            {contact.email && <Text>{`Email: ${contact.email}`}</Text>}
            {contact.github && <Text>{`GitHub: ${contact.github}`}</Text>}
            {contact.linkedin && <Text>{`LinkedIn: ${contact.linkedin}`}</Text>}
          </View>
        </View>

        {/* Professional profile */}
        <Text style={s.sectionTitle}>{sectionLabels.profile}</Text>
        <View style={s.separator} />
        <Text style={s.summary}>{profile.summary}</Text>
        {profile.bodyParagraphs.map((paragraph, index) => (
          <Text key={index} style={s.summary}>
            {paragraph}
          </Text>
        ))}

        {/* Experience */}
        <Text style={s.sectionTitle}>{sectionLabels.experience}</Text>
        <View style={s.separator} />
        {experience.map((exp, i) => (
          <View key={i} wrap={false}>
            <View style={s.expHeader}>
              <View>
                <Text style={s.expRole}>{exp.role}</Text>
                <Text style={s.expCompany}>{exp.company}</Text>
              </View>
              <Text style={s.expPeriod}>{exp.period}</Text>
            </View>
            <Text style={s.expSummary}>{exp.summary}</Text>
            {exp.achievements.map((ach, j) => (
              <View key={j} style={{ position: 'relative' }}>
                <Text style={s.achievementBullet}>•</Text>
                <Text style={s.achievement}>{ach}</Text>
              </View>
            ))}
            <View style={s.tagsRow}>
              {exp.stack.map((t, k) => (
                <Text key={k} style={s.tag}>
                  {t}
                </Text>
              ))}
            </View>
            {i < experience.length - 1 && (
              <View style={s.expDivider}>
                <View style={s.separator} />
              </View>
            )}
          </View>
        ))}

        {/* Two columns: Skills + Languages */}
        <View style={s.twoCol}>
          <View style={s.colLeft}>
            <Text style={s.sectionTitle}>{sectionLabels.stack}</Text>
            <View style={s.separator} />
            <View style={s.tagsRow}>
              {stack.map((item, i) => (
                <Text key={i} style={s.tag}>
                  {item}
                </Text>
              ))}
            </View>
          </View>

          <View style={s.colRight}>
            <Text style={s.sectionTitle}>{sectionLabels.languages}</Text>
            <View style={s.separator} />
            {languages.map((lang, i) => (
              <View key={i} style={s.langRow}>
                <Text style={s.langName}>{lang.name}</Text>
              </View>
            ))}
          </View>
        </View>

        {education.length > 0 && (
          <>
            <Text style={s.sectionTitle}>{sectionLabels.education}</Text>
            <View style={s.separator} />
            {education.map((item, i) => (
              <View key={i} style={s.metaRow}>
                <Text style={s.metaTitle}>{item.title}</Text>
                <Text style={s.metaSubtitle}>
                  {item.institution} · {item.period}
                </Text>
                {item.summary && (
                  <Text style={s.metaSummary}>{item.summary}</Text>
                )}
              </View>
            ))}
          </>
        )}

        {certifications.length > 0 && (
          <>
            <Text style={s.sectionTitle}>{sectionLabels.certifications}</Text>
            <View style={s.separator} />
            {certifications.map((item, i) => (
              <View key={i} style={s.metaRow}>
                <Text style={s.metaTitle}>{item.name}</Text>
                <Text style={s.metaSubtitle}>
                  {item.issuer}
                  {item.issuedAt ? ` · ${item.issuedAt}` : ''}
                </Text>
              </View>
            ))}
          </>
        )}

        {downloadDisclaimer && (
          <Text style={s.disclaimer}>{downloadDisclaimer}</Text>
        )}
      </Page>
    </Document>
  );
}
