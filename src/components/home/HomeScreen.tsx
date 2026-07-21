import HomeHeader from "@/components/home/HomeHeader";
import NewInSection from "@/components/home/NewInSection";
import ShopByCollectionSection from "@/components/home/ShopByCollectionSection";
import ArbornStories from "@/components/common/ArbornStories";
import FeatureStrip from "@/components/home/FeatureStrip";

export default function HomeScreen() {
  return (
    <>
      <HomeHeader />
      <div className="mx-auto max-w-7xl px-4 pt-[73.1px] pb-6 sm:px-6 lg:px-8">
        <FeatureStrip />
        <NewInSection />
        <ArbornStories />
        <ShopByCollectionSection />
      </div>
    </>
  );
}
