import { BackendModule, ReadCallback } from "i18next";

export interface LocalStorageBackendOptions {
  prefix?: string;
  expirationTime?: number;
  versions?: { [key: string]: string };
  getVersion?: (lng: string, ns: string) => string | undefined;
  defaultVersion?: string;
  store?: any;
}

export default class I18NextLocalStorageBackend
  implements BackendModule<LocalStorageBackendOptions>
{
  static type: "backend";
  constructor(services?: any, options?: LocalStorageBackendOptions);
  init(services?: any, options?: LocalStorageBackendOptions): void;
  read(language: string, namespace: string, callback: ReadCallback): void;
  save(language: string, namespace: string, data: any): void;
  type: "backend";
  services: any;
  options: LocalStorageBackendOptions;
}
