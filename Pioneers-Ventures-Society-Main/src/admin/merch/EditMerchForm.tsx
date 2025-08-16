
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import {
  updateMerch,
  uploadMerchImage,
  type MerchItem,
} from '@/firebase/merchService';

interface EditMerchFormProps {
  merchItem: MerchItem;
  onSuccess: () => void;
}

const EditMerchForm: React.FC<EditMerchFormProps> = ({ merchItem, onSuccess }) => {
  const [name, setName] = useState(merchItem.name);
  const [description, setDescription] = useState(merchItem.description);
  const [price, setPrice] = useState(merchItem.price);
  const [sizes, setSizes] = useState<string[]>(merchItem.sizes);
  const [image, setImage] = useState<File | null>(null);
  const [isPublished, setIsPublished] = useState(merchItem.isPublished);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setName(merchItem.name);
    setDescription(merchItem.description);
    setPrice(merchItem.price);
    setSizes(merchItem.sizes);
    setIsPublished(merchItem.isPublished);
  }, [merchItem]);

  const handleSizeChange = (size: string) => {
    setSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imageUrl = merchItem.imageUrl;
      if (image) {
        imageUrl = await uploadMerchImage(image);
      }

      const updatedMerch: Partial<MerchItem> = {
        name,
        description,
        price,
        sizes,
        imageUrl,
        isPublished,
      };

      await updateMerch(merchItem.id!, updatedMerch);
      onSuccess();
    } catch (error) {
      console.error('Error updating merch:', error);
      alert('Failed to update merchandise.');
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
                id={`edit-size-${size}`}
                checked={sizes.includes(size)}
                onCheckedChange={() => handleSizeChange(size)}
              />
              <Label htmlFor={`edit-size-${size}`}>{size}</Label>
            </div>
          ))}
        </div>
      </div>
      <div>
        <Label htmlFor="image">New Image (optional)</Label>
        <Input
          id="image"
          type="file"
          onChange={(e) => setImage(e.target.files ? e.target.files[0] : null)}
        />
      </div>
      <div className="flex items-center gap-2">
        <Checkbox
          id="edit-isPublished"
          checked={isPublished}
          onCheckedChange={() => setIsPublished(!isPublished)}
        />
        <Label htmlFor="edit-isPublished">Publish</Label>
      </div>
      <Button type="submit" disabled={loading}>
        {loading ? 'Updating...' : 'Update Item'}
      </Button>
    </form>
  );
};

export default EditMerchForm;
