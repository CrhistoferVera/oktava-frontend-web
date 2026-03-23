import Link from 'next/link';

interface LogoProps {
  mobileSize?: number;
  desktopSize?: number;
}

export function Logo({ mobileSize = 140, desktopSize = 264 }: LogoProps) {
  return (
    <Link href="/" className="flex justify-center">
      <img
        src="https://res.cloudinary.com/dai7rtja6/image/upload/v1774284573/Logo_Base_SVG_1_elipfb.svg"
        alt="OKTAVA"
        className="object-contain rounded-full border-3 border-white mt-5 block md:hidden"
        style={{ width: mobileSize, height: mobileSize }}
      />
      <img
        src="https://res.cloudinary.com/dai7rtja6/image/upload/v1774284573/Logo_Base_SVG_1_elipfb.svg"
        alt="OKTAVA"
        className="object-contain rounded-full border-3 border-white mt-5 hidden md:block"
        style={{ width: desktopSize, height: desktopSize }}
      />
    </Link>
  );
}