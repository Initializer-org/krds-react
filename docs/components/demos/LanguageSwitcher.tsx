import { LanguageSwitcher } from '@krds.ui/react'

export default function LanguageSwitcherDemo() {
  return (
    <LanguageSwitcher
      defaultValue="ko"
      options={[
        { value: 'ko', label: '한국어' },
        { value: 'en', label: 'English' }
      ]}
    >
      <LanguageSwitcher.Trigger />
      <LanguageSwitcher.Menu>
        <LanguageSwitcher.Current />
        <LanguageSwitcher.OptionList />
      </LanguageSwitcher.Menu>
    </LanguageSwitcher>
  )
}
