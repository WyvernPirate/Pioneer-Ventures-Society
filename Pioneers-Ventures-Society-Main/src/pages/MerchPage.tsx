import React, { useState, useEffect } from "react";
import { getPublishedMerch, type MerchItem } from "../firebase/merchService";

// --- DUMMY DATA FOR VISUALIZATION ---
// This data is used to show how the page will look.
// You can remove this and uncomment the useEffect below to use live Firebase data.
const dummyMerchData: MerchItem[] = [
  {
    id: "1",
    name: "PVS Classic Hoodie",
    description: "Stay warm and stylish with our classic society hoodie. Made from 100% premium cotton.",
    price: 35.0,
    imageUrl: "https://placehold.co/600x400/3498db/ffffff?text=PVS+Hoodie",
    sizes: ["S", "M", "L", "XL"],
    isPublished: true,
  },
  {
    id: "2",
    name: "PVS Venture T-Shirt",
    description: "A comfortable and breathable t-shirt, perfect for everyday wear. Show your PVS pride!",
    price: 20.0,
    imageUrl: "https://placehold.co/600x400/2ecc71/ffffff?text=PVS+T-Shirt",
    sizes: ["S", "M", "L", "XL", "XXL"],
    isPublished: true,
  },
  {
    id: "3",
    name: "PVS Innovator Cap",
    description: "A sleek and modern cap to complete your look. Adjustable strap for a perfect fit.",
    price: 15.0,
    imageUrl: "https://placehold.co/600x400/e74c3c/ffffff?text=PVS+Cap",
    sizes: ["One Size"],
    isPublished: true,
  },
];

const MerchPage: React.FC = () => {
  const [merch, setMerch] = useState<MerchItem[]>([]);
  const [loading, setLoading] = useState(true);

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
    setLoading(false);
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
        <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
          Interested in buying something? Click "Buy Now" to open your email client and send us a pre-filled request. We'll get back to you to finalize the order.
        </p>
        {merch.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {merch.map((item) => {
              const adminEmail = "merch@pioneer-ventures-society.org"; // Replace with your admin contact
              const subject = encodeURIComponent(`Merch Inquiry: ${item.name}`);
              const body = encodeURIComponent(
`Hello PVS,

I'm interested in purchasing the "${item.name}".

Please fill out the following details for the order:
- Name:
- Contact Number/Email:
- Size: [Available: ${item.sizes.join(" / ")}]
- Quantity: 1

Thank you!`
              );
              const mailtoLink = `mailto:${adminEmail}?subject=${subject}&body=${body}`;

              return (
                <div key={item.id} className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col transform hover:-translate-y-2 transition-transform duration-300">
                  <img className="w-full h-64 object-cover" src={item.imageUrl} alt={item.name} />
                  <div className="p-6 flex flex-col flex-grow">
                    <h3 className="text-2xl font-semibold text-gray-800 mb-2">{item.name}</h3>
                    <p className="text-xl font-bold text-blue-600 mb-4">${item.price.toFixed(2)}</p>
                    <p className="text-gray-600 text-base flex-grow mb-6">{item.description}</p>
                    <a
                      href={mailtoLink}
                      className="mt-auto block w-full bg-blue-600 text-white text-center font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-300"
                    >
                      Buy Now
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