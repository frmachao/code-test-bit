// 一个用于检测 .bit 名称中的模式的函数
type Regexes = {
  [key: string]: RegExp;
};
// 定义一个对象来存储模式和正则表达式
const regexes: Regexes = {
  // AAA: 三个连续相同的数字
  AAA: /(^|\D)([0-9])\2\2(\D|$)/g,
  // ABBB: 一个数字后面跟三个连续相同的数字
  ABBB: /(^|\D)([0-9])(?!\2)([0-9])\3\3(\D|$)/g,
  // ABBBB: 一个数字后面跟三个连续相同的数字
  ABBBB: /(^|\D)([0-9])(?!\2)([0-9])\3\3\3(\D|$)/g,
  // ABBA: 两个数字后面跟相同的两个数字的逆序
  ABBA: /^(\d)(\d)\2\1$/g,
  // AAABBB: 三个连续相同的数字后跟另外三个连续相同的数字
  AAABBB: /^(\d)\1{2}(\d)\2{2}$/g,
  // AABC: 两个连续相同的数字后跟两个不同的数字
  AABC: /^(\d)\1(\d)(?!\2)\d$/g,
  // ABCC: 两个不同的数字后跟两个连续相同的数字
  ABCC: /^(\d)(?!\1)\d(\d)\2{1}$/g,
  // 999: 长度为3的数字从 000 到 999
  "999": /^(0\d{2}|[1-9]\d{2})$/g,
  // 10K: 长度为4的数字从 0000 到 9999
  "10K": /^(0[0-9]{3}|[1-9][0-9]{3})$/g,
  // 100K: 长度为5的数字从 00000 到 99999
  "100K": /^(0\d{4}|[1-9]\d{4})$/g,
  // XXX000: 长度为6的数字 三个从 0 到 9 的数字后跟三个零
  XXX000: /^[0-9]{3}000$/g,
  // 0XXX: 一个零后跟三个从 0 到 9 的数字
  "0XXX": /^0[0-9]{3}$/g,
  // 00XX: 两个零后跟两个从 0 到 9 的数字
  "00XX": /^00[0-9]{2}$/g,
  // 0x10K: 一个零后跟 x 和一个从 1 到 9 的数字后跟三个零
  "0x10K": /^0x[0-9]{4}$/g,
};

export default function detectPatterns(name: string): Set<string> {
  // 初始化一个空的集合来存储模式
  let patterns = new Set<string>();

  // 获取名称中 .bit 之前的部分
  let prefix = name.slice(0, name.indexOf(".bit"));
  let isValidMonthDate = isMatchMonthDate(prefix);

  const keys = Object.keys(regexes);
  const len = keys.length;

  for (let i = 0; i < len; i++) {
    const pattern = keys[i];
    const regex = regexes[pattern];
    if (regex.test(prefix)) {
      // 如果前缀匹配正则表达式，将模式添加到集合中
      patterns.add(pattern);
    }
    if (isValidMonthDate && pattern !== "MMDD") {
      patterns.add("MMDD");
    }
  }
  console.log(prefix, patterns);
  return patterns;
}

function isMatchMonthDate(str: string): boolean {
  let regex = /^(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])$/;
  let match = regex.exec(str);
  if (!match) return false;
  let month = parseInt(match[1], 10);
  let date = parseInt(match[2], 10);
  // 如果月份是二月，判断日期是否小于等于29
  if (month === 2 && date > 29) return false;
  return true;
}
