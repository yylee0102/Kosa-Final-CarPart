// CRA/Next/Vite 대부분 JSON import 지원
import material from './material-theme.json' 
// (만약 assert 문법이 안 되면) // import material from './material-theme.json';

const pick = (obj, keys) =>
  keys.reduce((acc, k) => ({ ...acc, [k]: obj[k] }), {});

export const createThemeFromMaterial = (schemeName = 'light') => {
  const s = material.schemes[schemeName];
  if (!s) throw new Error(`Unknown scheme: ${schemeName}`);

  // 필요한 키만 추려서 가벼운 theme 만들기
  const sys = pick(s, [
    'primary', 'onPrimary', 'primaryContainer', 'onPrimaryContainer',
    'secondary', 'onSecondary',
    'tertiary', 'onTertiary',
    'error', 'onError', 'errorContainer', 'onErrorContainer',
    'background', 'onBackground',
    'surface', 'onSurface',
    'surfaceContainerLowest', 'surfaceContainerLow', 'surfaceContainer',
    'surfaceContainerHigh', 'surfaceContainerHighest',
    'surfaceVariant', 'onSurfaceVariant',
    'outline', 'outlineVariant',
    'inverseSurface', 'inverseOnSurface', 'inversePrimary',
  ]);

  return {
    mode: schemeName,
    sys,
    // 필요하면 팔레트(raw)도 같이 노출
    palettes: material.palettes,
  };
};

export const themeLight = createThemeFromMaterial('light');
export const themeDark  = createThemeFromMaterial('dark');
