export type Browsers = "chrome" | "edge" | "firefox" | "ie" | "safari";

export type CompatJson = {
  [key: string]: CompatJson | CompatTable;
} & {
  __compat?: CompatTable;
};

export type Support = {
  version_added?: string | boolean;
  partial_implementation?: boolean;
  prefix?: string;
};

export type CompatTable = {
  description?: string;
  mdn_url?: string;
  spec_url?: string;
  support: {
    [key in Browsers]?: Support[] | Support | "mirror";
  };
};

export type FlattenJson = {
  [key: string]: CompatTable;
};
