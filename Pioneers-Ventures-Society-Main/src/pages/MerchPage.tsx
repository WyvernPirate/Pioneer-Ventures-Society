import React, { useState, useEffect } from "react";
import { getPublishedMerch, type MerchItem } from "../firebase/merchService";

const MerchPage: React.FC = () => {
  const [merch, setMerch] = useState<MerchItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMerch = async () => {
      try {
        const items = await getPublishedMerch();
        setMerch(items);
      } catch (error) {
        console.error("Error fetching merchandise:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMerch();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-2xl text-gray-500">Loading Merch...</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 font-sans">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-extrabold text-center text-gray-900 mb-12">
          Our Merch
        </h1>
        {merch.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {merch.map((item) => (
              <div key={item.id} className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:-translate-y-2 transition-transform duration-300">
                <img className="w-full h-64 object-cover" src={item.imageUrl} alt={item.name} />
                <div className="p-6">
                  <h3 className="text-2xl font-semibold text-gray-800 mb-2">{item.name}</h3>
                  <p className="text-xl font-bold text-blue-600 mb-4">${item.price.toFixed(2)}</p>
                  <p className="text-gray-600 text-base">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-xl text-gray-500 mt-16">
            We currently have no merchandise available. Check back soon!
          </p>
        )}
      </div>
    </div>
  );
};

export default MerchPage;