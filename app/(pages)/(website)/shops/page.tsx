import Shops from "@/components/modules/website/home/Shops";

export default function ShopsPage() {
  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-center text-gray-900">
            Explore Our Shops
          </h1>
          <p className="text-center text-gray-600 mt-2">
            Discover unique products from our trusted sellers
          </p>
        </div>
        <Shops />
      </div>
    </main>
  );
}
