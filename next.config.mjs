/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    // Old name of the blood bank page; some blog posts still link to it
    const staticRedirects = [
      { source: '/blood-connect', destination: '/blood-bank', permanent: true },
    ];
    try {
      const res = await fetch(process.env.NEXT_PUBLIC_API_URL ? `${process.env.NEXT_PUBLIC_API_URL}/hospitals` : 'http://localhost:5000/api/hospitals');
      const hospitals = await res.json();
      if (!Array.isArray(hospitals)) return staticRedirects;
      return [
        ...staticRedirects,
        // Only hospitals with a slug: redirecting /hospitals/<id> to itself would loop
        ...hospitals
          .filter((h) => h && h._id && h.slug && h.slug !== String(h._id))
          .map((h) => ({
            source: `/hospitals/${h._id}`,
            destination: `/hospitals/${h.slug}`,
            permanent: true,
          })),
      ];
    } catch (e) {
      console.warn('Could not load static hospital redirects', e);
      return staticRedirects;
    }
  },
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '5000',
        pathname: '/uploads/**'
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com'
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com'
      },
      {
        protocol: 'https',
        hostname: 'content.jdmagicbox.com'
      },
      {
        protocol: 'https',
        hostname: '**',  // ✅ allows any external https image URL
      }
    ],
    formats: ['image/avif', 'image/webp']
  }
};

export default nextConfig;