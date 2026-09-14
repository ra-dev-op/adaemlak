
import React, { useEffect, useMemo, useRef, useState } from 'react';
import 'leaflet/dist/leaflet.css';
import { getCities, getDistrictsByCityCode, getNeighbourhoodsByCityCodeAndDistrict } from 'turkey-neighbourhoods';
import { useData } from '../../context/DataContext';
import { Listing, ListingDetails } from '../../types';
import { EMPTY_LISTING_DETAILS, getPropertyFieldSet } from '../../config/propertyFields';
import RichTextEditor from './RichTextEditor';
import { buildListingPrice, formatPriceInput, parsePrice, PRICE_CURRENCY_OPTIONS, PriceCurrency } from '../../lib/price';
import AdminListingImage from './AdminListingImage';

const PORTFOLIO_GROUPS = [
    'KONUT',
    'LÜKS KONUT',
    'ARSA',
    'BİNA',
    'PLAZA',
    'FABRİKA',
    'DEPO-ANTREPO',
    'İŞ YERİ',
    'OTEL',
    'OFİS',
    'MAĞAZA',
    'VİLLA',
] as const;

const LISTING_TRANSACTION_OPTIONS = ['SATILIK', 'KİRALIK'] as const;

const deriveCategoryParts = (category = '') => {
    const normalized = category.toLocaleUpperCase('tr-TR');
    const transaction = LISTING_TRANSACTION_OPTIONS.find((item) => normalized.startsWith(item)) || 'SATILIK';
    const group = [...PORTFOLIO_GROUPS].sort((a, b) => b.length - a.length).find((item) => normalized.endsWith(item)) || 'KONUT';
    return { transaction, group };
};

const buildCategoryFromParts = (transaction: string, group: string) => `${transaction} ${group}`;

const CITY_OPTIONS = getCities();

const normalizeLocationName = (value: string = '') =>
    value
        .toLocaleLowerCase('tr-TR')
        .replace(/\s+/g, ' ')
        .trim();

const getCityCodeByName = (cityName: string = '') =>
    CITY_OPTIONS.find(city => normalizeLocationName(city.name) === normalizeLocationName(cityName))?.code;

const buildGoogleMapsEmbedUrl = (query: string = '') => {
    const normalizedQuery = query.trim();
    if (!normalizedQuery) {
        return '';
    }

    return `https://www.google.com/maps?q=${encodeURIComponent(normalizedQuery)}&z=15&output=embed`;
};

type MapCoordinates = {
    lat: number;
    lng: number;
};

const buildGoogleMapsEmbedUrlByCoords = (coords: MapCoordinates | null) => {
    if (!coords) {
        return '';
    }

    return `https://www.google.com/maps?q=${coords.lat},${coords.lng}&z=17&output=embed`;
};

const parseCoordsFromMapUrl = (mapUrl = ''): MapCoordinates | null => {
    if (!mapUrl) {
        return null;
    }

    try {
        const url = new URL(mapUrl);
        const query = url.searchParams.get('q') || '';
        const match = query.match(/^\s*(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)\s*$/);
        if (!match) {
            return null;
        }

        return {
            lat: Number(match[1]),
            lng: Number(match[2]),
        };
    } catch {
        return null;
    }
};

