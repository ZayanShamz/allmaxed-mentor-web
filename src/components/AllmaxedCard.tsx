import React from "react";
import { MapPin, Users } from "lucide-react";

interface AllmaxedProps {
  title?: string;
  appliedCount?: number;
  location?: string;
  date?: string;
  description?: string;
  level_required?: string;
}

const AllmaxedCard: React.FC<AllmaxedProps> = ({
  title,
  appliedCount,
  location,
  date,
  description,
  level_required,
}) => {
  return (
    <div className="justify-center items-center bg-white rounded-lg border border-gray-200 px-8 pt-8 pb-3 hover:shadow-lg transition-shadow duration-300 max-w-sm cursor-pointer min-h-[200px] lg:min-w-[300px] min-w-[70vw] sm:min-w-[60vw] md:min-w-0">
      <div className="flex flex-col h-full justify-between">
        {/* Card Header */}
        <div className="mb-4">
          <h3 className="text-2xl font-semibold text-allpurple leading-tight">
            {title}
          </h3>
        </div>

        {/* Location */}
        <div className="flex items-start text-gray-500 mb-4">
          <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
          <span className="text-sm leading-tight">{location}</span>
        </div>

        {/* Date */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-lg font-bold text-black">{date}</span>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap justify-start gap-2 mb-3">
          <span className="px-3 py-1 bg-[#EBE8FF] text-allcharcoal text-sm font-medium rounded-full">
            {description}
          </span>
          <span className="px-3 py-1 bg-[#EBE8FF] text-allcharcoal text-sm font-medium rounded-full">
            {level_required}
          </span>
        </div>
        <div className="flex justify-end">
          <div className="flex items-center text-xs text-gray-400">
            <Users className="w-3 h-3 mr-1" />
            <span>{appliedCount} applied</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllmaxedCard;
