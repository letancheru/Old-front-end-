'use client';
import React, { useState, useEffect } from 'react';
import ProfileService, { Media, ProfileData } from '@/components/service/ProfileService';
import { toast } from 'react-hot-toast';
import { Save } from 'lucide-react';

interface ExtendedUser {
  id: number;
  name: string;
  email: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  date_of_birth?: string;
  address_line1?: string;
  address_line2?: string;
  city?: string;
  region?: string;
  zone?: string;
  wereda?: string;
  kebele?: string;
  location?: string;
  country?: string;
  media?: Media[];
}

export default function ProfileSettings() {
  const [isLoading, setIsLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string[]>>({});
  const [profileData, setProfileData] = useState<ProfileData>({
    email: '',
    first_name: '',
    last_name: '',
    phone: '',
    date_of_birth: '',
    address_line1: '',
    address_line2: '',
    city: '',
    region: '',
    zone: '',
    wereda: '',
    kebele: '',
    location: '',
    country: '',
    media: [],
  });

  // Fetch profile data on component mount
  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      const userData = await ProfileService.getProfile() as ExtendedUser;
     
      // Decompose the full name into first and last name if name exists
      let first_Name = '',
        last_Name = '';
      if (userData.name) {
        const nameParts = userData.name.trim().split(/\s+/);
        if (nameParts.length >= 2) {
          first_Name = nameParts[0];
          last_Name = nameParts.slice(1).join(' ');
        } else {
          first_Name = nameParts[0] || '';
        }
      }

      setProfileData({
        email: userData.email || '',
        first_name: userData.first_name || first_Name,
        last_name: userData.last_name || last_Name,
        phone: userData.phone || '',
        date_of_birth: userData.date_of_birth || '',
        address_line1: userData.address_line1 || '',
        address_line2: userData.address_line2 || '',
        city: userData.city || '',
        region: userData.region || '',
        zone: userData.zone || '',
        wereda: userData.wereda || '',
        kebele: userData.kebele || '',
        location: userData.location || '',
        country: userData.country || '',
        media: userData.media || [],
      });
    } catch (error) {
      console.error('Error fetching profile data:', error);
      toast.error('Failed to fetch profile data');
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Create a preview URL for the image
      const previewUrl = URL.createObjectURL(file);
      
      // Update the profile data with the preview URL
      setProfileData((prev) => ({
        ...prev,
        media: [{
          id: 0,
          model_type: 'App\\Models\\User',
          model_id: 0,
          collection_name: 'profile',
          type: 'image',
          file_path: previewUrl,
          mime_type: file.type,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }],
      }));
    }
  };

  const handleProfileSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setValidationErrors({});

    try {
      const formData = new FormData();

      // Append all form fields
      formData.append('email', profileData.email);
      formData.append('first_name', profileData.first_name);
      formData.append('last_name', profileData.last_name);
      formData.append('phone', profileData.phone);
      formData.append('date_of_birth', profileData.date_of_birth);
      formData.append('address_line1', profileData.address_line1);
      formData.append('address_line2', profileData.address_line2);
      formData.append('city', profileData.city);
      formData.append('region', profileData.region);
      formData.append('zone', profileData.zone);
      formData.append('wereda', profileData.wereda);
      formData.append('kebele', profileData.kebele);
      formData.append('location', profileData.location);
      formData.append('country', profileData.country);

      // Get the file input element
      const imageInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      
      // If there's a new image file, append it to the form data
      if (imageInput?.files?.[0]) {
        formData.append('media', imageInput.files[0]);
      }

      // Send the request
      const response = await ProfileService.updateProfile(formData);

      // Update the profile data with the new media information
      if (response && response.media) {
        setProfileData(prev => ({
          ...prev,
          media: response.media
        }));
      }

      // Refresh the profile data
      await fetchProfileData();
      
      toast.success('Profile updated successfully');
    } catch (error: any) {
      if (error.response?.data?.errors) {
        setValidationErrors(error.response.data.errors);
      } else {
        toast.error('Failed to update profile');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const getErrorMessage = (fieldName: string) => {
    return validationErrors[fieldName]?.[0];
  };

  return (
    <div className="mx-auto max-w-screen-2xl p-2 sm:p-4 md:p-6 2xl:p-10 flex justify-center">
      <div className="bg-white dark:bg-boxdark rounded-2xl shadow-lg p-4 sm:p-6 md:p-8 w-full max-w-5xl">
        <div className="mb-4 sm:mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Profile Settings</h1>
        </div>

        <div className="overflow-hidden rounded-2xl shadow-default dark:bg-boxdark">
          <div className="px-2 sm:px-4 pb-4 sm:pb-6 text-center lg:pb-8 xl:pb-11.5">
            {/* Profile Banner */}
            <div className="relative h-40 sm:h-60 w-full rounded-t-2xl bg-gradient-to-r from-blue-400 via-primary to-purple-500 transition-all duration-300">
              <div className="absolute inset-0 bg-black/20 backdrop-blur-sm"></div>
              <div className="absolute -bottom-12 sm:-bottom-16 left-1/2 z-30 -translate-x-1/2">
                <div className="group relative h-24 w-24 sm:h-32 sm:w-32 rounded-full border-4 border-white bg-white dark:border-boxdark shadow-lg transition-transform duration-300 hover:scale-105">
                  {(() => {
                    const profileMedia = profileData.media.find(m => m.collection_name === 'profile');
                    if (profileMedia?.file_path) {
                      const imageUrl = profileMedia.file_path.startsWith('blob:') 
                        ? profileMedia.file_path 
                        : `${process.env.NEXT_PUBLIC_API_URL}/storage/${profileMedia.file_path}`;
                      return (
                        <img
                          src={imageUrl}
                          alt="Profile"
                          className="h-full w-full rounded-full object-cover"
                        />
                      );
                    }
                    return (
                      <div className="flex h-full w-full items-center justify-center rounded-full bg-gradient-to-r from-blue-100 to-blue-50">
                        <span className="text-2xl sm:text-3xl font-bold text-primary">
                          {profileData.first_name?.charAt(0)?.toUpperCase()}
                        </span>
                      </div>
                    );
                  })()}
                  <label className="absolute bottom-0 right-0 flex h-8 w-8 sm:h-10 sm:w-10 cursor-pointer items-center justify-center rounded-full bg-blue-400 text-white shadow-lg transition-all duration-300 hover:bg-opacity-90 hover:scale-110">
                    <input
                      type="file"
                      name="media"
                      className="sr-only"
                      accept="image/*"
                      aria-label="Upload profile picture"
                      onChange={handleImageChange}
                    />
                    <svg className="h-4 w-4 sm:h-5 sm:w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path d="M12 4v16m8-8H4" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  </label>
                </div>
              </div>
            </div>

            {/* Forms Section */}
            <div className="pt-16 sm:pt-20">
              <form onSubmit={handleProfileSubmit} method="POST" encType="multipart/form-data">
                {/* Basic Information Section */}
                <div className="grid grid-cols-12 gap-4 sm:gap-8 mb-6 sm:mb-8">
                  <div className="col-span-12">
                    <h5 className="text-lg sm:text-xl font-semibold text-black dark:text-white mb-4">
                      Basic Information
                    </h5>
                    <div className="bg-white dark:bg-boxdark rounded-2xl p-4 sm:p-6 md:p-8 shadow-lg transition-all duration-300 hover:shadow-xl border border-gray-100 dark:border-gray-700">
                      {/* Email Field */}
                      <div className="mb-4 group">
                        <label className="mb-2 sm:mb-3 block text-sm font-medium text-black dark:text-white">
                          Email <span className="text-danger">*</span>
                        </label>
                        <div className="relative">
                          <input
                            type="email"
                            name="email"
                            value={profileData.email}
                            onChange={(e) => setProfileData((prev) => ({ ...prev, email: e.target.value }))}
                            placeholder="Enter your email"
                            className="w-full rounded-lg border-2 border-gray-300 bg-transparent py-3 sm:py-4 px-4 sm:px-6 font-medium outline-none transition-all duration-300 focus:border-primary focus:ring-2 focus:ring-primary/20 hover:border-primary/50 dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary dark:focus:ring-primary/30 disabled:cursor-default disabled:bg-whiter dark:disabled:bg-black/30"
                          />
                          <span className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-gray-400">
                            <svg className="h-4 w-4 sm:h-5 sm:w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                          </span>
                        </div>
                        {validationErrors.email && (
                          <p className="text-danger mt-2 text-sm">{getErrorMessage('email')}</p>
                        )}
                      </div>

                      {/* First Name & Last Name Fields */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="mb-2 sm:mb-3 block text-sm font-medium text-black dark:text-white">
                            First Name <span className="text-danger">*</span>
                          </label>
                          <div className="relative">
                            <input
                              type="text"
                              name="first_name"
                              value={profileData.first_name}
                              onChange={(e) => setProfileData((prev) => ({ ...prev, first_name: e.target.value }))}
                              placeholder="Enter your first name"
                              className="w-full rounded-lg border-2 border-gray-300 bg-transparent py-3 sm:py-4 px-4 sm:px-6 font-medium outline-none transition-all duration-300 focus:border-primary focus:ring-2 focus:ring-primary/20 hover:border-primary/50 dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary dark:focus:ring-primary/30 disabled:cursor-default disabled:bg-whiter dark:disabled:bg-black/30"
                            />
                          </div>
                          {validationErrors.first_name && (
                            <p className="text-danger mt-2 text-sm">{getErrorMessage('first_name')}</p>
                          )}
                        </div>
                        <div>
                          <label className="mb-2 sm:mb-3 block text-sm font-medium text-black dark:text-white">
                            Last Name <span className="text-danger">*</span>
                          </label>
                          <div className="relative">
                            <input
                              type="text"
                              name="last_name"
                              value={profileData.last_name}
                              onChange={(e) => setProfileData((prev) => ({ ...prev, last_name: e.target.value }))}
                              placeholder="Enter your last name"
                              className="w-full rounded-lg border-2 border-gray-300 bg-transparent py-3 sm:py-4 px-4 sm:px-6 font-medium outline-none transition-all duration-300 focus:border-primary focus:ring-2 focus:ring-primary/20 hover:border-primary/50 dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary dark:focus:ring-primary/30 disabled:cursor-default disabled:bg-whiter dark:disabled:bg-black/30"
                            />
                          </div>
                          {validationErrors.last_name && (
                            <p className="text-danger mt-2 text-sm">{getErrorMessage('last_name')}</p>
                          )}
                        </div>
                      </div>

                      {/* Phone & Date of Birth Fields */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="mb-2 sm:mb-3 block text-sm font-medium text-black dark:text-white">
                            Phone
                          </label>
                          <div className="relative">
                            <input
                              type="tel"
                              name="phone"
                              value={profileData.phone}
                              onChange={(e) => setProfileData((prev) => ({ ...prev, phone: e.target.value }))}
                              placeholder="Enter your phone number"
                              className="w-full rounded-lg border-2 border-gray-300 bg-transparent py-3 sm:py-4 px-4 sm:px-6 font-medium outline-none transition-all duration-300 focus:border-primary focus:ring-2 focus:ring-primary/20 hover:border-primary/50 dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary dark:focus:ring-primary/30 disabled:cursor-default disabled:bg-whiter dark:disabled:bg-black/30"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="mb-2 sm:mb-3 block text-sm font-medium text-black dark:text-white">
                            Date of Birth
                          </label>
                          <div className="relative">
                            <input
                              type="date"
                              name="date_of_birth"
                              value={profileData.date_of_birth}
                              onChange={(e) => setProfileData((prev) => ({ ...prev, date_of_birth: e.target.value }))}
                              className="w-full rounded-lg border-2 border-gray-300 bg-transparent py-3 sm:py-4 px-4 sm:px-6 font-medium outline-none transition-all duration-300 focus:border-primary focus:ring-2 focus:ring-primary/20 hover:border-primary/50 dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary dark:focus:ring-primary/30 disabled:cursor-default disabled:bg-whiter dark:disabled:bg-black/30"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Address Information Section */}
                <div className="grid grid-cols-12 gap-4 sm:gap-8 mb-6 sm:mb-8">
                  <div className="col-span-12">
                    <h5 className="text-lg sm:text-xl font-semibold text-black dark:text-white mb-4">
                      Address Information
                    </h5>
                    <div className="bg-white dark:bg-boxdark rounded-2xl p-4 sm:p-6 md:p-8 shadow-lg transition-all duration-300 hover:shadow-xl border border-gray-100 dark:border-gray-700">
                      {/* Primary Address Fields */}
                      <div className="mb-4">
                        <label className="mb-2 sm:mb-3 block text-sm font-medium text-black dark:text-white">
                          Address Line 1
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            name="address_line1"
                            value={profileData.address_line1}
                            onChange={(e) => setProfileData((prev) => ({ ...prev, address_line1: e.target.value }))}
                            placeholder="Enter your primary address"
                            className="w-full rounded-lg border-2 border-gray-300 bg-transparent py-3 sm:py-4 px-4 sm:px-6 font-medium outline-none transition-all duration-300 focus:border-primary focus:ring-2 focus:ring-primary/20 hover:border-primary/50 dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary dark:focus:ring-primary/30 disabled:cursor-default disabled:bg-whiter dark:disabled:bg-black/30"
                          />
                        </div>
                      </div>

                      <div className="mb-4">
                        <label className="mb-2 sm:mb-3 block text-sm font-medium text-black dark:text-white">
                          Address Line 2
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            name="address_line2"
                            value={profileData.address_line2}
                            onChange={(e) => setProfileData((prev) => ({ ...prev, address_line2: e.target.value }))}
                            placeholder="Enter your secondary address"
                            className="w-full rounded-lg border-2 border-gray-300 bg-transparent py-3 sm:py-4 px-4 sm:px-6 font-medium outline-none transition-all duration-300 focus:border-primary focus:ring-2 focus:ring-primary/20 hover:border-primary/50 dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary dark:focus:ring-primary/30 disabled:cursor-default disabled:bg-whiter dark:disabled:bg-black/30"
                          />
                        </div>
                      </div>

                      {/* Location Fields */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="mb-2 sm:mb-3 block text-sm font-medium text-black dark:text-white">
                            Country
                          </label>
                          <div className="relative">
                            <input
                              type="text"
                              name="country"
                              value={profileData.country}
                              onChange={(e) => setProfileData((prev) => ({ ...prev, country: e.target.value }))}
                              placeholder="Enter your country"
                              className="w-full rounded-lg border-2 border-gray-300 bg-transparent py-3 sm:py-4 px-4 sm:px-6 font-medium outline-none transition-all duration-300 focus:border-primary focus:ring-2 focus:ring-primary/20 hover:border-primary/50 dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary dark:focus:ring-primary/30 disabled:cursor-default disabled:bg-whiter dark:disabled:bg-black/30"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="mb-2 sm:mb-3 block text-sm font-medium text-black dark:text-white">
                            City
                          </label>
                          <div className="relative">
                            <input
                              type="text"
                              name="city"
                              value={profileData.city}
                              onChange={(e) => setProfileData((prev) => ({ ...prev, city: e.target.value }))}
                              placeholder="Enter your city"
                              className="w-full rounded-lg border-2 border-gray-300 bg-transparent py-3 sm:py-4 px-4 sm:px-6 font-medium outline-none transition-all duration-300 focus:border-primary focus:ring-2 focus:ring-primary/20 hover:border-primary/50 dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary dark:focus:ring-primary/30 disabled:cursor-default disabled:bg-whiter dark:disabled:bg-black/30"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Administrative Division Fields */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="mb-2 sm:mb-3 block text-sm font-medium text-black dark:text-white">
                            Region
                          </label>
                          <div className="relative">
                            <input
                              type="text"
                              name="region"
                              value={profileData.region}
                              onChange={(e) => setProfileData((prev) => ({ ...prev, region: e.target.value }))}
                              placeholder="Enter your region"
                              className="w-full rounded-lg border-2 border-gray-300 bg-transparent py-3 sm:py-4 px-4 sm:px-6 font-medium outline-none transition-all duration-300 focus:border-primary focus:ring-2 focus:ring-primary/20 hover:border-primary/50 dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary dark:focus:ring-primary/30 disabled:cursor-default disabled:bg-whiter dark:disabled:bg-black/30"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="mb-2 sm:mb-3 block text-sm font-medium text-black dark:text-white">
                            Zone
                          </label>
                          <div className="relative">
                            <input
                              type="text"
                              name="zone"
                              value={profileData.zone}
                              onChange={(e) => setProfileData((prev) => ({ ...prev, zone: e.target.value }))}
                              placeholder="Enter your zone"
                              className="w-full rounded-lg border-2 border-gray-300 bg-transparent py-3 sm:py-4 px-4 sm:px-6 font-medium outline-none transition-all duration-300 focus:border-primary focus:ring-2 focus:ring-primary/20 hover:border-primary/50 dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary dark:focus:ring-primary/30 disabled:cursor-default disabled:bg-whiter dark:disabled:bg-black/30"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="mb-2 sm:mb-3 block text-sm font-medium text-black dark:text-white">
                            Wereda
                          </label>
                          <div className="relative">
                            <input
                              type="text"
                              name="wereda"
                              value={profileData.wereda}
                              onChange={(e) => setProfileData((prev) => ({ ...prev, wereda: e.target.value }))}
                              placeholder="Enter your wereda"
                              className="w-full rounded-lg border-2 border-gray-300 bg-transparent py-3 sm:py-4 px-4 sm:px-6 font-medium outline-none transition-all duration-300 focus:border-primary focus:ring-2 focus:ring-primary/20 hover:border-primary/50 dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary dark:focus:ring-primary/30 disabled:cursor-default disabled:bg-whiter dark:disabled:bg-black/30"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="mb-2 sm:mb-3 block text-sm font-medium text-black dark:text-white">
                            Kebele
                          </label>
                          <div className="relative">
                            <input
                              type="text"
                              name="kebele"
                              value={profileData.kebele}
                              onChange={(e) => setProfileData((prev) => ({ ...prev, kebele: e.target.value }))}
                              placeholder="Enter your kebele"
                              className="w-full rounded-lg border-2 border-gray-300 bg-transparent py-3 sm:py-4 px-4 sm:px-6 font-medium outline-none transition-all duration-300 focus:border-primary focus:ring-2 focus:ring-primary/20 hover:border-primary/50 dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary dark:focus:ring-primary/30 disabled:cursor-default disabled:bg-whiter dark:disabled:bg-black/30"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="mb-4">
                        <label className="mb-2 sm:mb-3 block text-sm font-medium text-black dark:text-white">
                          Location
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            name="location"
                            value={profileData.location}
                            onChange={(e) => setProfileData((prev) => ({ ...prev, location: e.target.value }))}
                            placeholder="Enter your specific location"
                            className="w-full rounded-lg border-2 border-gray-300 bg-transparent py-3 sm:py-4 px-4 sm:px-6 font-medium outline-none transition-all duration-300 focus:border-primary focus:ring-2 focus:ring-primary/20 hover:border-primary/50 dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary dark:focus:ring-primary/30 disabled:cursor-default disabled:bg-blue-400 dark:disabled:bg-black/30"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Submit Button - Only visible in edit mode */}
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="inline-flex items-center px-6 py-3 bg-[#053F6E] text-white rounded-lg hover:bg-[#053F6E]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#053F6E] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Saving Changes...
                      </>
                    ) : (
                      <>
                        <Save className="w-5 h-5 mr-2" />
                        Save Changes
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}