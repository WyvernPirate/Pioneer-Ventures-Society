import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
// Using checkbox instead of switch for now
import { Plus, Edit, Trash2, Save, X, Target } from 'lucide-react';
import { 
  getAllDonationPurposes, 
  addDonationPurpose, 
  updateDonationPurpose, 
  deleteDonationPurpose,
  seedDonationPurposes 
} from '@/lib/donation-purposes';
import type { DonationPurpose, DonationPurposeFormData } from '@/types/donation-purposes';
import { useToast } from '@/hooks/use-toast';

export default function AdminDonationPurposesPage() {
  const { toast } = useToast();
  const [purposes, setPurposes] = useState<DonationPurpose[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState<DonationPurposeFormData>({
    value: '',
    label: '',
    description: '',
    isActive: true,
    order: 1
  });

  useEffect(() => {
    fetchPurposes();
  }, []);

  const fetchPurposes = async () => {
    setLoading(true);
    try {
      const purposesList = await getAllDonationPurposes();
      setPurposes(purposesList);
    } catch (error) {
      console.error('Error fetching donation purposes:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load donation purposes.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSeed = async () => {
    try {
      await seedDonationPurposes();
      await fetchPurposes();
      toast({
        title: "Success",
        description: "Default donation purposes have been seeded.",
      });
    } catch (error) {
      console.error('Error seeding purposes:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to seed donation purposes.",
      });
    }
  };

  const handleAdd = async () => {
    try {
      await addDonationPurpose(formData);
      await fetchPurposes();
      setShowAddForm(false);
      setFormData({
        value: '',
        label: '',
        description: '',
        isActive: true,
        order: purposes.length + 1
      });
      toast({
        title: "Success",
        description: "Donation purpose added successfully.",
      });
    } catch (error) {
      console.error('Error adding purpose:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add donation purpose.",
      });
    }
  };

  const handleUpdate = async (id: string) => {
    try {
      await updateDonationPurpose(id, formData);
      await fetchPurposes();
      setEditingId(null);
      toast({
        title: "Success",
        description: "Donation purpose updated successfully.",
      });
    } catch (error) {
      console.error('Error updating purpose:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update donation purpose.",
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this donation purpose?')) return;
    
    try {
      await deleteDonationPurpose(id);
      await fetchPurposes();
      toast({
        title: "Success",
        description: "Donation purpose deleted successfully.",
      });
    } catch (error) {
      console.error('Error deleting purpose:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete donation purpose.",
      });
    }
  };

  const startEdit = (purpose: DonationPurpose) => {
    setEditingId(purpose.id);
    setFormData({
      value: purpose.value,
      label: purpose.label,
      description: purpose.description,
      isActive: purpose.isActive,
      order: purpose.order
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setShowAddForm(false);
    setFormData({
      value: '',
      label: '',
      description: '',
      isActive: true,
      order: purposes.length + 1
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-primary flex items-center">
          <Target className="mr-3 h-8 w-8 text-accent" />
          Donation Purposes Management
        </h1>
        <div className="flex space-x-2">
          {purposes.length === 0 && (
            <Button onClick={handleSeed} variant="outline">
              Seed Default Purposes
            </Button>
          )}
          <Button onClick={() => setShowAddForm(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Purpose
          </Button>
        </div>
      </div>

      {/* Add Form */}
      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle>Add New Donation Purpose</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="value">Value (ID)</Label>
                <Input
                  id="value"
                  value={formData.value}
                  onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                  placeholder="e.g., scholarships"
                />
              </div>
              <div>
                <Label htmlFor="label">Display Label</Label>
                <Input
                  id="label"
                  value={formData.label}
                  onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                  placeholder="e.g., Student Scholarships"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe how donations for this purpose will be used"
                rows={3}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="rounded"
                />
                <Label>Active</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Label htmlFor="order">Order:</Label>
                <Input
                  id="order"
                  type="number"
                  value={formData.order}
                  onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 1 })}
                  className="w-20"
                />
              </div>
            </div>
            <div className="flex space-x-2">
              <Button onClick={handleAdd}>
                <Save className="mr-2 h-4 w-4" />
                Add Purpose
              </Button>
              <Button variant="outline" onClick={cancelEdit}>
                <X className="mr-2 h-4 w-4" />
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Purposes List */}
      <Card>
        <CardHeader>
          <CardTitle>Donation Purposes</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : purposes.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">No donation purposes found.</p>
              <Button onClick={handleSeed}>
                Seed Default Purposes
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {purposes.map((purpose) => (
                <div key={purpose.id} className="border rounded-lg p-4">
                  {editingId === purpose.id ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Value (ID)</Label>
                          <Input
                            value={formData.value}
                            onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                          />
                        </div>
                        <div>
                          <Label>Display Label</Label>
                          <Input
                            value={formData.label}
                            onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                          />
                        </div>
                      </div>
                      <div>
                        <Label>Description</Label>
                        <Textarea
                          value={formData.description}
                          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                          rows={3}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={formData.isActive}
                            onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                            className="rounded"
                          />
                          <Label>Active</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Label>Order:</Label>
                          <Input
                            type="number"
                            value={formData.order}
                            onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 1 })}
                            className="w-20"
                          />
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button onClick={() => handleUpdate(purpose.id)}>
                          <Save className="mr-2 h-4 w-4" />
                          Save
                        </Button>
                        <Button variant="outline" onClick={cancelEdit}>
                          <X className="mr-2 h-4 w-4" />
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="font-semibold">{purpose.label}</h3>
                          <Badge variant={purpose.isActive ? "default" : "secondary"}>
                            {purpose.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                          <span className="text-sm text-muted-foreground">Order: {purpose.order}</span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-1">
                          <strong>Value:</strong> {purpose.value}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {purpose.description}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => startEdit(purpose)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(purpose.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}