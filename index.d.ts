declare namespace I18NextLocalStorageBackend {
  interface BackendOptions {
    prefix?: string;
    expirationTime?: number;
    versions?: { [key: string]: string };
  }

  type LoadCallback = (error: any, result: string | false) => void;
}

declare class I18NextLocalStorageBackend {
  constructor(services?: any, options?: I18NextLocalStorageBackend.BackendOptions);
  init(services?: any, options?: I18NextLocalStorageBackend.BackendOptions): void;
  read(language: string, namespace: string, callback: I18NextLocalStorageBackend.LoadCallback): void;
  save(language: string, namespace: string, data: any): void;
  type: "backend";
  services: any;
  options: I18NextLocalStorageBackend.BackendOptions;
}

export = I18NextLocalStorageBackend;
