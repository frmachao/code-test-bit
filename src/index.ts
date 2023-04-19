import configs from "./data.json" assert { type: "json" };
import { DataItem } from "./type.js";

function detectPatterns(name: `${string}.bit`): Set<string> {
  const prefix = name.slice(0, -4);
  const results = new Set<string>();
  for (const config of Object.values(configs as DataItem[])) {
    // except the Rare4D pattern.
    if (config.names.includes(prefix) && config.name.en != "Rare4D") {
      results.add(config.name.en);
    }
  }
  return results;
}

export default detectPatterns;
