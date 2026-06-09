import { Link } from "react-router-dom";
import { HotelType } from "../../../shared/types";
import { MapPin, Star, Users } from "lucide-react";
import { Badge } from "./ui/badge";

type Props = {
  hotel: HotelType;
};

const LatestDestinationCard = ({ hotel }: Props) => {
  return (
    <Link
      to={`/detail/${hotel._id}${window.location.search}`}
      className="group relative cursor-pointer overflow-hidden rounded-2xl shadow-soft transition-all duration-300 hover:shadow-large hover:scale-105 bg-white flex flex-col w-full h-[350px] border border-gray-10"
      style={{ minWidth: 320, maxWidth: 500 }}
    >
      <div className="w-full h-full relative">
        <img
          src={hotel.imageUrls[0]}
          className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-110"
          style={{ minHeight: 350, maxHeight: 350 }}
        />

        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

        {/* Hotel Stats Badge */}
        <div className="absolute top-4 right-4">
          <div className="bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center space-x-1">
            <Star className="w-4 h-4 text-yellow-500 fill-current" />
            <span className="text-sm font-semibold text-gray-800">
              {hotel.starRating}
            </span>
          </div>
        </div>

        {/* Price Badge (Adaptif Terhadap Weekend Dynamic Pricing) */}
        <div className="absolute top-4 left-4">
          <div className={`${hotel.hasDynamicPricing ? 'bg-purple-600' : 'bg-primary-600'} text-white rounded-full px-3 py-1 shadow-md transition-colors duration-300`}>
            <span className="text-sm font-bold">
              {hotel.hasDynamicPricing && hotel.dynamicTotalCost
                ? `$${hotel.dynamicTotalCost} Total`
                : `$${hotel.pricePerNight}/night`}
            </span>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 p-6 w-full">
        <div className="space-y-2">
          {/* Badge Penanda Harga Akhir Pekan Aktif */}
          {hotel.hasDynamicPricing && (
            <span className="inline-block bg-purple-500/80 backdrop-blur-sm text-[10px] font-bold text-white uppercase tracking-wider px-2 py-0.5 rounded-md mb-1">
              Weekend Rate Applied
            </span>
          )}

          <h3 className="text-white font-bold text-2xl tracking-tight group-hover:text-primary-200 transition-colors">
            {hotel.name}
          </h3>

          <div className="flex items-center space-x-4 text-white/90">
            <div className="flex items-center space-x-1">
              <MapPin className="w-4 h-4" />
              <span className="text-sm font-medium">
                {hotel.city}, {hotel.country}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <div className="flex flex-col space-y-2">
              {/* Hotel Types */}
              <div className="flex flex-wrap gap-1">
                {Array.isArray(hotel.type) ? (
                  hotel.type.slice(0, 3).map((type) => (
                    <Badge
                      key={type}
                      variant="outline"
                      className="text-xs px-2 py-1 bg-white/20 backdrop-blur-sm border-white/30 text-white"
                    >
                      {type}
                    </Badge>
                  ))
                ) : (
                  <Badge
                    variant="outline"
                    className="text-xs px-2 py-1 bg-white/20 backdrop-blur-sm border-white/30 text-white"
                  >
                    {hotel.type}
                  </Badge>
                )}
              </div>

              {/* Guest Capacity */}
              <div className="flex items-center space-x-3 text-white/80">
                <div className="flex items-center space-x-1">
                  <Users className="w-3 h-3" />
                  <span className="text-xs">{hotel.adultCount} adults</span>
                </div>
                {hotel.childCount > 0 && (
                  <div className="flex items-center space-x-1">
                    <Users className="w-3 h-3" />
                    <span className="text-xs">{hotel.childCount} children</span>
                  </div>
                )}
              </div>
            </div>

            <div className={`${hotel.hasDynamicPricing ? 'bg-purple-600/40 hover:bg-purple-600/60' : 'bg-white/20 hover:bg-white/30'} backdrop-blur-sm rounded-lg px-3 py-1 transition-colors`}>
              <span className="text-sm font-semibold text-white">
                View Details
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default LatestDestinationCard;