const geocodeAddress = async (query: string, signal?: AbortSignal): Promise<MapCoordinates | null> => {
    const normalized = query.trim();
    if (!normalized) {
        return null;
    }

    const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&countrycodes=tr&q=${encodeURIComponent(normalized)}`,
        {
            signal,
            headers: {
                'Accept-Language': 'tr',
            },
        },
    );

    if (!response.ok) {
        throw new Error('Geocoding failed');
    }

    const results = (await response.json()) as Array<{ lat: string; lon: string }>;
    if (!results.length) {
        return null;
    }

    return {
        lat: Number(results[0].lat),
        lng: Number(results[0].lon),
    };
};

const MapPicker: React.FC<{
    value: MapCoordinates | null;
    onChange: (coords: MapCoordinates) => void;
}> = ({ value, onChange }) => {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const mapRef = useRef<any>(null);
    const markerRef = useRef<any>(null);
    const onChangeRef = useRef(onChange);

    useEffect(() => {
        onChangeRef.current = onChange;
    }, [onChange]);

    useEffect(() => {
        let isCancelled = false;

        const setup = async () => {
            const L = await import('leaflet');
            if (isCancelled || !containerRef.current || mapRef.current) {
                return;
            }

            const markerIcon = L.divIcon({
                className: '',
                iconSize: [24, 24],
                iconAnchor: [12, 24],
                html: `
                    <div style="position:relative;width:24px;height:24px;">
                        <div style="position:absolute;inset:0;border-radius:9999px;background:#d4a017;border:3px solid rgba(255,255,255,0.95);box-shadow:0 8px 18px rgba(0,0,0,0.22);"></div>
                        <div style="position:absolute;left:50%;bottom:-7px;width:10px;height:10px;background:#d4a017;transform:translateX(-50%) rotate(45deg);border-right:3px solid rgba(255,255,255,0.95);border-bottom:3px solid rgba(255,255,255,0.95);"></div>
                    </div>
                `,
            });

            const initialCoords: [number, number] = value ? [value.lat, value.lng] : [39.0, 35.0];
            const initialZoom = value ? 16 : 6;

            const map = L.map(containerRef.current, {
                zoomControl: true,
                scrollWheelZoom: true,
            }).setView(initialCoords, initialZoom);

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; OpenStreetMap katkıcıları',
            }).addTo(map);

            map.on('click', (event: any) => {
                onChangeRef.current({
                    lat: Number(event.latlng.lat.toFixed(6)),
                    lng: Number(event.latlng.lng.toFixed(6)),
                });
            });

            mapRef.current = map;
            markerRef.current = L.marker(initialCoords, { icon: markerIcon }).addTo(map);

            window.setTimeout(() => {
                map.invalidateSize();
            }, 60);
        };

        void setup();

        return () => {
            isCancelled = true;
            if (mapRef.current) {
                mapRef.current.remove();
                mapRef.current = null;
                markerRef.current = null;
            }
        };
    }, []);

    useEffect(() => {
        const syncMarker = async () => {
            if (!mapRef.current || !containerRef.current) {
                return;
            }

            const L = await import('leaflet');

            if (!value) {
                if (markerRef.current) {
                    mapRef.current.removeLayer(markerRef.current);
                    markerRef.current = null;
                }
                mapRef.current.setView([39.0, 35.0], 6);
                return;
            }

            const nextLatLng: [number, number] = [value.lat, value.lng];

            if (!markerRef.current) {
                const markerIcon = L.divIcon({
                    className: '',
                    iconSize: [24, 24],
                    iconAnchor: [12, 24],
                    html: `
                        <div style="position:relative;width:24px;height:24px;">
                            <div style="position:absolute;inset:0;border-radius:9999px;background:#d4a017;border:3px solid rgba(255,255,255,0.95);box-shadow:0 8px 18px rgba(0,0,0,0.22);"></div>
                            <div style="position:absolute;left:50%;bottom:-7px;width:10px;height:10px;background:#d4a017;transform:translateX(-50%) rotate(45deg);border-right:3px solid rgba(255,255,255,0.95);border-bottom:3px solid rgba(255,255,255,0.95);"></div>
                        </div>
                    `,
                });
                markerRef.current = L.marker(nextLatLng, { icon: markerIcon }).addTo(mapRef.current);
            } else {
                markerRef.current.setLatLng(nextLatLng);
            }

            mapRef.current.setView(nextLatLng, Math.max(mapRef.current.getZoom(), 16), { animate: true });
        };

        void syncMarker();
    }, [value]);

    return <div ref={containerRef} className="h-[320px] w-full" />;
};

interface AdminFieldProps {
    label: string;
    value?: string;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
}

const FormInput: React.FC<AdminFieldProps> = ({ label, value, onChange, placeholder }) => (
    <div>
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">{label}</label>
        <input
            type="text"
            className="w-full bg-white border border-gray-300 rounded-md p-2.5 text-sm text-gray-900 focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20 outline-none transition-all placeholder-gray-400"
            value={value || ''}
            onChange={onChange}
            placeholder={placeholder}
        />
    </div>
);

interface AdminSelectProps {
    label: string;
    value?: string;
    onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
    options: string[];
    placeholder?: string;
    disabled?: boolean;
}

const FormSelect: React.FC<AdminSelectProps> = ({
    label,
    value,
    onChange,
    options,
    placeholder = 'Seçiniz',
    disabled = false,
}) => (
    <div>
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">{label}</label>
        <div className="relative">
            <select
                className="w-full appearance-none rounded-md border border-gray-300 bg-white p-2.5 pr-9 text-sm text-gray-900 outline-none transition-all focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-400"
                value={value || ''}
                onChange={onChange}
                disabled={disabled}
            >
                <option value="">{placeholder}</option>
                {options.map((option) => (
                    <option key={option} value={option}>{option}</option>
                ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
            </div>
        </div>
    </div>
);

interface PriceInputProps {
    amount?: string;
    currency?: string;
    onAmountChange: (value: string) => void;
    onCurrencyChange: (value: string) => void;
}

const PriceInput: React.FC<PriceInputProps> = ({ amount, currency, onAmountChange, onCurrencyChange }) => (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-[minmax(0,1fr)_220px]">
        <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Fiyat</label>
            <input
                type="text"
                inputMode="numeric"
                className="w-full bg-white border border-gray-300 rounded-md p-2.5 text-sm text-gray-900 focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20 outline-none transition-all placeholder-gray-400"
                value={amount || ''}
                onChange={(event) => onAmountChange(formatPriceInput(event.target.value))}
                placeholder="Örn: 5.000.000"
            />
            <p className="mt-1 text-[11px] text-gray-500">Rakam yazdıkça fiyat Türk Lirası ayırımıyla biçimlenir.</p>
        </div>
        <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Para Birimi</label>
            <div className="relative">
                <select
                    className="w-full appearance-none rounded-md border border-gray-300 bg-white p-2.5 pr-9 text-sm text-gray-900 outline-none transition-all focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20"
                    value={currency || 'TL'}
                    onChange={(event) => onCurrencyChange(event.target.value)}
                >
                    {PRICE_CURRENCY_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                    <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                </div>
            </div>
            <p className="mt-1 text-[11px] text-gray-500">TL, Dolar, Euro ve Sterlin desteklenir.</p>
        </div>
    </div>
);

// Sub-component for the Homepage Order Cell
const HomepageCell: React.FC<{ listing: Listing, onUpdate: (id: string, featured: boolean, order: number | null) => void }> = ({ listing, onUpdate }) => {
    const isFeatured = listing.homepage_featured || false;
    const order = listing.homepage_order || 1;

    return (
        <div className="mx-auto flex w-full max-w-[190px] items-center justify-center gap-2">
            {isFeatured ? (
                <>
                    <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-green-200 bg-green-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-green-700">
                        <span className="h-1.5 w-1.5 rounded-full bg-green-500"></span>
                        Vitrin {order}
                    </span>
                    <select
                        value={order}
                        onChange={(event) => onUpdate(listing.id, true, Number(event.target.value))}
                        className="min-w-[74px] rounded-full border border-gray-200 bg-white px-2.5 py-1 text-center text-[10px] font-bold uppercase tracking-[0.08em] text-gray-700 outline-none transition-all focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20"
                    >
                        {Array.from({ length: 10 }, (_, index) => index + 1).map((slot) => (
                            <option key={slot} value={slot}>
                                {slot}. sıra
                            </option>
                        ))}
                    </select>
                    <button
                        type="button"
                        onClick={() => onUpdate(listing.id, false, null)}
                        className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                        title="Vitrinden Çıkar"
                    >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.9}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14" />
                        </svg>
                    </button>
                </>
            ) : (
                <button
                    type="button"
                    onClick={() => onUpdate(listing.id, true, null)}
                    className="inline-flex items-center gap-1.5 rounded-full border border-gold-200 bg-gold-50 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-gold-700 transition-all hover:border-gold-500 hover:bg-gold-500 hover:text-white hover:shadow-sm"
                >
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                    Vitrine Al
                </button>
            )}
        </div>
    );
};

interface AdminListingsProps {
  initialStatus?: 'all' | 'active' | 'archived';
}

const AdminListings: React.FC<AdminListingsProps> = ({ initialStatus = 'active' }) => {
  const { listings, addListing, updateListing, deleteListing, updateHomepageOrder } = useData();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'archived'>(initialStatus);
  
  // New State for handling local files and processed images
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [mapAddress, setMapAddress] = useState('');
  const [selectedCoordinates, setSelectedCoordinates] = useState<MapCoordinates | null>(null);
  const [isLocatingAddress, setIsLocatingAddress] = useState(false);
  const [mapLookupMessage, setMapLookupMessage] = useState('');

  // Default Details
  const defaultDetails: ListingDetails = EMPTY_LISTING_DETAILS;

  // Form State
  const initialFormState: Partial<Listing> = {
    type: '',
    title: '',
    description: '',
    location: '',
    price: '',
    priceCurrency: 'TL',
    mapUrl: '',
    mapLat: undefined,
    mapLng: undefined,
    category: 'SATILIK KONUT',
    status: 'active',
    homepage_featured: false,
    homepage_order: undefined,
    details: defaultDetails
  };

  const [formData, setFormData] = useState<Partial<Listing>>(initialFormState);
  const selectedCategoryParts = useMemo(
      () => deriveCategoryParts(formData.category || initialFormState.category || 'SATILIK KONUT'),
      [formData.category],
  );
  const selectedCityCode = useMemo(() => getCityCodeByName(formData.details?.city || ''), [formData.details?.city]);
  const districtOptions = useMemo(() => (selectedCityCode ? getDistrictsByCityCode(selectedCityCode) : []), [selectedCityCode]);
  const neighborhoodOptions = useMemo(
      () => (selectedCityCode && formData.details?.district
          ? getNeighbourhoodsByCityCodeAndDistrict(selectedCityCode, formData.details.district)
          : []),
      [selectedCityCode, formData.details?.district],
  );
  const propertyFields = useMemo(
      () => getPropertyFieldSet(formData.category || '', formData.type || ''),
      [formData.category, formData.type],
  );
  const detailFields = useMemo(
      () => propertyFields.filter((field) => !['city', 'district', 'neighborhood'].includes(field.key)),
      [propertyFields],
  );
  const effectiveMapQuery = useMemo(() => {
      if (mapAddress.trim()) {
          return mapAddress.trim();
      }

      const addressParts = [
          formData.details?.neighborhood,
          formData.details?.district,
          formData.details?.city,
      ].filter(Boolean);

      if (addressParts.length === 0) {
          return '';
      }

      return addressParts.join(', ');
  }, [formData.details?.city, formData.details?.district, formData.details?.neighborhood, mapAddress]);
  const mapPreviewUrl = useMemo(
      () => buildGoogleMapsEmbedUrlByCoords(selectedCoordinates) || buildGoogleMapsEmbedUrl(effectiveMapQuery),
      [effectiveMapQuery, selectedCoordinates],
  );

  useEffect(() => {
      setFilterStatus(initialStatus);
      setShowForm(false);
      setEditingId(null);
  }, [initialStatus]);

  useEffect(() => {
      setFormData(prev => ({
          ...prev,
          mapUrl: mapPreviewUrl,
          mapLat: selectedCoordinates?.lat,
          mapLng: selectedCoordinates?.lng,
      }));
  }, [mapPreviewUrl, selectedCoordinates]);

  useEffect(() => {
      if (!effectiveMapQuery) {
          setSelectedCoordinates(null);
          setMapLookupMessage('');
          setIsLocatingAddress(false);
          return;
      }

      const controller = new AbortController();
      const timeoutId = window.setTimeout(async () => {
          try {
              setIsLocatingAddress(true);
              const coords = await geocodeAddress(effectiveMapQuery, controller.signal);
              if (coords) {
                  setSelectedCoordinates(coords);
                  setMapLookupMessage('Adres bulundu. İsterseniz haritada tıklayarak pini düzeltebilirsiniz.');
              } else {
                  setSelectedCoordinates(null);
                  setMapLookupMessage('Adres bulundu gibi görünmüyor. Haritada elle pin seçebilirsiniz.');
              }
          } catch (error) {
              if ((error as Error).name !== 'AbortError') {
                  setSelectedCoordinates(null);
                  setMapLookupMessage('Adres şu an otomatik bulunamadı. Haritada manuel konum seçebilirsiniz.');
              }
          } finally {
              setIsLocatingAddress(false);
          }
      }, 650);

      return () => {
          controller.abort();
          window.clearTimeout(timeoutId);
      };
  }, [effectiveMapQuery]);

  const handleEdit = (listing: Listing) => {
    const parsedPrice = parsePrice(listing.price || '');
    const parsedCoords = (typeof listing.mapLat === 'number' && typeof listing.mapLng === 'number')
        ? { lat: listing.mapLat, lng: listing.mapLng }
        : parseCoordsFromMapUrl(listing.mapUrl || '');
    setFormData({
        ...listing,
        price: parsedPrice.amount,
        priceCurrency: listing.priceCurrency || parsedPrice.currency,
        details: {
            ...defaultDetails,
            ...(listing.details || {}),
        }
    });
    setMapAddress([
        listing.details?.neighborhood,
        listing.details?.district,
        listing.details?.city,
    ].filter(Boolean).join(', ') || '');
    setSelectedCoordinates(parsedCoords);
    setMapLookupMessage(parsedCoords ? 'Kayıtlı pin yüklendi. İsterseniz haritada değiştirin.' : '');
    setUploadedImages(listing.imageUrls || []);
    setEditingId(listing.id);
    setShowForm(true);
  };

  const handleArchive = (listing: Listing) => {
    const isArchived = listing.status === 'archived';
    const nextListing: Listing = isArchived
        ? { ...listing, status: 'active' }
        : {
            ...listing,
            status: 'archived',
            homepage_featured: false,
            homepage_order: undefined,
        };

    updateListing(nextListing);
    setFilterStatus(isArchived ? 'active' : 'archived');
  };

  const handleFormArchiveToggle = () => {
      if (!editingId) return;

      const currentListing = listings.find((listing) => listing.id === editingId);
      if (!currentListing) return;

      handleArchive(currentListing);
      handleCancel();
  };

  // NOTE: New Homepage logic is now handled inside HomepageCell component which calls updateHomepageOrder directly

  const handleCancel = () => {
      setShowForm(false);
      setEditingId(null);
      setFormData(initialFormState);
      setUploadedImages([]);
      setMapAddress('');
      setSelectedCoordinates(null);
      setMapLookupMessage('');
      setIsLocatingAddress(false);
  };

  // Process image to add a single matte diagonal watermark
  const processImageWithBanner = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                if (!ctx) return reject('Canvas error');

                canvas.width = img.width;
                canvas.height = img.height;

                // 1. Draw Original Image
                ctx.drawImage(img, 0, 0);

                // Single diagonal matte watermark for uploaded listing images
                const watermarkFontSize = Math.max(
                    32,
                    Math.min(img.width / 7.5, img.height / 2.9),
                );
                ctx.save();
                ctx.translate(img.width / 2, img.height / 2);
                ctx.rotate((-28 * Math.PI) / 180);
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.font = `700 ${watermarkFontSize}px Montserrat, Arial, sans-serif`;
                ctx.fillStyle = 'rgba(255, 255, 255, 0.14)';
                ctx.fillText('ADA EMLAK', 0, 0);
                ctx.restore();

                resolve(canvas.toDataURL('image/jpeg', 0.90));
            };
            img.src = e.target?.result as string;
        };
        reader.readAsDataURL(file);
    });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
        setIsProcessing(true);
        const files: File[] = Array.from(e.target.files);
        const remainingSlots = 20 - uploadedImages.length;
        
        if (files.length > remainingSlots) {
            alert(`En fazla 20 resim yükleyebilirsiniz. Kalan hakkınız: ${remainingSlots}`);
            setIsProcessing(false);
            return;
        }

        const newImages: string[] = [];
        for (const file of files) {
            try {
                const processed = await processImageWithBanner(file);
                newImages.push(processed);
            } catch (error) {
                console.error("Image processing failed", error);
            }
        }

        setUploadedImages(prev => [...prev, ...newImages]);
        setIsProcessing(false);
    }
  };

  const removeImage = (index: number) => {
      setUploadedImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleDetailChange = (field: keyof ListingDetails, value: string) => {
      setFormData(prev => ({
          ...prev,
          details: {
              ...(prev.details || defaultDetails),
              [field]: value
          }
      }));
  };

  const handleCityChange = (city: string) => {
      setFormData(prev => ({
          ...prev,
          details: {
              ...(prev.details || defaultDetails),
              city,
              district: '',
              neighborhood: '',
          }
      }));
  };

  const handleDistrictChange = (district: string) => {
      setFormData(prev => ({
          ...prev,
          details: {
              ...(prev.details || defaultDetails),
              district,
              neighborhood: '',
          }
      }));
  };

  const handleCategoryGroupChange = (group: string) => {
      setFormData(prev => ({
          ...prev,
          category: buildCategoryFromParts(selectedCategoryParts.transaction, group),
      }));
  };

  const handleTransactionChange = (transaction: string) => {
      setFormData(prev => ({
          ...prev,
          category: buildCategoryFromParts(transaction, selectedCategoryParts.group),
      }));
  };

  const handleMapAddressChange = (value: string) => {
      setMapAddress(value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.price) return alert('Lütfen zorunlu alanları doldurun.');
    if (uploadedImages.length === 0) return alert('Lütfen en az bir resim yükleyin.');

    let finalLocation = formData.location;
    if (formData.details?.city && formData.details?.district) {
        finalLocation = `${formData.details.district} / ${formData.details.city.toUpperCase()}`;
    }

    const submissionData = {
        ...formData,
        price: buildListingPrice(formData.price || '', (formData.priceCurrency as PriceCurrency) || 'TL'),
        priceCurrency: (formData.priceCurrency as PriceCurrency) || 'TL',
        location: finalLocation || formData.location || '',
        imageUrls: uploadedImages,
    };

    if (editingId) {
        // Update Existing
        const updatedListing: Listing = {
            ...submissionData as Listing,
            id: editingId,
            updateDate: new Date().toLocaleDateString('tr-TR'),
        };
        updateListing(updatedListing);
        // Ensure Homepage Order logic is preserved or re-evaluated
        if (updatedListing.homepage_featured) {
             updateHomepageOrder(updatedListing.id, true, updatedListing.homepage_order || null);
        }
    } else {
        // Add New
        const newListing: Listing = {
            id: Date.now().toString(),
            ilanNo: `ADA-${Math.floor(Math.random() * 1000)}`,
            updateDate: new Date().toLocaleDateString('tr-TR'),
            createdDate: new Date().toISOString(),
            type: formData.type || 'Satılık',
            title: formData.title || '',
            description: formData.description || '',
            location: submissionData.location,
            price: buildListingPrice(formData.price || '', (formData.priceCurrency as PriceCurrency) || 'TL'),
            priceCurrency: (formData.priceCurrency as PriceCurrency) || 'TL',
            imageUrls: uploadedImages,
            mapUrl: formData.mapUrl || '',
            mapLat: selectedCoordinates?.lat,
            mapLng: selectedCoordinates?.lng,
            category: formData.category || buildCategoryFromParts(selectedCategoryParts.transaction, selectedCategoryParts.group),
            status: 'active',
            homepage_featured: formData.homepage_featured || false,
            homepage_order: formData.homepage_order || undefined,
            details: {
                ...defaultDetails,
                ...(formData.details || {}),
            }
        };
        addListing(newListing);
        if (newListing.homepage_featured) {
            updateHomepageOrder(newListing.id, true, newListing.homepage_order || null);
        }
    }

    handleCancel();
  };

  const filteredListings = listings.filter(l => {
      if (filterStatus === 'all') return true;
      return (l.status || 'active') === filterStatus;
  });
  const activeListingsCount = listings.filter(l => (l.status || 'active') === 'active').length;
  const archivedListingsCount = listings.filter(l => l.status === 'archived').length;
  const isArchivePage = initialStatus === 'archived';

  return (
    <div>
        <div className="flex justify-between items-end mb-8">
            <div>
                <h1 className="text-2xl font-bold text-gray-900 tracking-tight">{isArchivePage ? 'İlan Arşivi' : 'İlan Yönetimi'}</h1>
                <p className="text-gray-500 text-sm mt-1">
                    {isArchivePage
                        ? 'Yayından alınan ilanlar burada silinmeden saklanır ve ilan içine girilerek tekrar yayına alınabilir.'
                        : 'Portföyünüzdeki ilanları ekleyin, düzenleyin veya ilan içine girerek yayından alın.'}
                </p>
            </div>
            <button 
                onClick={() => {
                    handleCancel();
                    setShowForm(!showForm);
                }} 
                className={`px-5 py-2.5 rounded-md text-sm font-bold uppercase tracking-wide transition-all shadow-sm flex items-center gap-2 ${showForm ? 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50' : 'bg-gold-500 hover:bg-gold-600 text-white hover:shadow-md'}`}
            >
                {showForm ? (
                    <>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                    Listeye Dön
                    </>
                ) : (
                    <>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                    Yeni İlan Ekle
                    </>
                )}
            </button>
        </div>

        {showForm ? (
            <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 max-w-5xl mx-auto">
                {/* FORM CONTENT (Identical to previous implementation, reusing the logic) */}
                <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-6">
                    <h2 className="text-lg font-bold text-gray-800">{editingId ? 'İlanı Düzenle' : 'Yeni İlan Ekle'}</h2>
                    <span className="text-xs text-gray-400 font-medium bg-gray-50 px-2 py-1 rounded">ID: {editingId || 'New'}</span>
                </div>

                {editingId && (
                    <div className={`mb-6 rounded-2xl border px-5 py-4 ${formData.status === 'archived' ? 'border-gray-200 bg-gray-50' : 'border-green-100 bg-green-50/70'}`}>
                        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                            <div>
                                <div className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-gray-500">Yayın Durumu</div>
                                <div className="mt-1 flex flex-wrap items-center gap-2">
                                    {(formData.status || 'active') === 'active' ? (
                                        <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-xs font-extrabold uppercase tracking-[0.12em] text-green-700 ring-1 ring-green-100">
                                            <span className="h-1.5 w-1.5 rounded-full bg-green-500"></span>
                                            Bu ilan yayında
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-xs font-extrabold uppercase tracking-[0.12em] text-gray-700 ring-1 ring-gray-200">
                                            <span className="h-1.5 w-1.5 rounded-full bg-gray-400"></span>
                                            Bu ilan arşivde
                                        </span>
                                    )}
                                    <span className="text-sm font-semibold text-gray-600">
                                        {(formData.status || 'active') === 'active'
                                            ? 'Yayından alırsanız sitede görünmez, arşive taşınır.'
                                            : 'Yayına alırsanız ilan tekrar sitede görünür.'}
                                    </span>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={handleFormArchiveToggle}
                                className={`inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-extrabold uppercase tracking-[0.12em] transition-all ${formData.status === 'archived' ? 'bg-green-600 text-white hover:bg-green-700' : 'bg-orange-600 text-white hover:bg-orange-700'}`}
                            >
                                {formData.status === 'archived' ? (
                                    <>
                                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.9}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                        Yayına Al
                                    </>
                                ) : (
                                    <>
                                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.9}><path strokeLinecap="round" strokeLinejoin="round" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" /></svg>
                                        Yayından Al
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                )}
                
                <form onSubmit={handleSubmit} className="space-y-8">
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <FormSelect
                            label="Portföy Grubu"
                            value={selectedCategoryParts.group}
                            onChange={(e: any) => handleCategoryGroupChange(e.target.value)}
                            options={[...PORTFOLIO_GROUPS]}
                            placeholder="Grup seçiniz"
                        />
                        <FormSelect
                            label="İlan Türü"
                            value={selectedCategoryParts.transaction}
                            onChange={(e: any) => handleTransactionChange(e.target.value)}
                            options={[...LISTING_TRANSACTION_OPTIONS]}
                            placeholder="Tür seçiniz"
                        />
                        <FormInput 
                            label="İlan Tipi (Başlık Üstü)" 
                            value={formData.type} 
                            onChange={(e: any) => setFormData({...formData, type: e.target.value})}
                            placeholder="Örn: Yatırımlık Arsa" 
                        />
                    </div>

                    <div className="rounded-lg border border-dashed border-gold-200 bg-gold-50/50 px-4 py-3 text-sm font-semibold text-gold-800">
                        Seçili kategori: {formData.category}
                    </div>

                    <FormInput 
                        label="İlan Başlığı" 
                        value={formData.title} 
                        onChange={(e: any) => setFormData({...formData, title: e.target.value})}
                        placeholder="İlan Başlığı Giriniz" 
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <PriceInput
                            amount={formData.price}
                            currency={formData.priceCurrency}
                            onAmountChange={(price) => setFormData({ ...formData, price })}
                            onCurrencyChange={(priceCurrency) => setFormData({ ...formData, priceCurrency: priceCurrency as PriceCurrency })}
                        />
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                                İlan Resimleri (Max 20)
                            </label>
                            <div className="relative">
                                <input 
                                    type="file" 
                                    multiple 
                                    accept="image/*"
                                    onChange={handleFileUpload}
                                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-md file:border-0 file:text-xs file:font-bold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200 cursor-pointer border border-gray-300 rounded-md"
                                    disabled={isProcessing || uploadedImages.length >= 20}
                                />
                                {isProcessing && <span className="text-xs text-gold-500 font-bold absolute right-2 top-3">İşleniyor...</span>}
                            </div>
                        </div>
                    </div>

                    <div>
                        <FormInput
                            label="Adres / Harita Araması"
                            value={mapAddress}
                            onChange={(e: any) => handleMapAddressChange(e.target.value)}
                            placeholder="Örn: Harmandere Mah., Pendik, İstanbul"
                        />
                        <p className="mt-2 text-xs text-gray-500">
                            Adresi yazınca konum otomatik bulunur. İsterseniz harita üzerinde tıklayarak pini tam noktaya taşıyabilirsiniz.
                        </p>
                        {isLocatingAddress ? (
                            <div className="mt-2 rounded-md border border-sky-100 bg-sky-50 px-3 py-2 text-xs font-medium text-sky-700">
                                Adres aranıyor, harita hazırlanıyor...
                            </div>
                        ) : mapLookupMessage ? (
                            <div className="mt-2 rounded-md border border-green-100 bg-green-50 px-3 py-2 text-xs font-medium text-green-700">
                                {mapLookupMessage}
                            </div>
                        ) : (
                            <div className="mt-2 rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-xs text-gray-500">
                                Adres girildiğinde konum otomatik bulunur.
                            </div>
                        )}
                        {(mapPreviewUrl || effectiveMapQuery) && (
                            <div className="mt-4 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                                <div className="flex items-center justify-between border-b border-gray-100 bg-gray-50 px-4 py-2">
                                    <div className="text-xs font-semibold uppercase tracking-[0.14em] text-gray-500">
                                        Konum Seçici
                                    </div>
                                    {selectedCoordinates && (
                                        <div className="text-[11px] font-medium text-gray-500">
                                            {selectedCoordinates.lat.toFixed(6)}, {selectedCoordinates.lng.toFixed(6)}
                                        </div>
                                    )}
                                </div>
                                <div className="h-[320px] w-full bg-gray-100">
                                    <MapPicker
                                        value={selectedCoordinates}
                                        onChange={(coords) => {
                                            setSelectedCoordinates(coords);
                                            setMapLookupMessage('Pin manuel olarak güncellendi. Bu konum kaydedilecek.');
                                        }}
                                    />
                                </div>
                                <div className="border-t border-gray-100 bg-gray-50 px-4 py-3 text-xs text-gray-500">
                                    Harita üzerinde istediğiniz noktaya tıklayarak tam konumu seçebilirsiniz.
                                </div>
                            </div>
                        )}
                    </div>

                    {uploadedImages.length > 0 && (
                        <div className="bg-gray-50 p-5 rounded-md border border-gray-200/60">
                             <h4 className="text-xs font-bold text-gray-600 mb-3 uppercase">Yüklenen Resimler ({uploadedImages.length}/20)</h4>
                             <div className="grid grid-cols-4 md:grid-cols-6 gap-3">
                                {uploadedImages.map((img, idx) => (
                                    <div key={idx} className="relative group aspect-[4/3] bg-white border border-gray-200 rounded-md overflow-hidden shadow-sm">
                                        <img src={img} alt={`Upload ${idx}`} className="w-full h-full object-cover" />
                                        <button 
                                            type="button" 
                                            onClick={() => removeImage(idx)}
                                            className="absolute top-1 right-1 bg-red-500 text-white w-6 h-6 flex items-center justify-center rounded-full text-xs hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
                                        >
                                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                                        </button>
                                        {idx === 0 && <span className="absolute bottom-0 left-0 right-0 bg-gold-500/90 backdrop-blur-sm text-white text-[9px] font-bold text-center py-1">KAPAK</span>}
                                    </div>
                                ))}
                             </div>
                        </div>
                    )}

                    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                        <div className="bg-gray-50/50 px-6 py-4 border-b border-gray-100">
                             <h3 className="text-sm font-bold text-gray-800 flex items-center">
                                <div className="w-1.5 h-1.5 bg-gold-500 rounded-full mr-2"></div>
                                Özellikler & Konum Detayları
                            </h3>
                        </div>
                        <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                            <FormSelect
                                label="İl"
                                value={formData.details?.city}
                                onChange={(e: any) => handleCityChange(e.target.value)}
                                options={CITY_OPTIONS.map(city => city.name)}
                                placeholder="İl seçiniz"
                            />
                            <FormSelect
                                label="İlçe"
                                value={formData.details?.district}
                                onChange={(e: any) => handleDistrictChange(e.target.value)}
                                options={districtOptions}
                                placeholder={selectedCityCode ? 'İlçe seçiniz' : 'Önce il seçiniz'}
                                disabled={!selectedCityCode}
                            />
                            <FormSelect
                                label="Mahalle"
                                value={formData.details?.neighborhood}
                                onChange={(e: any) => handleDetailChange('neighborhood', e.target.value)}
                                options={neighborhoodOptions}
                                placeholder={formData.details?.district ? 'Mahalle seçiniz' : 'Önce ilçe seçiniz'}
                                disabled={!formData.details?.district}
                            />
                            {detailFields.map((field) =>
                                field.kind === 'select' ? (
                                    <FormSelect
                                        key={field.key}
                                        label={field.label}
                                        value={formData.details?.[field.key] as string}
                                        onChange={(e: any) => handleDetailChange(field.key, e.target.value)}
                                        options={field.options || []}
                                        placeholder={`${field.label} seçiniz`}
                                    />
                                ) : (
                                    <FormInput
                                        key={field.key}
                                        label={field.label}
                                        value={formData.details?.[field.key] as string}
                                        onChange={(e: any) => handleDetailChange(field.key, e.target.value)}
                                        placeholder={field.placeholder}
                                    />
                                ),
                            )}
                        </div>
                    </div>

                    <RichTextEditor
                        label="Açıklama"
                        value={formData.description}
                        onChange={(description) => setFormData({ ...formData, description })}
                        placeholder="İlan detaylarını satır satır, başlıklarla ve renk vurgularıyla yazabilirsiniz."
                    />

                    <div className="flex gap-4 pt-4 border-t border-gray-100 justify-end">
                        <button type="button" onClick={handleCancel} className="px-6 py-2.5 bg-white border border-gray-300 text-gray-700 font-bold rounded-md hover:bg-gray-50 transition-colors text-sm">İPTAL</button>
                        <button type="submit" className="px-8 py-2.5 bg-gold-500 text-white font-bold rounded-md hover:bg-gold-600 transition-all shadow-sm hover:shadow text-sm">{editingId ? 'GÜNCELLE' : 'KAYDET'}</button>
                    </div>
                </form>
            </div>
        ) : (
            <>
                {/* Filter Tabs */}
                <div className="mb-6 flex flex-wrap gap-2">
                    <button onClick={() => setFilterStatus('active')} className={`px-4 py-2 text-xs font-bold uppercase tracking-wide rounded-full transition-all ${filterStatus === 'active' ? 'bg-gold-500 text-white shadow-md' : 'bg-white text-gray-500 hover:bg-gray-50 border border-gray-200'}`}>Yayındakiler ({activeListingsCount})</button>
                    <button onClick={() => setFilterStatus('archived')} className={`px-4 py-2 text-xs font-bold uppercase tracking-wide rounded-full transition-all ${filterStatus === 'archived' ? 'bg-gray-800 text-white shadow-md' : 'bg-white text-gray-500 hover:bg-gray-50 border border-gray-200'}`}>Yayından Alınanlar ({archivedListingsCount})</button>
                    <button onClick={() => setFilterStatus('all')} className={`px-4 py-2 text-xs font-bold uppercase tracking-wide rounded-full transition-all ${filterStatus === 'all' ? 'bg-blue-600 text-white shadow-md' : 'bg-white text-gray-500 hover:bg-gray-50 border border-gray-200'}`}>Tümü ({listings.length})</button>
                    <div className="basis-full pt-1 text-xs font-semibold text-gray-500">
                        Yayından alma işlemi için ilanı “Düzenle” ile açın; ilan silinmeden arşivde tutulur ve gerektiğinde tekrar yayına alınabilir.
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200/60 overflow-hidden">
                    <div className="overflow-x-auto">
                    <table className="w-full min-w-[1040px] text-sm text-left text-gray-500">
                        <thead className="text-xs text-gray-500 uppercase bg-gray-50/50 border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4 font-semibold tracking-wider">Resim</th>
                                <th className="px-6 py-4 font-semibold tracking-wider">İlan No</th>
                                <th className="px-6 py-4 font-semibold tracking-wider">Başlık</th>
                                <th className="px-6 py-4 font-semibold tracking-wider">Kategori</th>
                                <th className="px-6 py-4 font-semibold tracking-wider">Durum</th>
                                <th className="px-6 py-4 font-semibold tracking-wider text-center w-36">Ana Sayfa</th>
                                <th className="px-6 py-4 font-semibold tracking-wider text-right">İşlemler</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredListings.length === 0 ? (
                                <tr><td colSpan={7} className="text-center py-10 text-gray-400">Bu kategoride ilan bulunamadı.</td></tr>
                            ) : filteredListings.map(l => (
                                <tr key={l.id} className={`bg-white hover:bg-gray-50/80 transition-colors ${(l.status === 'archived') ? 'opacity-60 bg-gray-50' : ''}`}>
                                    <td className="px-6 py-4">
                                        <AdminListingImage listing={l} className="w-16 h-12 object-cover rounded-md border border-gray-200 shadow-sm" />
                                    </td>
                                    <td className="px-6 py-4 font-mono text-xs font-bold text-gray-600">{l.ilanNo}</td>
                                    <td className="px-6 py-4 font-medium text-gray-900 max-w-xs truncate" title={l.title}>{l.title}</td>
                                    <td className="px-6 py-4 text-xs font-bold uppercase tracking-wide text-gray-500">{l.category}</td>
                                    <td className="px-6 py-4">
                                        {(l.status || 'active') === 'active' ? (
                                            <span className="inline-flex items-center gap-1.5 rounded-full border border-green-100 bg-green-50 px-3 py-1 text-[11px] font-extrabold uppercase tracking-[0.12em] text-green-700">
                                                <span className="h-1.5 w-1.5 rounded-full bg-green-500"></span>
                                                Yayında
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-gray-100 px-3 py-1 text-[11px] font-extrabold uppercase tracking-[0.12em] text-gray-600">
                                                <span className="h-1.5 w-1.5 rounded-full bg-gray-400"></span>
                                                Yayından Alındı
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-4 py-4 text-center align-middle">
                                        {l.status === 'active' ? (
                                            <HomepageCell listing={l} onUpdate={updateHomepageOrder} />
                                        ) : (
                                            <span className="text-gray-300 text-xs">-</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex flex-wrap justify-end gap-2">
                                            <button 
                                                onClick={() => handleEdit(l)} 
                                                className="text-gray-400 hover:text-blue-600 p-1.5 hover:bg-blue-50 rounded transition-colors"
                                                title="Düzenle"
                                            >
                                                 <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                            </button>
                                            <button 
                                                onClick={() => { if(window.confirm('Bu ilanı silmek istediğinize emin misiniz?')) deleteListing(l.id) }} 
                                                className="text-gray-400 hover:text-red-600 p-1.5 hover:bg-red-50 rounded transition-colors"
                                                title="Sil"
                                            >
                                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    </div>
                </div>
            </>
        )}
    </div>
  );
};

export default AdminListings;
