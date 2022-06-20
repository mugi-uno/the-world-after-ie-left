import { json, LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { useState } from "react";
import { FeatureContainer } from "~/components/FeatureContainer";
import { VersionInput } from "~/components/VersionInput";
import { filterByMajorBrowsers } from "~/lib/compat-data/lib/filters/filters";
import { Feature } from "~/lib/compat-data/types/type";

type Versions = {
  chrome: string;
  safari: string;
  edge: string;
  firefox: string;
};

export const loader: LoaderFunction = async ({ request }) => {
  const param = new URL(request.url).searchParams;

  const checkVersion = (ver: string | null) => {
    if (!ver) return "";

    const trimedVer = ver.trim();
    if (trimedVer.match(/^[0-9]+(\.[0-9]+)?(\.[0-9]+)?$/)) {
      return trimedVer;
    }

    return "";
  };

  const version = {
    chrome: checkVersion(param.get("chrome")),
    safari: checkVersion(param.get("safari")),
    edge: checkVersion(param.get("edge")),
    firefox: checkVersion(param.get("firefox")),
  };

  const compat = filterByMajorBrowsers(version);

  return json({ compat, version });
};

export default function Index() {
  const { compat, version } = useLoaderData<{
    compat: Feature;
    version: Versions;
  }>();

  const [versionState, setVersionState] = useState<Versions>({
    ...version,
  });

  const onChangeVersion = (key: keyof Versions, value: string) => {
    setVersionState({
      ...versionState,
      [key]: value,
    });
  };

  const onReload = () => {
    const paramObject: Partial<Versions> = {};

    for (const key in versionState) {
      if (versionState[key as keyof Versions]) {
        paramObject[key as keyof Versions] =
          versionState[key as keyof Versions];
      }
    }

    const param = new URLSearchParams(paramObject);
    const query = param.toString();

    window.location.href = query ? `/?${query}` : "/";
  };

  return (
    <div>
      <h2 className="text-2xl text-red-700 ml-2">The world after IE left.</h2>

      <div className="text-gray-500 text-xs ml-2 mb-2">
        This page is based on data from{" "}
        <a
          href="https://github.com/mdn/browser-compat-data"
          target="_blank"
          rel="noreferrer"
          className="hover:underline text-blue-500"
        >
          mdn/compat-data
        </a>
        .
      </div>

      <div className="text-[12px] ml-2">
        <div className="mb-[1px]">
          <VersionInput
            label="Chrome"
            value={versionState.chrome}
            onChange={(value) => onChangeVersion("chrome", value)}
          />
        </div>
        <div className="mb-[1px]">
          <VersionInput
            label="Safari"
            value={versionState.safari}
            onChange={(value) => onChangeVersion("safari", value)}
          />
        </div>
        <div className="mb-[1px]">
          <VersionInput
            label="Firefox"
            value={versionState.firefox}
            onChange={(value) => onChangeVersion("firefox", value)}
          />
        </div>
        <div className="mb-[1px]">
          <VersionInput
            label="Edge"
            value={versionState.edge}
            onChange={(value) => onChangeVersion("edge", value)}
          />
        </div>

        <button
          type="button"
          className="px-2 rounded mt-1 bg-gray-200 outline-offset-0 outline outline-gray-300 transition-all hover:outline-offset-2"
          onClick={onReload}
        >
          🔁 Reload
        </button>
      </div>

      {Object.keys(compat).flatMap((key1) =>
        key1 === "__compat"
          ? null
          : Object.keys(compat[key1]).flatMap((key2) => {
              const badges = [key1, key2];
              return key2 === "__compat"
                ? null
                : Object.keys(compat[key1][key2]).flatMap((key3) =>
                    key3 === "__compat" ? null : (
                      <FeatureContainer
                        key={`${key1}-${key2}-${key3}`}
                        id={`${key1}-${key2}-${key3}`}
                        feature={compat[key1][key2][key3]}
                        name={key3}
                        badges={badges}
                      />
                    )
                  );
            })
      )}
    </div>
  );
}
