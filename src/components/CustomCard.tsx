import React from "react";
import { MapPin, Users } from "lucide-react";

interface CustomCardProps {
  title?: string;
  appliedCount?: number;
  location?: string;
  date?: string;
  skillTag?: string;
  levelTag?: string;
}

const CustomCard: React.FC<CustomCardProps> = ({
  title = "Design Thinking or something",
  appliedCount = 10,
  location = "St. Bones Engineering College Kazhakoottam Trivandrum",
  date = "09 NOV",
  skillTag = "UI/UX Designing",
  levelTag = "Expert",
}) => {
  return (
    <div className="justify-center items-center bg-white rounded-lg border border-gray-200 p-5 hover:shadow-lg transition-shadow duration-300 max-w-sm cursor-pointer min-h-[200px] lg:min-w-[300px]">
      <div className="flex flex-col h-full justify-between p-3">
        {/* Card Header */}
        <div className="mb-4">
          <h3 className="text-2xl font-semibold text-allpurple leading-tight">
            {title}
          </h3>
        </div>

        {/* Location */}
        <div className="flex items-start text-gray-500 mb-4">
          <MapPin className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
          <span className="text-sm leading-tight">{location}</span>
        </div>

        {/* Date */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-lg font-bold text-black">{date}</span>
          <div className="flex items-center text-xs text-gray-500">
            <Users className="w-3 h-3 mr-1" />
            <span>{appliedCount} applied</span>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          <span className="px-3 py-1 bg-[#EBE8FF] text-allcharcoal text-sm font-medium rounded-full">
            {skillTag}
          </span>
          <span className="px-3 py-1 bg-[#EBE8FF] text-allcharcoal text-sm font-medium rounded-full">
            {levelTag}
          </span>
        </div>
      </div>
    </div>
  );
};

export default CustomCard;
