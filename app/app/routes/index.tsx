import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { filterByMajorBrowsers } from "compat-data";
import { FeatureTree } from "~/components/FeatureTree";

export async function loader() {
  const compat = filterByMajorBrowsers({
    chrome: "92.0.0",
    safari: "14.0.0",
    edge: "92.0.0",
    firefox: "91.0.0",
  });

  const jsCompat = compat["javascript"];
  const cssCompat = compat["css"];
  const htmlCompat = compat["html"];

  return json({ jsCompat, cssCompat, htmlCompat });
}

export default function Index() {
  const { jsCompat, cssCompat, htmlCompat } = useLoaderData();

  return (
    <div>
      <h2 className="text-2xl text-red-700">The world after IE left.</h2>

      <FeatureTree feature={jsCompat} name={"javascript"} />
      <FeatureTree feature={cssCompat} name={"css"} />
      <FeatureTree feature={htmlCompat} name={"html"} />
    </div>
  );
}
