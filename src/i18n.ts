// Unified Translation entrypoint compiling separate language files
// Exporting the consolidated translation scroll for Dojo use.
import en from './i18n/en';
import de from './i18n/de';

export const TRANSLATIONS: Record<string, any> = {
  en,
  de
};
