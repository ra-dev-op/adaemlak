import React, { createContext, useContext, useEffect, useMemo, useRef, useState, ReactNode } from 'react';
import {
  AdSettings,
  AdminState,
  GeneralSettings,
  GoogleSettings,
  Listing,
  ListingAnalytics,
  Message,
  NewsItem,
  PublicBootstrap,
  SeoSettings,
  SidebarListing,
} from '../types';
import { MAIN_LISTINGS, NEWS_ITEMS } from '../constants';
import { DEFAULT_GENERAL_SETTINGS, DEFAULT_SEO_SETTINGS } from '../config/siteDefaults';
import { fetchAdminBootstrap, fetchPublicBootstrap, persistAdminState, submitContactMessage } from '../lib/api';
import { isAdminAuthenticated } from '../config/adminAuth';

interface DataContextType {
  listings: Listing[];
  featuredListings: Listing[];
  recentListings: SidebarListing[];
  sidebarListings: SidebarListing[];
  news: NewsItem[];
  messages: Message[];
  googleSettings: GoogleSettings;
  seoSettings: SeoSettings;
  generalSettings: GeneralSettings;
  listingAnalytics: ListingAnalytics[];
  adSettings: AdSettings;
  addListing: (listing: Listing) => void;
  updateListing: (listing: Listing) => void;
  deleteListing: (id: string) => void;
  updateHomepageOrder: (id: string, featured: boolean, order: number | null) => void;
  addNews: (newsItem: NewsItem) => void;
  deleteNews: (id: string) => void;
  addMessage: (message: Message) => void;
  deleteMessage: (id: string) => void;
  markMessageRead: (id: string) => void;
  updateGoogleSettings: (settings: GoogleSettings) => void;
  updateSeoSettings: (settings: SeoSettings) => void;
  updateGeneralSettings: (settings: GeneralSettings) => void;
  updateAdSettings: (settings: AdSettings) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const INITIAL_MESSAGES: Message[] = [];

const initialGoogleSettings: GoogleSettings = {
  analyticsId: '',
  searchConsoleMeta: '',
  adsConversionId: '',
  adsLabel: '',
};

const initialAdSettings: AdSettings = {
  imageUrl: null,
  linkUrl: '',
  isActive: false,
};

const applyListingMigrations = (source: Listing[]) => {
  const listings = source.map((listing) => ({ ...listing }));
  const outdatedFeatured = listings.find((listing) => listing.id === '652');
  const replacementFeatured = listings.find((listing) => listing.id === '894');

  if (
    outdatedFeatured &&
    replacementFeatured &&
    outdatedFeatured.homepage_featured === true &&
    outdatedFeatured.homepage_order === 10 &&
    replacementFeatured.homepage_featured !== true
  ) {
    outdatedFeatured.homepage_featured = false;
    outdatedFeatured.homepage_order = undefined;
    replacementFeatured.homepage_featured = true;
    replacementFeatured.homepage_order = 10;
  }

  return listings;
};

const buildInitialAdminState = (): AdminState => ({
  listings: applyListingMigrations(MAIN_LISTINGS),
  news: NEWS_ITEMS,
  messages: INITIAL_MESSAGES,
  googleSettings: initialGoogleSettings,
  seoSettings: DEFAULT_SEO_SETTINGS,
  generalSettings: DEFAULT_GENERAL_SETTINGS,
  adSettings: initialAdSettings,
});

const placeNewListingAtHomepageTop = (incomingListing: Listing, existingListings: Listing[]) => {
  const preparedNewListing: Listing = {
    ...incomingListing,
    homepage_featured: true,
    homepage_order: 1,
  };

  const shiftedListings = existingListings.map((listing) => {
    if (listing.status !== 'active' || listing.homepage_featured !== true) {
      return listing;
    }

    const nextOrder = (listing.homepage_order || 0) + 1;
    if (nextOrder > 10) {
      return {
        ...listing,
        homepage_featured: false,
        homepage_order: undefined,
      };
    }

    return {
      ...listing,
      homepage_order: nextOrder,
    };
  });

  return [preparedNewListing, ...shiftedListings];
};

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const initialState = useMemo(buildInitialAdminState, []);
  const [listings, setListings] = useState<Listing[]>(initialState.listings);
  const [news, setNews] = useState<NewsItem[]>(initialState.news);
  const [messages, setMessages] = useState<Message[]>(initialState.messages);
  const [googleSettings, setGoogleSettings] = useState<GoogleSettings>(initialState.googleSettings);
  const [seoSettings, setSeoSettings] = useState<SeoSettings>(initialState.seoSettings);
  const [generalSettings, setGeneralSettings] = useState<GeneralSettings>(initialState.generalSettings);
  const [adSettings, setAdSettings] = useState<AdSettings>(initialState.adSettings);
  const [listingAnalytics, setListingAnalytics] = useState<ListingAnalytics[]>([]);

