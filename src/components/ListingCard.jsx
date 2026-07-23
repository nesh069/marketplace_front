import { Link } from "react-router-dom";

export default function ListingCard({ listing }) {
  return (
    <Link
      to={`/listings/${listing.id}`}
      className="block bg-white rounded-lg border border-navy-100 overflow-hidden hover:shadow-md transition"
    >
      <div className="aspect-square bg-navy-50 flex items-center justify-center">
        {listing.image ? (
          <img src={listing.image} alt={listing.title} className="w-full h-full object-cover" />
        ) : (
          <span className="text-navy-100 text-xs">No photo</span>
        )}
      </div>
      <div className="p-3">
        <h3 className="font-medium text-sm text-navy-700 truncate">{listing.title}</h3>
        <p className="font-display font-bold text-mustard-600 mt-1">
          KSh {Number(listing.price).toLocaleString()}
        </p>
        {listing.status === "sold" && (
          <span className="inline-block mt-1 text-xs bg-navy-100 text-navy-600 px-2 py-0.5 rounded">
            Sold
          </span>
        )}
      </div>
    </Link>
  );
}