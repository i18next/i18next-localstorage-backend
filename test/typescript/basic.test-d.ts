import i18next from 'i18next';
import Backend, { LocalStorageBackendOptions } from 'i18next-localstorage-backend';

i18next.use(Backend).init<LocalStorageBackendOptions>({
  backend: {
    prefix: 'asdf'
  },
});