  const latestStateRef = useRef<AdminState>(initialState);

  useEffect(() => {
    latestStateRef.current = {
      listings,
      news,
      messages,
      googleSettings,
      seoSettings,
      generalSettings,
      adSettings,
    };
  }, [listings, news, messages, googleSettings, seoSettings, generalSettings, adSettings]);

  useEffect(() => {
    let isMounted = true;

    const hydratePublicState = async () => {
      try {
        const bootstrap = await fetchPublicBootstrap();
        if (!isMounted) return;

        const normalized = bootstrap as PublicBootstrap;
        setListings(applyListingMigrations(normalized.listings || []));
        setNews(normalized.news || []);
        setGoogleSettings(normalized.googleSettings || initialGoogleSettings);
        setSeoSettings(normalized.seoSettings || DEFAULT_SEO_SETTINGS);
        setGeneralSettings(normalized.generalSettings || DEFAULT_GENERAL_SETTINGS);
        setAdSettings(normalized.adSettings || initialAdSettings);
      } catch (error) {
        console.error('Public bootstrap could not be loaded:', error);
      }
    };

    const hydrateAdminState = async () => {
      if (!isAdminAuthenticated()) {
        return;
      }

      try {
        const adminState = await fetchAdminBootstrap();
        if (!isMounted) return;

        setListings(applyListingMigrations(adminState.listings || []));
        setNews(adminState.news || []);
        setMessages(adminState.messages || []);
        setGoogleSettings(adminState.googleSettings || initialGoogleSettings);
        setSeoSettings(adminState.seoSettings || DEFAULT_SEO_SETTINGS);
        setGeneralSettings(adminState.generalSettings || DEFAULT_GENERAL_SETTINGS);
        setAdSettings(adminState.adSettings || initialAdSettings);
      } catch (error) {
        console.error('Admin bootstrap could not be loaded:', error);
      }
    };

    void hydratePublicState();
    void hydrateAdminState();

    return () => {
      isMounted = false;
    };
  }, []);

  const syncAdminState = (partial: Partial<AdminState>) => {
    if (!isAdminAuthenticated()) {
      return;
    }

    const nextState: AdminState = {
      ...latestStateRef.current,
      ...partial,
    };

    latestStateRef.current = nextState;

    void persistAdminState(nextState).catch((error) => {
      console.error('Admin state could not be persisted:', error);
    });
  };

  useEffect(() => {
    const analyticsData: ListingAnalytics[] = listings.map((listing) => {
      const daily = Math.floor(Math.random() * 50) + 5;
      const trendDir = Math.random() > 0.5 ? 'up' : 'down';

      return {
        listingId: listing.id,
        dailyViews: daily,
        weeklyViews: daily * (Math.floor(Math.random() * 5) + 3) + Math.floor(Math.random() * 20),
        monthlyViews: daily * 25 + Math.floor(Math.random() * 200),
        totalViews: daily * 150 + Math.floor(Math.random() * 1000),
        trend: trendDir as 'up' | 'down',
        trendPercentage: Math.floor(Math.random() * 30) + 1,
      };
    });

    setListingAnalytics(analyticsData);
  }, [listings.length]);

  const featuredListings = useMemo(() => {
    return listings
      .filter((listing) => listing.status === 'active' && listing.homepage_featured === true)
      .sort((a, b) => (a.homepage_order || 99) - (b.homepage_order || 99))
      .slice(0, 10);
  }, [listings]);

  const recentListings = useMemo(() => {
    return listings
      .filter((listing) => listing.status === 'active')
      .sort((a, b) => new Date(b.createdDate || b.updateDate).getTime() - new Date(a.createdDate || a.updateDate).getTime())
      .slice(0, 6)
      .map((listing) => ({
        id: listing.id,
        title: listing.title,
        price: listing.price,
        imageUrl: listing.imageUrls[0] || 'https://via.placeholder.com/200',
      }));
  }, [listings]);

  const addListing = (listing: Listing) => {
    setListings((prev) => {
      const next = placeNewListingAtHomepageTop(listing, prev);
      syncAdminState({ listings: next });
      return next;
    });
  };

  const updateListing = (updatedListing: Listing) => {
    setListings((prev) => {
      const next = prev.map((listing) => (listing.id === updatedListing.id ? updatedListing : listing));
      syncAdminState({ listings: next });
      return next;
    });
  };

  const deleteListing = (id: string) => {
    setListings((prev) => {
      const next = prev.filter((listing) => listing.id !== id);
      syncAdminState({ listings: next });
      return next;
    });
  };

