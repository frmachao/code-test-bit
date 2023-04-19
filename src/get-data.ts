import axios, { AxiosResponse } from "axios";
import { writeFile } from "fs/promises";
import { Digits, SubDetail, DataItem } from "./type.js";

const fetchJson = async <T>(url: string): Promise<T> => {
  try {
    const response: AxiosResponse = await axios.get(url);
    console.log("response.status===", response.status);
    const data: T = response.data;
    return data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const { response } = error;
      if (response) {
        return Promise.reject(
          new Error(`Fetch error: ${response.status} ${response.statusText}`)
        );
      }
      return Promise.reject(new Error(`Network error: ${error.message}`));
    }
    return Promise.reject(
      new Error(`JSON parse error: ${(error as Error).message}`)
    );
  }
};

const getDigitSubs = async (): Promise<Digits[]> => {
  const results = await fetchJson<Digits[]>(
    "https://api.godid.io/api/collections/v2?compact=true"
  );
  const digitInfo = results.find((ele) => ele.slug == "digits");
  if (!digitInfo) {
    throw new Error("digitInfo not found");
  }
  return digitInfo.subs;
};

const getSubDetail = async (subId: string): Promise<SubDetail> => {
  return await fetchJson<SubDetail>(
    `https://api.godid.io/api/collections/${subId}?compact=false`
  );
};

const getDigits = async (): Promise<void> => {
  const digitSubs = await getDigitSubs();
  console.log("digitSubs length-----", digitSubs.length);
  const config: Map<string, DataItem> = new Map();
  for (const digitElement of digitSubs) {
    const results = await Promise.all(
      digitElement.subs.map((ele) => getSubDetail(ele.id))
    );
    console.log("Promise.all getSubDetail");
    for (const ele of results) {
      const configItem = config.get(ele.slug);
      if (configItem) {
        configItem.type.push(digitElement.slug);
      } else {
        config.set(ele.slug, {
          type: [digitElement.slug],
          id: ele.id,
          slug: ele.slug,
          names: ele.names,
          num_name: ele.num_name,
          name: ele.name,
        });
      }
    }
  }
  await writeFile("src/data.json", JSON.stringify(Object.fromEntries(config)));
  console.log("write file success!");
};

getDigits();
