import Image from "next/image";
import Link from "next/link";
import Stripes from "@/public/images/cow-findr-logo--cropped.jpeg";

export default function Logo() {
  return (
    <div className="aspect-square w-12 flex justify-center items-center">
      <Image
        className="max-w-full max-h-full"
        src={Stripes}
        width={768}
        alt="Stripes"
        priority
      />
    </div>
  );
}
