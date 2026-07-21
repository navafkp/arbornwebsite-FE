import Image from "next/image";
import { withBasePath } from "@/lib/asset-path";

const FREE_SHIPPING_IMAGE = withBasePath("/images/free-shipping.png");

export default function FeatureStrip() {
  return (
    <div className="relative mt-[2.2px] aspect-[1450/244] w-full overflow-hidden rounded-3xl">
      <Image
        src={FREE_SHIPPING_IMAGE}
        alt="Free shipping all over India, no minimum order"
        fill
        sizes="100vw"
        className="object-cover"
      />
    </div>
  );
}
