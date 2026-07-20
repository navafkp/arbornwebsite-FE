import HomeHeader from "@/components/home/HomeHeader";
import BustSizeBanner from "@/components/home/BustSizeBanner";
import NewInSection from "@/components/home/NewInSection";
import ShopByCollectionSection from "@/components/home/ShopByCollectionSection";
import FeatureStrip from "@/components/home/FeatureStrip";

export default function HomeScreen() {
  return (
    <>
      <HomeHeader />
      <div className="mx-auto max-w-7xl px-4 pt-[75px] pb-6 sm:px-6 lg:px-8">
        <BustSizeBanner />
        <ShopByCollectionSection />
        <NewInSection />
        <FeatureStrip />
      </div>
    </>
  );
}
