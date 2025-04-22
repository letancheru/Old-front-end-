import TermsAndConditions from '@/components/modules/website/policy/TermsAndCondition';
import { LazyMotion, domAnimation } from 'framer-motion';

export default function TermsAndConditionsPage() {
  return (
    <LazyMotion features={domAnimation}>
      <TermsAndConditions />
    </LazyMotion>
  );
} 