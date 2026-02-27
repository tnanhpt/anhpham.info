export const sleep = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const detectSeparator = (input: string) => {
  const commonSeparators = ["\t", ",", ";", " "];

  if (input.includes("|")) {
    return "|";
  }

  let bestSeparator = ",";
  let maxCount = 0;

  for (const sep of commonSeparators) {
    const count = input.split(sep).length - 1;
    if (count > maxCount) {
      maxCount = count;
      bestSeparator = sep;
    }
  }

  return bestSeparator;
};


