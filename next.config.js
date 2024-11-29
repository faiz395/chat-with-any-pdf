/** @type {import('next').NextConfig} */
const nextConfig = {
    /* config options here */
    api: {
        bodyParser: {
          sizeLimit: '10mb',
        },
      },
};

module.exports = nextConfig;