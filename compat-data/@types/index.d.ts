declare type Browsers = "chrome" | "edge" | "firefox" | "ie" | "safari";

declare type CompatJson = {
  [key: string]: CompatJson | CompatTable;
} & {
  __compat?: CompatTable;
};

declare type CompatTable = {
  description?: string;
  mdn_url?: string;
  spec_url?: string;
  support: {
    [key in Browsers]?: {
      version_added?: string | false;
    };
  };
};

declare type FlattenJson = {
  [key: string]: CompatTable;
};
