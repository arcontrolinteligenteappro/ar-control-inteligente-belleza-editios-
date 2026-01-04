import React from 'react';
import { Clock, ChevronRight } from 'lucide-react';
import { Service } from '../types';

interface ServiceCardProps {
  service: Service;
  onBook: (service: Service) => void;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({ service, onBook }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex mb-4 active:scale-[0.98] transition-transform">
      <div className="w-24 h-24 sm:w-32 sm:h-auto flex-shrink-0">
        <img 
          src={service.imageUrl} 
          alt={service.name} 
          className="w-full h-full object-cover"
        />
      </div>
      <div className="flex-1 p-3 flex flex-col justify-between">
        <div>
          <h3 className="font-semibold text-gray-900 line-clamp-1">{service.name}</h3>
          <p className="text-xs text-gray-500 mt-1 line-clamp-2">{service.description}</p>
        </div>
        <div className="flex items-center justify-between mt-2">
          <div className="flex flex-col">
            <span className="font-bold text-indigo-600">${service.price.toFixed(2)}</span>
            <div className="flex items-center text-xs text-gray-400">
              <Clock size={12} className="mr-1" />
              {service.durationMin} min
            </div>
          </div>
          <button 
            onClick={() => onBook(service)}
            className="bg-gray-900 text-white p-2 rounded-full hover:bg-gray-800"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};