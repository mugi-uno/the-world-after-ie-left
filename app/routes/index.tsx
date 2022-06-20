import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { FeatureContainer } from "~/components/FeatureContainer";
import { filterByMajorBrowsers } from "~/lib/compat-data/lib/filters/filters";
import { Feature } from "~/lib/compat-data/types/type";

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

      <div className="text-[8px] ml-2">
        <div className="mb-[1px]">
          Chrome ≧ <input type="string" defaultValue={VERSIONS.chrome} />
        </div>
        <div className="mb-[1px]">
          Safari ≧ <input type="string" defaultValue={VERSIONS.safari} />
        </div>
        <div className="mb-[1px]">
          Edge ≧ <input type="string" defaultValue={VERSIONS.edge} />
        </div>
        <div className="mb-[1px]">
          Firefox ≧ <input type="string" defaultValue={VERSIONS.firefox} />
        </div>
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

      {/* <FeatureContainer feature={jsCompat} name={"javascript"} />
      <FeatureContainer feature={cssCompat} name={"css"} />
      <FeatureContainer feature={htmlCompat} name={"html"} /> */}
    </div>
  );
}
