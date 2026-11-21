import type { Metadata } from 'next';

export const metadata: Metadata = {
  // Already names Pillora, so skip the root '%s | Pillora' template
  title: { absolute: 'About Pillora | Health-Tech Platform India' },
  description: 'Learn about Pillora, India\'s leading health-tech platform dedicated to fast blood donor matching and transparent hospital information and charges.',
  alternates: {
    canonical: 'https://www.pillora.in/about',
  },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
