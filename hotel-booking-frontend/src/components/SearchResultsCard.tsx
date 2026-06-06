import { Link } from "react-router-dom";
import { HotelType } from "../../../shared/types";
import { AiFillStar } from "react-icons/ai";
import {
  MapPin,
  Building2,
  Users,
  Wifi,
  Car,
  Waves,
  Dumbbell,
  Sparkles,
  UtensilsCrossed,
  Coffee,
  Plane,
  Building,
} from "lucide-react";
import { Badge } from "./ui/badge";

type Props = {
  hotel: HotelType;
};

const SearchResultsCard = ({ hotel }: Props) => {
  const getFacilityIcon = (facility: string) => {
    const iconMap: { [key: string]: any } = {
      "Free WiFi": Wifi,
      "Free Parking": Car,
      "Swimming Pool": Waves,
      "Fitness Center": Dumbbell,
      Spa: Sparkles,
      Restaurant: UtensilsCrossed,
      "Bar/Lounge": Coffee,
      "Airport Shuttle": Plane,
      "Business Center": Building,
    };
    return iconMap[facility] || Building2;
  };

  return (
    <div className="group bg-white rounded-2xl shadow-soft hover:shadow-large transition-all duration-300 border border-gray-100 overflow-hidden h-auto xl:h-[500px] flex">
      <div className="grid grid-cols-1 xl:grid-cols-[2fr_3fr] gap-0 w-full h-full">
        {/* Image Section */}
        <div className="relative overflow-hidden h-64 xl:h-[500px]">
          <img
            src={hotel.imageUrls[0]}
            className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
          />

          {/* Overlay Badges */}
          <div className="absolute top-4 left-4 flex flex-col space-y-2">
            <div className={`${hotel.hasDynamicPricing ? 'bg-purple-600' : 'bg-primary-600'} text-white rounded-full px-3 py-1 transition-colors duration-300`}>
              <span className="text-sm font-bold">£{hotel.pricePerNight}/night</span>
            </div>
            {hotel.isFeatured && (
              <div className="bg-yellow-500 text-white rounded-full px-3 py-1">
                <span className="text-xs font-bold">Featured</span>
              </div>
            )}
          </div>

          {/* Star Rating Badge */}
          <div className="absolute top-4 right-4">
            <div className="bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center space-x-1">
              <AiFillStar className="w-4 h-4 text-yellow-500" />
              <span className="text-sm font-semibold text-gray-800">
                {hotel.starRating}
              </span>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-6 flex flex-col justify-between h-auto xl:h-full overflow-hidden">
          <div className="space-y-4 overflow-y-auto xl:flex-1">
            {/* Header */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="flex">
                    {Array.from({ length: hotel.starRating }).map((_, i) => (
                      <AiFillStar key={i} className="w-4 h-4 text-yellow-400" />
                    ))}
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {Array.isArray(hotel.type) ? (
                      hotel.type.slice(0, 4).map((type) => (
                        <Badge
                          key={type}
                          variant="default"
                          className="text-xs px-2 py-1"
                        >
                          {type}
                        </Badge>
                      ))
                    ) : (
                      <Badge variant="default" className="text-xs px-2 py-1">
                        {hotel.type}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              <Link
                to={`/detail/${hotel._id}${window.location.search}`}
                className="text-2xl font-bold text-gray-900 hover:text-primary-600 transition-colors cursor-pointer block"
              >
                {hotel.name}
              </Link>

              <div className="flex items-center text-gray-600">
                <MapPin className="w-4 h-4 mr-1" />
                <span className="text-sm">
                  {hotel.city}, {hotel.country}
                </span>
              </div>
            </div>

            {/* Description */}
            <div className="text-gray-600 leading-relaxed line-clamp-3">
              {hotel.description}
            </div>

            {/* Hotel Stats */}
            <div className="flex items-center space-x-6 text-sm text-gray-600">
              {hotel.totalBookings && (
                <div className="flex items-center space-x-1">
                  <Users className="w-4 h-4" />
                  <span>{hotel.totalBookings} bookings</span>
                </div>
              )}
              <div className="flex items-center space-x-1">
                <AiFillStar className="w-4 h-4 text-yellow-400" />
                <span>
                  {hotel.averageRating && hotel.averageRating > 0
                    ? `${hotel.averageRating.toFixed(1)} avg rating`
                    : "No ratings yet"}
                </span>
              </div>
            </div>
          </div>

          {/* Facilities */}
          <div className="mt-4">
            <h4 className="text-sm font-semibold text-gray-700 mb-2">
              Key Amenities
            </h4>
            <div className="flex flex-wrap gap-2">
              {hotel.facilities.slice(0, 6).map((facility) => {
                const IconComponent = getFacilityIcon(facility);
                return (
                  <Badge
                    key={facility}
                    variant="outline"
                    className="flex items-center space-x-1.5 px-3 py-1.5 text-xs"
                  >
                    <IconComponent className="w-3 h-3 text-primary-600" />
                    <span>{facility}</span>
                  </Badge>
                );
              })}
            </div>
          </div>

          {/* Action Button & Dynamic Pricing Display */}
          <div className="mt-6 pt-4 border-t border-gray-100 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div className="flex flex-col">
              {hotel.hasDynamicPricing && hotel.dynamicTotalCost ? (
                <>
                  <span className="text-[11px] font-bold text-purple-600 uppercase tracking-wider mb-0.5">
                    Total Tarif Dinamis
                  </span>
                  <div className="flex items-baseline space-x-1.5">
                    <span className="text-3xl font-black text-purple-700">
                      £{hotel.dynamicTotalCost}
                    </span>
                    <span className="text-xs text-gray-400 font-medium">
                      (Termasuk weekend)
                    </span>
                  </div>
                </>
              ) : (
                <>
                  <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">
                    Estimasi Mulai Dari
                  </span>
                  <div className="flex items-baseline space-x-1">
                    <span className="text-2xl font-bold text-gray-900">
                      £{hotel.pricePerNight}
                    </span>
                    <span className="text-xs text-gray-500 font-medium">/malam</span>
                  </div>
                </>
              )}
            </div>

            <Link
              to={`/detail/${hotel._id}${window.location.search}`}
              className="bg-gradient-to-r from-primary-600 to-primary-700 text-white py-3 px-6 rounded-xl font-semibold hover:from-primary-700 hover:to-primary-800 transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 text-center sm:w-auto w-full block min-w-[180px]"
            >
              View Details & Book
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchResultsCard;