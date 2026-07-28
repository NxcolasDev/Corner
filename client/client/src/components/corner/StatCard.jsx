import CornerCard from "./CornerCard";

const StatCard = ({ title, value, icon, children }) => {
  return (
    <CornerCard className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-500">{title}</p>
          <h3 className="mt-2 text-3xl font-bold">{value}</h3>
        </div>

        {icon}
      </div>

      {children}
    </CornerCard>
  );
};

export default StatCard;