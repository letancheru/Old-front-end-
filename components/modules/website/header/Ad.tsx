"use client";
import React, { useEffect, useState } from "react";
import Container from "../../custom/Container";
import Row from "../../custom/Row";
import Link from "next/link";
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaTelegramPlane } from "react-icons/fa";
import { RiTwitterXFill } from "react-icons/ri";
import { SettingAPi, CompanySetting } from "@/components/service/SettingService";
import ShopsService from "@/components/service/ShopsService";
import { useRouter } from "next/navigation";

interface Shop {
  id: number;
  name: string;
  slug: string;
  location: string;
  thumbnail: {
    file_path: string;
  };
}

interface AdProps {
  className?: string;
}

export default function Ad({ className }: AdProps) {
  const [selectedStoreId, setSelectedStoreId] = useState<number | null>(null);
  const [stores, setStores] = useState<Shop[]>([]);
  const [settings, setSettings] = useState<CompanySetting | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const settingsData = await SettingAPi.getCompanySetting();
        setSettings(settingsData);
      } catch (error) {
        console.error("Error fetching settings:", error);
      }
    };
    fetchSettings();
  }, []);

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const data = await ShopsService.getShops();
        setStores(data);
        
        // Get stored ID from localStorage
        const storedId = localStorage.getItem('selectedStore');
        const parsedId = storedId ? parseInt(storedId) : null;
        
        if (data.length > 0) {
          // Find main store or use first store
          const mainStore = data.find((store: Shop) => store.slug === 'main-store') || data[0];
          const storeId = parsedId || mainStore.id;
          
          setSelectedStoreId(storeId);
          localStorage.setItem('selectedStore', storeId.toString());
          
          // Find the store object to get the slug for routing
          const selectedStore = data.find((store: Shop) => store.id === storeId);
          
        }
      } catch (error) {
        console.error("Error fetching stores:", error);
      }
    };
    fetchStores();
  }, []);

  const handleStoreChange = (storeId: string) => {
    const id = parseInt(storeId);
    setSelectedStoreId(id);
    localStorage.setItem('selectedStore', id.toString());
    
    // Find the store object to get the slug for routing
    const selectedStore = stores.find(store => store.id === id);
    if (selectedStore) {
      router.push(`/shops/${selectedStore.slug}`);
    }
  };

  const formatAddress = (settings: CompanySetting) => {
    const parts = [settings.address, settings.city, settings.state, settings.zip, settings.country]
      .filter(Boolean)
      .join(', ');
    return parts || 'Address not available';
  };

  const selectedStore = stores.find(store => store.id === selectedStoreId);

  return (
    <section className={`hidden lg:flex w-full bg-black text-gray-200 py-2.5 border-b border-gray-800 ${className}`}>
      <Container>
        <Row className="justify-between items-center">
          <div className="flex items-center divide-x divide-gray-700">
            <div className="pr-6 text-sm font-medium flex items-center gap-2">
              <FaMapMarkerAlt className="w-3.5 h-3.5 text-gray-400" />
              <span className="hover:text-white transition-colors">
                {settings ? formatAddress(settings) : 'Loading address...'}
              </span>
            </div>
            
            <div className="flex items-center space-x-6 px-6">
              {settings?.sales_phone && (
                <div className="flex items-center gap-2 text-sm">
                  <FaPhoneAlt className="w-3.5 h-3.5 text-gray-400" />
                  <span className="hover:text-white transition-colors">{settings.sales_phone}</span>
                </div>
              )}
              {settings?.support_email && (
                <div className="flex items-center gap-2 text-sm">
                  <FaEnvelope className="w-3.5 h-3.5 text-gray-400" />
                  <span className="hover:text-white transition-colors">{settings.support_email}</span>
                </div>
              )}
            </div>

            <div className="pl-6 relative">
              <select
                value={selectedStoreId || ''}
                onChange={(e) => handleStoreChange(e.target.value)}
                className="text-sm bg-transparent border border-gray-700 rounded-md px-4 py-1 appearance-none cursor-pointer min-w-[180px] hover:border-gray-500 transition-colors focus:outline-none focus:border-gray-500 pr-10"
              >
                {stores.map((store) => (
                  <option 
                    key={store.id} 
                    value={store.id} 
                    className="bg-black text-white"
                  >
                    {store.name}
                  </option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg className="w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {settings?.facebook_page && (
              <Link 
                href={settings.facebook_page} 
                className="text-gray-400 hover:text-white transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaFacebookF className="w-4 h-4" />
              </Link>
            )}
            {settings?.twitter_page && (
              <Link 
                href={settings.twitter_page} 
                className="text-gray-400 hover:text-white transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <RiTwitterXFill className="w-4 h-4" />
              </Link>
            )}
            {settings?.telegram_channel && (
              <Link 
                href={settings.telegram_channel} 
                className="text-gray-400 hover:text-white transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaTelegramPlane className="w-4 h-4" />
              </Link>
            )}
            {settings?.instagram_page && (
              <Link 
                href={settings.instagram_page} 
                className="text-gray-400 hover:text-white transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaInstagram className="w-4 h-4" />
              </Link>
            )}
            {settings?.linkedin_page && (
              <Link 
                href={settings.linkedin_page} 
                className="text-gray-400 hover:text-white transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaLinkedinIn className="w-4 h-4" />
              </Link>
            )}
          </div>
        </Row>
      </Container>
    </section>
  );
}
