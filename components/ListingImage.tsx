import React, { useEffect, useMemo, useState } from 'react';
import { Listing } from '../types';

const PLACEHOLDER_IMAGE =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="960" height="640" viewBox="0 0 960 640">
      <defs>
        <linearGradient id="bg" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stop-color="#f7f3ea"/>
          <stop offset="1" stop-color="#e9e2d3"/>
        </linearGradient>
      </defs>
      <rect width="960" height="640" fill="url(#bg)"/>
      <rect x="80" y="72" width="800" height="496" rx="28" fill="#fffaf0" stroke="#e0c889" stroke-width="3"/>
      <text x="480" y="300" text-anchor="middle" font-family="Arial, sans-serif" font-size="82" font-weight="800" fill="#d99b00">ADA</text>
      <text x="480" y="365" text-anchor="middle" font-family="Arial, sans-serif" font-size="42" font-weight="800" fill="#303642">EMLAK</text>
      <text x="480" y="420" text-anchor="middle" font-family="Arial, sans-serif" font-size="22" font-weight="700" letter-spacing="6" fill="#a68a54">GAYRİMENKUL YATIRIM DANIŞMANLIĞI</text>
    </svg>
  `);

const getLocalThumbUrls = (listingId?: string) => {
  if (!listingId) return [];
  const encodedListingId = encodeURIComponent(listingId);
  return [
    `${import.meta.env.BASE_URL}listing-thumbs/${encodedListingId}.webp`,
    `${import.meta.env.BASE_URL}listing-thumbs/${encodedListingId}.jpg`,
  ];
};

const unique = (values: Array<string | undefined | null>) =>
  values.filter((value): value is string => Boolean(value && value.trim())).filter((value, index, list) => list.indexOf(value) === index);

interface ListingImageProps extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'src'> {
  listing: Pick<Listing, 'id' | 'title' | 'imageUrls'>;
  source?: string;
  preferLocal?: boolean;
}

const ListingImage: React.FC<ListingImageProps> = ({ listing, source, preferLocal = false, alt, onError, ...props }) => {
  const candidates = useMemo(() => {
    const localThumbs = getLocalThumbUrls(listing.id);
    const remoteImages = listing.imageUrls || [];

    return unique(
      preferLocal
        ? [...localThumbs, source, ...remoteImages, PLACEHOLDER_IMAGE]
        : [source, ...localThumbs, ...remoteImages, PLACEHOLDER_IMAGE],
    );
  }, [listing.id, listing.imageUrls, preferLocal, source]);

  const [candidateIndex, setCandidateIndex] = useState(0);

  useEffect(() => {
    setCandidateIndex(0);
  }, [candidates]);

  const handleError = (event: React.SyntheticEvent<HTMLImageElement, Event>) => {
    onError?.(event);

    setCandidateIndex((currentIndex) => {
      const nextIndex = currentIndex + 1;
      return nextIndex < candidates.length ? nextIndex : currentIndex;
    });
  };

  return (
    <img
      {...props}
      src={candidates[candidateIndex] || PLACEHOLDER_IMAGE}
      alt={alt ?? listing.title}
      onError={handleError}
    />
  );
};

export default ListingImage;
