interface Base {
  id: string;
  slug: string;
  num_name: number;
  name: { en: string };
}

interface Digits extends Base {
  subs: Digits[];
}

interface SubDetail extends Base {
  names: string[];
}

interface DataItem extends SubDetail {
  type: string[];
}

export { Base, Digits, SubDetail, DataItem };
