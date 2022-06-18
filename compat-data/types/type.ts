export type Browsers =
  | "chrome"
  | "chrome_android"
  | "deno"
  | "edge"
  | "firefox"
  | "firefox_android"
  | "ie"
  | "nodejs"
  | "opera"
  | "opera_android"
  | "safari"
  | "safari_ios"
  | "samsunginternet_android"
  | "webview_android";

export type CompatJson = {
  [key: string]: CompatJson | CompatTable;
} & {
  __compat?: CompatTable;
};

export type VersionAdded = string | boolean | null;

export type Support = {
  version_added: VersionAdded;
  version_removed?: string | boolean | null;
  prefix?: string;
  alternative_name?: string;
  flags?: {
    type: "preference" | "runtime_flag";
    name: string;
    value_to_set: string;
  };
  impl_url?: string;
  partial_implementation?: boolean;
  notes?: string[];
};

export type CompatSupport = Support[] | Support | "mirror";

export type CompatTable = {
  description?: string;
  mdn_url?: string;
  spec_url?: string;
  support: {
    [key in Browsers]?: CompatSupport;
  };
  status: {
    experimental: boolean;
    standard_track: boolean;
    deprecated: boolean;
  };
};

export type CompatMap = {
  key: string;
  __features: CompatMap[];
  __compat?: CompatTable | undefined;
};
