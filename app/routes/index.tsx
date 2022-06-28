import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { useState } from "react";
import { IdentifierLink } from "~/components/IdentifierLink";
import { IdentifierRoot } from "~/components/identifiers/IdentifierRoot";
import { VersionInput } from "~/components/VersionInput";
import { ROOT_IDENTIFIERS } from "~/constant";
import { filterByMajorBrowsers } from "~/lib/filters";
import githubLogo from "~/styles/github.png";
import type { FilteredCompatData } from "~/types/types";

type Versions = {
  chrome: string;
  safari: string;
  edge: string;
  firefox: string;
};

type LoaderData = {
  compat: Partial<FilteredCompatData>;
  version: Versions;
  identifier: keyof FilteredCompatData;
  currentQuery: string;
};

export const loader: LoaderFunction = async ({ request }) => {
  const param = new URL(request.url).searchParams;

  const viewParam = param.get("view");

  const identifier: keyof FilteredCompatData =
    viewParam &&
    ROOT_IDENTIFIERS.includes(viewParam as keyof FilteredCompatData)
      ? (viewParam as keyof FilteredCompatData)
      : "javascript";

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

  const compat = filterByMajorBrowsers(version, identifier);

  return json<LoaderData>({
    compat: { [identifier]: compat[identifier] },
    version,
    identifier,
    currentQuery: param.toString(),
  });
};

export default function Index() {
  const { compat, version, identifier, currentQuery } =
    useLoaderData<LoaderData>();

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
    const param = new URLSearchParams(currentQuery);

    for (const key in versionState) {
      if (versionState[key as keyof Versions]) {
        param.set(key, versionState[key as keyof Versions]);
      }
    }

    const query = param.toString();

    window.location.href = query ? `/?${query}` : "/";
  };

  const identifierLink = (identifier: keyof FilteredCompatData) => {
    const param = new URLSearchParams(currentQuery);
    param.set("view", identifier);
    return `/?${param.toString()}`;
  };

  return (
    <div>
      <div className="w-full flex justify-between items-center p-2">
        <h2 className="text-2xl text-red-700">The world after IE left.</h2>
        <a
          href="https://github.com/mugi-uno/the-world-after-ie-left"
          target="_blank"
          rel="noreferrer"
        >
          <img src={githubLogo} className="w-4 h-4" />
        </a>
      </div>

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

      <div className="grid gap-2 auto-cols-min grid-flow-col m-2 mt-4">
        <IdentifierLink
          link={identifierLink("javascript")}
          active={identifier === "javascript"}
        >
          JavaScript
        </IdentifierLink>
        <IdentifierLink
          link={identifierLink("css")}
          active={identifier === "css"}
        >
          CSS
        </IdentifierLink>
        <IdentifierLink
          link={identifierLink("html")}
          active={identifier === "html"}
        >
          HTML
        </IdentifierLink>
        <IdentifierLink
          link={identifierLink("api")}
          active={identifier === "api"}
        >
          API
        </IdentifierLink>
        <IdentifierLink
          link={identifierLink("http")}
          active={identifier === "http"}
        >
          HTTP
        </IdentifierLink>
        <IdentifierLink
          link={identifierLink("svg")}
          active={identifier === "svg"}
        >
          SVG
        </IdentifierLink>
        <IdentifierLink
          link={identifierLink("webextensions")}
          active={identifier === "webextensions"}
        >
          WebExtensions
        </IdentifierLink>
      </div>

      {identifier === "javascript" && (
        <IdentifierRoot
          identifier={compat["javascript"]!}
          id="javascript"
          name="JavaScript"
          unwrapDepth={2}
          badgeClass="bg-[#fcff99]"
        />
      )}

      {identifier === "css" && (
        <IdentifierRoot
          identifier={compat["css"]!}
          id="css"
          name="CSS"
          unwrapDepth={2}
          badgeClass="bg-[#ff99bd]"
        />
      )}

      {identifier === "html" && (
        <IdentifierRoot
          identifier={compat["html"]!}
          id="html"
          name="HTML"
          unwrapDepth={2}
          badgeClass="bg-[#99ffa0]"
        />
      )}

      {identifier === "svg" && (
        <IdentifierRoot
          identifier={compat["svg"]!}
          id="svg"
          name="SVG"
          unwrapDepth={2}
          badgeClass="bg-[#cc99ff]"
        />
      )}

      {identifier === "api" && (
        <IdentifierRoot
          identifier={compat["api"]!}
          id="api"
          name="API"
          unwrapDepth={1}
          badgeClass="bg-[#ff9999]"
        />
      )}

      {identifier === "http" && (
        <IdentifierRoot
          identifier={compat["http"]!}
          id="http"
          name="HTTP"
          unwrapDepth={1}
          badgeClass="bg-[#99afff]"
        />
      )}

      {/* {identifier === "webdriver" && (
        <IdentifierRoot
          identifier={compat["webdriver"]}
          id="webdriver"
          name="WebDriver"
          unwrapDepth={1}
          badgeClass="bg-[#c1c1c1]"
        />
      )} */}

      {identifier === "webextensions" && (
        <IdentifierRoot
          identifier={compat["webextensions"]!}
          id="webextensions"
          name="WebExtensions"
          unwrapDepth={1}
          badgeClass="bg-[#a2a9cd]"
        />
      )}
    </div>
  );
}
