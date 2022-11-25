import { BackendModule, ReadCallback } from "i18next";

interface BackendOptions {
  prefix?: string;
  expirationTime?: number;
  versions?: { [key: string]: string };
  defaultVersion?: string;
  store?: any;
}

export default class I18NextLocalStorageBackend
  implements BackendModule<BackendOptions>
{
  static type: "backend";
  constructor(services?: any, options?: BackendOptions);
  init(services?: any, options?: BackendOptions): void;
  read(language: string, namespace: string, callback: ReadCallback): void;
  save(language: string, namespace: string, data: any): void;
  type: "backend";
  services: any;
  options: BackendOptions;
}

declare module "i18next" {
  interface CustomPluginOptions {
    backend?: BackendOptions;
  }
}