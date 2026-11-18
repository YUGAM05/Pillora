import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: { absolute: 'Find Blood Donor India | Pillora Blood Bank' },
  description: 'Join Pillora\'s blood connect network to find a blood donor in India instantly. Register as a donor today and help save lives in emergency situations.',
  alternates: {
    canonical: 'https://www.pillora.in/blood-bank',
  },
};

export default function BloodBankLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
