import React, { useLanguage, setLanguage } from './language'

export default function LanguageSwitch({ floating = false }) {
  const language = useLanguage()
  return <button className={`language-switch ${floating ? 'language-switch-floating' : ''}`} type="button" aria-label={language === 'zh' ? 'Switch website to English' : '切换为中文'} onClick={() => setLanguage(language === 'zh' ? 'en' : 'zh')}><span aria-hidden="true">{language === 'zh' ? 'EN' : '中文'}</span></button>
}
