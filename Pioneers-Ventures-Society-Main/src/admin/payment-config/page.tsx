import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { CreditCard, Plus, Edit, Trash2, Save, X, Loader2, Sprout } from 'lucide-react';
import { collection, getDocs, query, orderBy, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';
import type { PaymentConfig, PaymentConfigFormData } from '@/types/payment-config';
import { seedPaymentMethods } from './seedPaymentMethods';

const iconOptions = ['🟠', '🔵', '🏦', '💰', '🏛️', '📱', '💳', '💸', '🏪', '🔗'];
const colorOptions = [
  'bg-orange-500', 'bg-blue-500', 'bg-green-600', 'bg-emerald-600', 
  'bg-gray-600', 'bg-purple-500', 'bg-red-500', 'bg-yellow-500', 
  'bg-pink-500', 'bg-indigo-500'
];

export default function PaymentConfigPage() {
  const { toast } = useToast();
  const [paymentMethods, setPaymentMethods] = useState<PaymentConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingMethod, setEditingMethod] = useState<PaymentConfig | null>(null);
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState<PaymentConfigFormData>({
    name: '',
    description: '',
    icon: '📱',
    number: '',
    instructions: [''],
    isActive: true,
    order: 1,
    color: 'bg-blue-500'
  });

  useEffect(() => {
    fetchPaymentMethods();
  }, []);

  const fetchPaymentMethods = async () => {
    setLoading(true);
    try {
      const paymentMethodsQuery = query(collection(db, 'paymentMethods'), orderBy('order', 'asc'));
      const snapshot = await getDocs(paymentMethodsQuery);
      const methods = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as PaymentConfig[];
      
      setPaymentMethods(methods);
    } catch (error) {
      console.error('Error fetching payment methods:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load payment methods.",
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      icon: '📱',
      number: '',
      instructions: [''],
      isActive: true,
      order: paymentMethods.length + 1,
      color: 'bg-blue-500'
    });
    setEditingMethod(null);
  };

  const handleEdit = (method: PaymentConfig) => {
    setEditingMethod(method);
    setFormData({
      name: method.name,
      description: method.description,
      icon: method.icon,
      number: method.number,
      instructions: method.instructions,
      isActive: method.isActive,
      order: method.order,
      color: method.color
    });
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!formData.name.trim() || !formData.number.trim()) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Name and number are required.",
      });
      return;
    }

    setSaving(true);
    try {
      const methodData = {
        ...formData,
        instructions: formData.instructions.filter(inst => inst.trim() !== ''),
        updatedAt: new Date().toISOString(),
        ...(editingMethod ? {} : { createdAt: new Date().toISOString() }),
      };

      if (editingMethod) {
        await updateDoc(doc(db, 'paymentMethods', editingMethod.id), methodData);
        setPaymentMethods(prev => prev.map(method => 
          method.id === editingMethod.id ? { ...method, ...methodData } : method
        ));
        toast({
          title: "Success",
          description: "Payment method updated successfully.",
        });
      } else {
        const docRef = await addDoc(collection(db, 'paymentMethods'), methodData);
        setPaymentMethods(prev => [...prev, { id: docRef.id, ...methodData } as PaymentConfig]);
        toast({
          title: "Success",
          description: "Payment method created successfully.",
        });
      }

      setShowForm(false);
      resetForm();
    } catch (error) {
      console.error('Error saving payment method:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save payment method.",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (method: PaymentConfig) => {
    if (!confirm(`Are you sure you want to delete "${method.name}"?`)) return;

    try {
      await deleteDoc(doc(db, 'paymentMethods', method.id));
      setPaymentMethods(prev => prev.filter(m => m.id !== method.id));
      toast({
        title: "Success",
        description: "Payment method deleted successfully.",
      });
    } catch (error) {
      console.error('Error deleting payment method:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete payment method.",
      });
    }
  };

  const addInstruction = () => {
    setFormData(prev => ({
      ...prev,
      instructions: [...prev.instructions, '']
    }));
  };

  const updateInstruction = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      instructions: prev.instructions.map((inst, i) => i === index ? value : inst)
    }));
  };

  const removeInstruction = (index: number) => {
    setFormData(prev => ({
      ...prev,
      instructions: prev.instructions.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-primary flex items-center">
          <CreditCard className="mr-3 h-8 w-8 text-accent" />
          Payment Methods Configuration
        </h1>
        <Button 
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
          className="bg-accent text-accent-foreground hover:bg-accent/90"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Payment Method
        </Button>
      </div>

      {/* Payment Methods List */}
      <Card>
        <CardHeader>
          <CardTitle>Current Payment Methods</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : paymentMethods.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No payment methods configured. Add your first payment method to get started.
            </p>
          ) : (
            <div className="space-y-4">
              {paymentMethods.map((method) => (
                <div key={method.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <span className="text-2xl">{method.icon}</span>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h3 className="font-semibold">{method.name}</h3>
                          <Badge variant={method.isActive ? 'default' : 'secondary'}>
                            {method.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{method.description}</p>
                        <p className="text-sm font-mono mt-1">{method.number}</p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(method)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(method)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Payment Method Form */}
      {showForm && (
        <Card className="border-accent">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>
                {editingMethod ? 'Edit Payment Method' : 'Add New Payment Method'}
              </CardTitle>
              <Button
                variant="ghost"
                onClick={() => {
                  setShowForm(false);
                  resetForm();
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Orange Money"
                />
              </div>
              <div>
                <Label htmlFor="number">Number/Account *</Label>
                <Input
                  id="number"
                  value={formData.number}
                  onChange={(e) => setFormData({ ...formData, number: e.target.value })}
                  placeholder="e.g., +267 77123456"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="e.g., Send money via Orange Money"
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label>Icon</Label>
                <div className="grid grid-cols-5 gap-2 mt-2">
                  {iconOptions.map((icon) => (
                    <Button
                      key={icon}
                      type="button"
                      variant={formData.icon === icon ? "default" : "outline"}
                      onClick={() => setFormData({ ...formData, icon })}
                      className="h-10 w-10 p-0"
                    >
                      {icon}
                    </Button>
                  ))}
                </div>
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
              <div className="flex items-center space-x-2 pt-6">
                <Switch
                  id="active"
                  checked={formData.isActive}
                  onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                />
                <Label htmlFor="active">Active</Label>
              </div>
            </div>

            <div>
              <Label>Color Theme</Label>
              <div className="grid grid-cols-5 gap-2 mt-2">
                {colorOptions.map((color) => (
                  <Button
                    key={color}
                    type="button"
                    variant={formData.color === color ? "default" : "outline"}
                    onClick={() => setFormData({ ...formData, color })}
                    className={`h-10 w-10 p-0 ${color}`}
                  >
                    {formData.color === color && '✓'}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <Label>Instructions</Label>
                <Button type="button" variant="outline" size="sm" onClick={addInstruction}>
                  <Plus className="h-4 w-4 mr-1" />
                  Add Step
                </Button>
              </div>
              <div className="space-y-2">
                {formData.instructions.map((instruction, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <span className="text-sm font-medium w-8">{index + 1}.</span>
                    <Textarea
                      value={instruction}
                      onChange={(e) => updateInstruction(index, e.target.value)}
                      placeholder="Enter instruction step..."
                      rows={2}
                      className="flex-1"
                    />
                    {formData.instructions.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeInstruction(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex space-x-2 pt-4">
              <Button
                onClick={handleSave}
                disabled={saving}
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
                    {editingMethod ? 'Update' : 'Create'} Payment Method
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setShowForm(false);
                  resetForm();
                }}
                disabled={saving}
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}