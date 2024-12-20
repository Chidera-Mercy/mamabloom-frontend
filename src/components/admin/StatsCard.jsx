export const StatsCard = ({ label, value }) => (
    <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 shadow-md hover:shadow-lg transition-all transform hover:scale-105">
      <p className="font-delius text-gray-600 mb-2">{label}</p>
      <p className="font-poppins text-2xl font-bold text-[#013f40]">{value}</p>
    </div>
);