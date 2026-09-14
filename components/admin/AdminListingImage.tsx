import React, { useEffect, useState } from 'react';
import { Listing } from '../../types';

const PLACEHOLDER_IMAGE =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="320" height="210" viewBox="0 0 320 210">
      <rect width="320" height="210" fill="#f4f1ea"/>
      <rect x="28" y="28" width="264" height="154" rx="18" fill="#fffaf0" stroke="#e8d8b4"/>
      <text x="160" y="100" text-anchor="middle" font-family="Arial, sans-serif" font-size="26" font-weight="700" fill="#d99b00">ADA</text>
      <text x="160" y="128" text-anchor="middle" font-family="Arial, sans-serif" font-size="13" font-weight="700" fill="#6b7280">EMLAK</text>
    </svg>
  `);

const getLocalThumbUrl = (listingId: string) =>
  `${import.meta.env.BASE_URL}listing-thumbs/${encodeURIComponent(listingId)}.jpg`;

const getFallbackImageUrl = (listing: Listing) =>
  listing.imageUrls?.find((imageUrl) => Boolean(imageUrl)) || PLACEHOLDER_IMAGE;

interface AdminListingImageProps {
  listing: Listing;
  className: string;
  alt?: string;
}

const AdminListingImage: React.FC<AdminListingImageProps> = ({ listing, className, alt = '' }) => {
  const fallbackImageUrl = getFallbackImageUrl(listing);
  const preferredImageUrl = listing.id ? getLocalThumbUrl(listing.id) : fallbackImageUrl;
  const [imageUrl, setImageUrl] = useState(preferredImageUrl);
  const [fallbackUsed, setFallbackUsed] = useState(false);

  useEffect(() => {
    setImageUrl(preferredImageUrl);
    setFallbackUsed(false);
  }, [preferredImageUrl]);

  const handleImageError = () => {
    if (!fallbackUsed && fallbackImageUrl && imageUrl !== fallbackImageUrl) {
      setFallbackUsed(true);
      setImageUrl(fallbackImageUrl);
      return;
    }

    if (imageUrl !== PLACEHOLDER_IMAGE) {
      setImageUrl(PLACEHOLDER_IMAGE);
    }
  };

  return (
    <img
      src={imageUrl}
      alt={alt}
      className={className}
      loading="lazy"
      decoding="async"
      onError={handleImageError}
    />
  );
};

export default AdminListingImage;
