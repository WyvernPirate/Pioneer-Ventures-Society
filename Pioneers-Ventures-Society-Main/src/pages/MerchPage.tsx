import React, { useState, useEffect } from "react";
import { getPublishedMerch, type MerchItem } from "../firebase/merchService";
import { dummyMerchData } from "../data/dummy";

const MerchPage: React.FC = () => {
  const [merch, setMerch] = useState<MerchItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSizes, setSelectedSizes] = useState<{ [key: string]: number }>({});

  // To use live data from Firebase, comment out the useEffect below
  // and uncomment this one.
  // useEffect(() => {
  //   const fetchMerch = async () => {
  //     try {
  //       const items = await getPublishedMerch();
  //       setMerch(items);
  //     } catch (error) {
  //       console.error("Error fetching merchandise:", error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };
  //   fetchMerch();
  // }, []);

  // Use dummy data for visualization
  useEffect(() => {
    setMerch(dummyMerchData);
    // Initialize selected sizes state
    const initialSizes = dummyMerchData.reduce((acc, item) => {
      if (item.id) {
        acc[item.id] = 0;
      }
      return acc;
    }, {} as { [key: string]: number });
    setSelectedSizes(initialSizes);
    setLoading(false);
  }, []);

  const handleSizeCycle = (itemId: string, sizes: string[]) => {
    setSelectedSizes((prevSizes) => ({
      ...prevSizes,
      [itemId]: ((prevSizes[itemId] || 0) + 1) % sizes.length,
    }));
  };

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
        <h1 className="text-4xl font-extrabold text-center text-gray-900 mb-4">
          Our Merch
        </h1>
        <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
          Interested in buying something? Click "Order on WhatsApp" to send us a pre-filled message. We'll get back to you to finalize the order.
        </p>
        {merch.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {merch.map((item) => {
              const selectedSizeIndex = selectedSizes[item.id!] || 0;
              const selectedSize = item.sizes[selectedSizeIndex];

              // Replace with your admin's WhatsApp number (include country code, no "+")
              const adminPhoneNumber = "26774421107";
              const message = encodeURIComponent(
`Hello PVS,

I'm interested in purchasing the "${item.name}".

Please fill out the following details for the order:
- Name:
- Size: ${selectedSize}
- Quantity: 1

Thank you!`
              );
              const whatsappLink = `https://wa.me/${adminPhoneNumber}?text=${message}`;

              return (
                <div key={item.id} className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col transform hover:-translate-y-2 transition-transform duration-300 relative">
                  {item.sizes.length > 1 && (
                    <div
                      onClick={() => handleSizeCycle(item.id!, item.sizes)}
                      className="absolute top-3 right-3 bg-black bg-opacity-60 text-white w-16 h-16 rounded-full flex items-center justify-center cursor-pointer select-none font-bold text-lg z-10 transition-transform hover:scale-110"
                      title="Click to cycle sizes"
                    >
                      {selectedSize}
                    </div>
                  )}
                  <img className="w-full h-64 object-cover" src={item.imageUrl} alt={item.name} />
                  <div className="p-6 flex flex-col flex-grow">
                    <h3 className="text-2xl font-semibold text-gray-800 mb-2">{item.name}</h3>
                    <p className="text-xl font-bold text-blue-600 mb-4">${item.price.toFixed(2)}</p>
                    <p className="text-gray-600 text-base flex-grow mb-6">{item.description}</p>
                    {item.sizes.length === 1 && item.sizes[0] !== "One Size" && (
                      <p className="text-sm text-gray-500 mb-4">Size: {item.sizes[0]}</p>
                    )}
                    <a
                      href={whatsappLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-auto block w-full bg-green-500 text-white text-center font-bold py-3 px-4 rounded-lg hover:bg-green-600 transition-colors duration-300"
                    >
                      Order on WhatsApp
                    </a>
                  </div>
                </div>
              );
            })}
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