import About from '@/components/modules/website/home/About';
import React from 'react';

export const metadata = {
  title: 'About Us | Elelan E-commerce',
  description: 'Learn more about our company, mission, and vision.',
};

const AboutUsPage = () => {
  return (
    <main className="min-h-screen">
      <About />
    </main>
  );
};

export default AboutUsPage;
