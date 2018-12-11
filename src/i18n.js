import i18n from 'i18next';
import { reactI18nextModule } from 'react-i18next';

// the translations
const resources = {
  en: {
    translation: {
      'Bug': 'Bug',
      'Feature': 'Feature',
      'Improvement': 'Improvement',
      'Send Feedback': 'Send Feedback',
      'Sent!': 'Sent!',
      'Sending Feedback...': 'Sending Feedback...',
      'Channel': 'Channel',
      'Feedback Type': 'Feedback Type',
      'Your Message': 'Your Message',
      'Message...': 'Message...',
      'Send URL with Feedback': 'Send URL with Feedback'
    }
  },
  bg: {
    translation: {
      'Bug': 'Бъг',
      'Feature': 'Функционалност',
      'Improvement': 'Подобрение',
      'Send Feedback': 'Изпрати обратна връзка',
      'Sent!': 'Изпратена!',
      'Sending Feedback...': 'Изпраща обратна връзка...',
      'Channel': 'Канал',
      'Feedback Type': 'Тип обратна връзка',
      'Your Message': 'Вашият коментар',
      'Message...': 'Коментар...',
      'Send URL with Feedback': 'Изпрати URL адрес с обратната връзка'}
  }
};

i18n
  .use(reactI18nextModule) // passes i18n down to react-i18next
  .init({
    resources,
    lng: 'en',

    keySeparator: false, // we do not use keys in form messages.welcome​

    interpolation: {
      escapeValue: false // react already safes from xss
    }
  });

export default i18n;