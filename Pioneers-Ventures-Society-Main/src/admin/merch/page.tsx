
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { getAllMerch, deleteMerch,type MerchItem } from '@/firebase/merchService';
import AddMerchForm from './AddMerchForm';
import EditMerchForm from './EditMerchForm';

const MerchPage: React.FC = () => {
  const [merch, setMerch] = useState<MerchItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedMerch, setSelectedMerch] = useState<MerchItem | null>(null);

  const fetchMerch = async () => {
    setLoading(true);
    const merchList = await getAllMerch();
    setMerch(merchList);
    setLoading(false);
  };

  useEffect(() => {
    fetchMerch();
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      await deleteMerch(id);
      fetchMerch();
    }
  };

  const handleEditClick = (item: MerchItem) => {
    setSelectedMerch(item);
    setIsEditDialogOpen(true);
  };

  const handleAddSuccess = () => {
    setIsAddDialogOpen(false);
    fetchMerch();
  };

  const handleEditSuccess = () => {
    setIsEditDialogOpen(false);
    setSelectedMerch(null);
    fetchMerch();
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Merchandise Management</h1>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>Add New Item</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Merchandise</DialogTitle>
            </DialogHeader>
            <AddMerchForm onSuccess={handleAddSuccess} />
          </DialogContent>
        </Dialog>
      </div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Published</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {merch.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.name}</TableCell>
                <TableCell>${item.price.toFixed(2)}</TableCell>
                <TableCell>{item.isPublished ? 'Yes' : 'No'}</TableCell>
                <TableCell>
                  <Button variant="outline" size="sm" onClick={() => handleEditClick(item)}>
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    className="ml-2"
                    onClick={() => handleDelete(item.id!)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {selectedMerch && (
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Merchandise</DialogTitle>
            </DialogHeader>
            <EditMerchForm
              merchItem={selectedMerch}
              onSuccess={handleEditSuccess}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default MerchPage;
