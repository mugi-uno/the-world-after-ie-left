import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { filterByMajorBrowsers } from "compat-data";
import type { Feature } from "compat-data/types/type";
import { FeatureContainer } from "~/components/FeatureContainer";

const VERSIONS = {
  chrome: "92.0.0",
  safari: "14.0.0",
  edge: "92.0.0",
  firefox: "91.0.0",
};

export async function loader() {
  const compat = filterByMajorBrowsers(VERSIONS);

  return json({ compat });
}

export default function Index() {
  const { compat } = useLoaderData<{
    compat: Feature;
  }>();

  return (
    <div>
      <h2 className="text-2xl text-red-700">The world after IE left.</h2>

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

      <div className="text-[8px] ml-2">
        <div>Chrome ≧ {VERSIONS.chrome}</div>
        <div>Safari ≧ {VERSIONS.safari}</div>
        <div>Edge ≧ {VERSIONS.edge}</div>
        <div>Firefox ≧ {VERSIONS.firefox}</div>
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
                        feature={compat[key1][key2][key3]}
                        name={key3}
                        badges={badges}
                      />
                    )
                  );
            })
      )}

      {/* <FeatureContainer feature={jsCompat} name={"javascript"} />
      <FeatureContainer feature={cssCompat} name={"css"} />
      <FeatureContainer feature={htmlCompat} name={"html"} /> */}
    </div>
  );
}
