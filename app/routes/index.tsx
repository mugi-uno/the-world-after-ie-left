import { json, LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { ChangeEventHandler, ReactEventHandler, useState } from "react";
import { FeatureContainer } from "~/components/FeatureContainer";
import { filterByMajorBrowsers } from "~/lib/compat-data/lib/filters/filters";
import { Feature } from "~/lib/compat-data/types/type";

const DEFAULT_VERSIONS = {
  chrome: "92.0.0",
  safari: "14.0.0",
  edge: "92.0.0",
  firefox: "91.0.0",
};

export const loader: LoaderFunction = async ({ request }) => {
  const param = new URL(request.url).searchParams;

  const checkVersion = (ver: string | null, defaultVersion: string) => {
    if (!ver) return defaultVersion;

    const trimedVer = ver.trim();
    if (trimedVer.match(/^[0-9]+(\.[0-9]+)?(\.[0-9]+)?$/)) {
      return trimedVer;
    }

    return defaultVersion;
  };

  const version = {
    chrome: checkVersion(param.get("chrome"), DEFAULT_VERSIONS.chrome),
    safari: checkVersion(param.get("safari"), DEFAULT_VERSIONS.safari),
    edge: checkVersion(param.get("edge"), DEFAULT_VERSIONS.edge),
    firefox: checkVersion(param.get("firefox"), DEFAULT_VERSIONS.firefox),
  };

  const compat = filterByMajorBrowsers(version);

  return json({ compat, version });
};

export default function Index() {
  const { compat, version } = useLoaderData<{
    compat: Feature;
    version: typeof DEFAULT_VERSIONS;
  }>();

  const [versionState, setVersionState] = useState<typeof DEFAULT_VERSIONS>({
    ...version,
  });

  const onChangeVersion = (
    key: keyof typeof DEFAULT_VERSIONS,
    value: string
  ) => {
    setVersionState({
      ...versionState,
      [key]: value,
    });
  };

  const onReload = () => {
    const param = new URLSearchParams(versionState);
    window.location.href = `/?${param.toString()}`;
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
          Chrome ≧
          <input
            type="string"
            defaultValue={version.chrome}
            className="outline-none border-gray-400 border-solid border-w-[1px] border rounded-sm ml-1 w-[60px]"
            onChange={(e) => onChangeVersion("chrome", e.target.value)}
          />
        </div>
        <div className="mb-[1px]">
          Safari ≧
          <input
            type="string"
            defaultValue={version.safari}
            className="outline-none border-gray-400 border-solid border-w-[1px] border rounded-sm ml-1 w-[60px]"
            onChange={(e) => onChangeVersion("safari", e.target.value)}
          />
        </div>
        <div className="mb-[1px]">
          Edge ≧
          <input
            type="string"
            defaultValue={version.edge}
            className="outline-none border-gray-400 border-solid border-w-[1px] border rounded-sm ml-1 w-[60px]"
            onChange={(e) => onChangeVersion("edge", e.target.value)}
          />
        </div>
        <div className="mb-[1px]">
          Firefox ≧
          <input
            type="string"
            defaultValue={version.firefox}
            className="outline-none border-gray-400 border-solid border-w-[1px] border rounded-sm ml-1 w-[60px]"
            onChange={(e) => onChangeVersion("firefox", e.target.value)}
          />
        </div>

        <button
          type="button"
          className="px-2 rounded mt-1 bg-gray-200 outline-offset-0 outline outline-gray-400 transition-all hover:outline-offset-2"
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
