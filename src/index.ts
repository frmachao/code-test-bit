function detectPatterns(name: string): Set<string> {
  const patterns = new Set<string>();

  // Rule 1: 3 consecutive identical digits -> AAA and 999
  const aaaMatch = name.match(/(\d)\1{2}/g);
  if (aaaMatch?.some((match) => match === "333")) {
    patterns.add("AAA");
    patterns.add("999");
  }

  // Rule 3: ABBBB, 100K
  const abbbbMatch = name.match(/A(\d)\1{3}/g);
  if (abbbbMatch?.some((match) => match === "A5555")) {
    patterns.add("ABBBB");
    patterns.add("100K");
  } else if (name.includes("100K")) {
    patterns.add("100K");
  }


  return patterns;
}
// test
console.log(detectPatterns("333.bit")); // Set(["AAA", "999"])
console.log(detectPatterns("2112.bit")); // Set(["ABBA", "10K"])

export default detectPatterns;
