import PrivacyPolicy from '@/components/modules/website/policy/PrivecyPolicy';
import { LazyMotion, domAnimation } from 'framer-motion';

export default function PrivacyPolicyPage() {
  return (
    <LazyMotion features={domAnimation}>
      <PrivacyPolicy />
    </LazyMotion>
  );
} 