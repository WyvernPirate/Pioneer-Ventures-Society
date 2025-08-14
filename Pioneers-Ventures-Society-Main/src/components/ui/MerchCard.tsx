import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { MerchItem } from '@/firebase/merchService';

interface MerchCardProps {
  item: MerchItem;
}

// TODO: Move this to a central configuration file or environment variable
const ADMIN_WHATSAPP_NUMBER = "26774421107";

const MerchCard: React.FC<MerchCardProps> = ({ item }) => {
  const [selectedSizeIndex, setSelectedSizeIndex] = useState(0);

  const handleSizeCycle = () => {
    if (item.sizes.length > 1) {
      setSelectedSizeIndex((prevIndex) => (prevIndex + 1) % item.sizes.length);
    }
  };

  const selectedSize = item.sizes[selectedSizeIndex] || item.sizes[0] || 'One Size';
  const message = encodeURIComponent(
`Hello PVS,

I'm interested in purchasing the "${item.name}".

Please fill out the following details for the order:
- Name:
- Size: ${selectedSize}
- Quantity: 1

Thank you!`
  );
  const whatsappLink = `https://wa.me/${ADMIN_WHATSAPP_NUMBER}?text=${message}`;

  return (
    <Card className="overflow-hidden flex flex-col transform hover:-translate-y-2 transition-transform duration-300 shadow-lg hover:shadow-xl relative">
      {item.sizes.length > 1 && (
        <div
          onClick={handleSizeCycle}
          className="absolute top-3 right-3 bg-primary/80 text-primary-foreground w-16 h-16 rounded-full flex items-center justify-center cursor-pointer select-none font-bold text-lg z-10 transition-transform hover:scale-110"
          title="Click to cycle sizes"
        >
          {selectedSize}
        </div>
      )}
      <CardHeader className="p-0">
        <img className="w-full h-64 object-cover" src={item.imageUrl} alt={item.name} />
      </CardHeader>
      <CardContent className="p-6 flex flex-col flex-grow">
        <CardTitle className="text-2xl font-headline text-primary mb-2">{item.name}</CardTitle>
        <p className="text-xl font-bold text-accent mb-4">BWP {item.price.toFixed(2)}</p>
        <CardDescription className="text-foreground/70 text-base flex-grow mb-6">{item.description}</CardDescription>
        <Button asChild className="mt-auto w-full bg-accent text-accent-foreground hover:bg-accent/90">
          <a href={whatsappLink} target="_blank" rel="noopener noreferrer">Order on WhatsApp</a>
        </Button>
      </CardContent>
    </Card>
  );
};

export default MerchCard;
