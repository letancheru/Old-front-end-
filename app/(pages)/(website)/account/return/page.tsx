import RefundAndCancellation from '@/components/modules/website/policy/RefundAndCancilation';
import { LazyMotion, domAnimation } from 'framer-motion';

export default function ReturnPolicyPage() {
  return (
    <LazyMotion features={domAnimation}>
      <RefundAndCancellation />
    </LazyMotion>
  );
} 