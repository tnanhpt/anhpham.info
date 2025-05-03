
const NumberFormatter = ({ number }: any) => {
  const formattedNumber = number.toLocaleString();

  return <span>{formattedNumber}</span>;
};

export default NumberFormatter;
