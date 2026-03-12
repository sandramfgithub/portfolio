const isBulletBody = (body) => {
  if (!body) {
    return false;
  }

  const lines = body
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length === 0) {
    return false;
  }

  return lines.every((line) => /^- \S/.test(line));
};

export default {
  extends: ['@commitlint/config-conventional'],
  plugins: [
    {
      rules: {
        'body-bullets': ({ body }) => {
          return [
            isBulletBody(body),
            'commit body must be a short bullet list using "- " prefixes',
          ];
        },
      },
    },
  ],
  rules: {
    'scope-empty': [2, 'never'],
    'scope-case': [2, 'always', 'kebab-case'],
    'body-empty': [2, 'never'],
    'body-bullets': [2, 'always'],
    'body-leading-blank': [2, 'always'],
    'body-max-line-length': [2, 'always', 80],
    'header-max-length': [2, 'always', 72],
  },
};