  const updateHomepageOrder = (id: string, featured: boolean, order: number | null) => {
    const updatedListings = listings.map((listing) => ({ ...listing }));
    const targetIndex = updatedListings.findIndex((listing) => listing.id === id);
    if (targetIndex === -1) return;

    const targetItem = updatedListings[targetIndex];

    if (!featured) {
      targetItem.homepage_featured = false;
      targetItem.homepage_order = undefined;
      setListings(updatedListings);
      syncAdminState({ listings: updatedListings });
      return;
    }

    if (!listings.find((listing) => listing.id === id)?.homepage_featured) {
      const currentCount = updatedListings.filter((listing) => listing.homepage_featured).length;
      if (currentCount >= 10) {
        alert('Ana sayfada en fazla 10 ilan gösterilebilir. Lütfen önce başka bir ilanı vitrinden kaldırın.');
        return;
      }
    }

    let newOrder = order;
    if (!newOrder) {
      const usedOrders = updatedListings
        .filter((listing) => listing.homepage_featured && listing.id !== id && listing.homepage_order)
        .map((listing) => listing.homepage_order as number);

      for (let i = 1; i <= 10; i += 1) {
        if (!usedOrders.includes(i)) {
          newOrder = i;
          break;
        }
      }

      if (!newOrder) newOrder = 10;
    }

    targetItem.homepage_featured = true;
    targetItem.homepage_order = newOrder;

    const resolveConflict = (orderToCheck: number) => {
      if (orderToCheck > 10) return;

      const occupantIndex = updatedListings.findIndex(
        (listing) => listing.id !== id && listing.homepage_featured && listing.homepage_order === orderToCheck,
      );

      if (occupantIndex !== -1) {
        const occupant = updatedListings[occupantIndex];
        const nextOrder = orderToCheck + 1;

        if (nextOrder > 10) {
          occupant.homepage_featured = false;
          occupant.homepage_order = undefined;
          alert(`Sıralama limiti (10) aşıldığı için "${occupant.title.substring(0, 15)}..." vitrinden kaldırıldı.`);
        } else {
          occupant.homepage_order = nextOrder;
          resolveConflict(nextOrder);
        }
      }
    };

    resolveConflict(newOrder);
    setListings(updatedListings);
    syncAdminState({ listings: updatedListings });
  };

  const addNews = (newsItem: NewsItem) => {
    setNews((prev) => {
      const next = [newsItem, ...prev];
      syncAdminState({ news: next });
      return next;
    });
  };

  const deleteNews = (id: string) => {
    setNews((prev) => {
      const next = prev.filter((item) => item.id !== id);
      syncAdminState({ news: next });
      return next;
    });
  };

  const addMessage = (message: Message) => {
    setMessages((prev) => [message, ...prev]);

    void submitContactMessage(message)
      .then(({ message: persistedMessage }) => {
        setMessages((prev) => [persistedMessage, ...prev.filter((item) => item.id !== message.id)]);
      })
      .catch((error) => {
        console.error('Message could not be persisted:', error);
        setMessages((prev) => prev.filter((item) => item.id !== message.id));
        alert('Mesaj gönderilemedi. Lütfen tekrar deneyin.');
      });
  };

  const deleteMessage = (id: string) => {
    setMessages((prev) => {
      const next = prev.filter((message) => message.id !== id);
      syncAdminState({ messages: next });
      return next;
    });
  };

  const markMessageRead = (id: string) => {
    setMessages((prev) => {
      const next = prev.map((message) => (message.id === id ? { ...message, read: true } : message));
      syncAdminState({ messages: next });
      return next;
    });
  };

  const updateGoogleSettings = (settings: GoogleSettings) => {
    setGoogleSettings(settings);
    syncAdminState({ googleSettings: settings });
  };

  const updateSeoSettings = (settings: SeoSettings) => {
    setSeoSettings(settings);
    syncAdminState({ seoSettings: settings });
  };

  const updateGeneralSettings = (settings: GeneralSettings) => {
    setGeneralSettings(settings);
    syncAdminState({ generalSettings: settings });
  };

  const updateAdSettings = (settings: AdSettings) => {
    setAdSettings(settings);
    syncAdminState({ adSettings: settings });
  };

  return (
    <DataContext.Provider
      value={{
        listings,
        featuredListings,
        recentListings,
        sidebarListings: recentListings,
        news,
        messages,
        googleSettings,
        seoSettings,
        generalSettings,
        listingAnalytics,
        adSettings,
        addListing,
        updateListing,
        deleteListing,
        updateHomepageOrder,
        addNews,
        deleteNews,
        addMessage,
        deleteMessage,
        markMessageRead,
        updateGoogleSettings,
        updateSeoSettings,
        updateGeneralSettings,
        updateAdSettings,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);

  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }

  return context;
};
