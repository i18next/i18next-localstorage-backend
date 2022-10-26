import i18next from 'i18next';
import Backend from 'i18next-localstorage-backend';

i18next.use(Backend).init({
  backend: {
    prefix: 'asdf'
  },
});
