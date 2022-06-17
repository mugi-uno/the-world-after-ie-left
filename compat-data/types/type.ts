export type Browsers = "chrome" | "edge" | "firefox" | "ie" | "safari";

export type CompatJson = {
  [key: string]: CompatJson | CompatTable;
} & {
  __compat?: CompatTable;
};

export type CompatTable = {
  description?: string;
  mdn_url?: string;
  spec_url?: string;
  support: {
    [key in Browsers]?:
      | {
          version_added?: string | boolean;
          prefix?: string;
        }[]
      | {
          version_added: string | boolean;
        }
      | "mirror";
  };
};

export type FlattenJson = {
  [key: string]: CompatTable;
};
