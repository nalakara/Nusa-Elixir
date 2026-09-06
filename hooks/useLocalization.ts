
import { useContext } from 'react';
import { LanguageContext } from '../contexts/LanguageContext';
import { LOCALIZATION_STRINGS } from '../constants';
import type { Language } from '../types';

type StringKey = keyof typeof LOCALIZATION_STRINGS;

export const useLocalization = () => {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error('useLocalization must be used within a LanguageProvider');
  }

  const { language } = context;

  const t = (key: StringKey): string => {
    const stringSet = LOCALIZATION_STRINGS[key];
    return stringSet ? stringSet[language] : key;
  };

  const translate = (item: { nameEn: string; nameId: string }): string => {
    return language === 'id' ? item.nameId : item.nameEn;
  };

  return { t, language, setLanguage: context.setLanguage, translate };
};
