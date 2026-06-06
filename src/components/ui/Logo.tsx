import Image from 'next/image';
import Link from 'next/link';

interface LogoProps {
  mobileSize?: number;
  desktopSize?: number;
}

export function Logo({ mobileSize = 140, desktopSize = 264 }: LogoProps) {
  return (
    <Link href="/" className="flex justify-center">
      <Image
        src="/oktava_logo.png"
        alt="OKTAVA"
        width={mobileSize}
        height={Math.round(mobileSize / 4)}
        className="object-contain mt-5 block md:hidden"
      />
      <Image
        src="/oktava_logo.png"
        alt="OKTAVA"
        width={desktopSize}
        height={Math.round(desktopSize / 4)}
        className="object-contain mt-5 hidden md:block"
      />
    </Link>
  );
}