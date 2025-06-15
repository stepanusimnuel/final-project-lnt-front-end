export const getDiscountPrice = (price: number, disc: number): number => {
  const res: number = price - (disc * price) / 100;
  return Number(res.toFixed(2));
};

export const truncateText = (desc: string, maxWords: number = 15): string => {
  const words = desc.split(" ");
  return words.length <= maxWords ? desc : words.slice(0, maxWords).join(" ") + "...";
};
