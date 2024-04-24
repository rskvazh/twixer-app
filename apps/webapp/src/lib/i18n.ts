import { derived } from 'svelte/store'
import { apiCurrentUser } from './api'
import type { ApiTypes } from '@twixer/core'

type Locales = 'en' | 'ru'
interface KeysTypes {
  start_video_chat: string
  your_gender: string
  guy: string
  girl: string
  cannot_change_gender_after_reg: string
  read_and_accept_terms: string
  signup_confirm_age: string
  confirm: string
  girls_and_guys: string
  girls_only: string
  guys_only: string
  chat_with_filter: string
  finding_someone: string
  report_user_confirm: string
}

const translations: { [K in keyof KeysTypes]: { [L in Locales]: KeysTypes[K] } } = {
  start_video_chat: {
    en: 'Start Video Chat',
    ru: 'Начать видеочат',
  },
  your_gender: {
    en: 'Your Gender',
    ru: 'Пол',
  },
  guy: {
    en: 'Guy',
    ru: 'Парень',
  },
  girl: {
    en: 'Girl',
    ru: 'Девушка',
  },
  cannot_change_gender_after_reg: {
    en: 'You cannot change your gender after registration',
    ru: 'Ты не сможешь изменить пол после регистрации',
  },
  signup_confirm_age: {
    en: 'I confirm that I am 18 years of age or older',
    ru: 'Я подтверждаю, что мне уже есть 18 лет',
  },
  confirm: {
    en: 'Confirm',
    ru: 'Подтверждаю',
  },
  girls_and_guys: {
    en: 'Girls and Guys',
    ru: 'Девушки и Парни',
  },
  girls_only: {
    en: 'Girls Only',
    ru: 'Девушки',
  },
  guys_only: {
    en: 'Guys Only',
    ru: 'Парни',
  },
  chat_with_filter: {
    en: 'Chat with (Coming soon)',
    ru: 'Фильтр (скоро)',
  },
  finding_someone: {
    en: 'Finding Someone Cool',
    ru: 'Ищу кого-то классного',
  },
  report_user_confirm: {
    en: 'Are you sure you want to report this user?',
    ru: 'Ты точно хочешь пожаловаться на собеседника?',
  },
} as const

function getTargetLocale(locale?: string | null): Locales {
  switch (locale) {
    case 'ru':
      return locale
    default:
      return 'en'
  }
}

const locale = derived(apiCurrentUser, ($currentUser) => getTargetLocale($currentUser?.lang))

export const tr = derived(locale, ($locale) => (key: keyof KeysTypes): string => {
  return translations[key][$locale]
})

export const trGender = derived(tr, ($tr) => (gender: ApiTypes.UserGender) => {
  switch (gender) {
    case 'FEMALE':
      return $tr('girl')
    case 'MALE':
      return $tr('guy')
    case 'UNKNOWN':
      return 'unknown'
  }
})
