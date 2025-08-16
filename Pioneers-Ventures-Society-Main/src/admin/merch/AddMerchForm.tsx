
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { addMerch, uploadMerchImage, type MerchItem } from '@/firebase/merchService';

interface AddMerchFormProps {
  onSuccess: () => void;
}

const AddMerchForm: React.FC<AddMerchFormProps> = ({ onSuccess }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState(0);
  const [sizes, setSizes] = useState<string[]>([]);
  const [image, setImage] = useState<File | null>(null);
  const [isPublished, setIsPublished] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSizeChange = (size: string) => {
    setSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!image) {
      alert('Please select an image.');
      return;
    }

    setLoading(true);

    try {
      const imageUrl = await uploadMerchImage(image);
      const newMerch: Omit<MerchItem, 'id'> = {
        name,
        description,
        price,
        sizes,
        imageUrl,
        isPublished,
      };
      await addMerch(newMerch);
      onSuccess();
    } catch (error) {
      console.error('Error adding merch:', error);
      alert('Failed to add merchandise.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
      </div>
      <div>
        <Label htmlFor="price">Price</Label>
        <Input
          id="price"
          type="number"
          value={price}
          onChange={(e) => setPrice(Number(e.target.value))}
          required
        />
      </div>
      <div>
        <Label>Sizes</Label>
        <div className="flex gap-4">
          {['S', 'M', 'L', 'XL', 'XXL'].map((size) => (
            <div key={size} className="flex items-center gap-2">
              <Checkbox
                id={`size-${size}`}
                checked={sizes.includes(size)}
                onCheckedChange={() => handleSizeChange(size)}
              />
              <Label htmlFor={`size-${size}`}>{size}</Label>
            </div>
          ))}
        </div>
      </div>
      <div>
        <Label htmlFor="image">Image</Label>
        <Input
          id="image"
          type="file"
          onChange={(e) => setImage(e.target.files ? e.target.files[0] : null)}
          required
        />
      </div>
      <div className="flex items-center gap-2">
        <Checkbox
          id="isPublished"
          checked={isPublished}
          onCheckedChange={() => setIsPublished(!isPublished)}
        />
        <Label htmlFor="isPublished">Publish</Label>
      </div>
      <Button type="submit" disabled={loading}>
        {loading ? 'Adding...' : 'Add Item'}
      </Button>
    </form>
  );
};

export default AddMerchForm;
