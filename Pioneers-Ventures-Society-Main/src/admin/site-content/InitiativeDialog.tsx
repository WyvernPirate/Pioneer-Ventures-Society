import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Save, Loader2, Upload } from 'lucide-react';
import type { Initiative, InitiativeFormData } from '@/types/initiatives';

const iconOptions = [
  'GraduationCap', 'ShieldHalf', 'Handshake', 'Target', 'Users', 
  'Lightbulb', 'Briefcase', 'Heart', 'Globe', 'Zap'
];

interface InitiativeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initiative?: Initiative | null;
  onSave: (formData: InitiativeFormData, imageFile: File | null) => Promise<void>;
  saving: boolean;
}

export default function InitiativeDialog({ 
  open, 
  onOpenChange, 
  initiative, 
  onSave, 
  saving 
}: InitiativeDialogProps) {
  const [formData, setFormData] = useState<InitiativeFormData>({
    title: '',
    description: '',
    icon: 'Target',
    link: '',
    order: 1,
    isActive: true,
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');

  useEffect(() => {
    if (initiative) {
      setFormData({
        title: initiative.title,
        description: initiative.description,
        icon: initiative.icon,
        link: initiative.link,
        order: initiative.order,
        isActive: initiative.isActive,
      });
      setImagePreview(initiative.imageUrl);
    } else {
      setFormData({
        title: '',
        description: '',
        icon: 'Target',
        link: '',
        order: 1,
        isActive: true,
      });
      setImagePreview('');
    }
    setImageFile(null);
  }, [initiative, open]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.description.trim()) {
      return;
    }
    
    await onSave(formData, imageFile);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {initiative ? 'Edit Initiative' : 'Add New Initiative'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g., Skill Development Workshops"
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe the initiative..."
              rows={4}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="icon">Icon</Label>
              <Select
                value={formData.icon}
                onValueChange={(value) => setFormData({ ...formData, icon: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {iconOptions.map((icon) => (
                    <SelectItem key={icon} value={icon}>
                      {icon}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="order">Display Order</Label>
              <Input
                id="order"
                type="number"
                min="1"
                value={formData.order}
                onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 1 })}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="link">Link</Label>
            <Input
              id="link"
              value={formData.link}
              onChange={(e) => setFormData({ ...formData, link: e.target.value })}
              placeholder="e.g., /events or https://example.com"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="active"
              checked={formData.isActive}
              onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
            />
            <Label htmlFor="active">Active</Label>
          </div>

          <div>
            <Label htmlFor="image">
              Image {!initiative && '*'} (Required: 600x400 pixels)
            </Label>
            <div className="space-y-3">
              {imagePreview && (
                <div className="flex justify-center">
                  <img 
                    src={imagePreview} 
                    alt="Preview" 
                    className="max-w-full h-40 object-cover rounded border"
                  />
                </div>
              )}
              <div className="flex items-center gap-4">
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="flex-1"
                />
                <Upload className="h-5 w-5 text-muted-foreground" />
              </div>
              {imageFile && (
                <p className="text-sm text-muted-foreground">
                  New image selected: {imageFile.name}
                </p>
              )}
              <p className="text-xs text-muted-foreground">
                Image must be exactly 600x400 pixels for proper display
              </p>
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={saving}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={saving || (!formData.title.trim() || !formData.description.trim() || (!initiative && !imageFile))}
              className="bg-accent text-accent-foreground hover:bg-accent/90"
            >
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  {initiative ? 'Update' : 'Create'} Initiative
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}