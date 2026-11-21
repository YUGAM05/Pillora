import type { Metadata } from 'next';

export const metadata: Metadata = {
  // Already names Pillora, so skip the root '%s | Pillora' template
  title: { absolute: 'Help & Support | Pillora Health Platform' },
  description: 'Need assistance with finding a blood donor or understanding hospital information? Contact Pillora support for help with our health-tech platform.',
  alternates: {
    canonical: 'https://www.pillora.in/help',
  },
};

export default function HelpLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
