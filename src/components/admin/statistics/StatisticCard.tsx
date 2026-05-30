import { StatisticCardProps } from '@/types/statistic.types';

export const StatisticCard = ({ title, value, valueColor, emoji }: StatisticCardProps) => {
  return (
    <div className="flex gap-5 bg-[#161616] border border-gray-400 rounded-lg pb-4 pt-4 px-5">
      <div>
        <h3 className="text-gray-300 text-[12px] font-bold">{title}</h3>
        <h3 className={`text-3xl ${valueColor} font-bold`}>{value}</h3>
      </div>
      <div className="text-4xl m-auto">
        {emoji}
      </div>
    </div>
  );
};
