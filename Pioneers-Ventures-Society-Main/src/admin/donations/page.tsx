import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, Download, Loader2, AlertCircle, DollarSign, Calendar, User, MessageSquare } from 'lucide-react';
import { collection, getDocs, query, orderBy, updateDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface Donation {
  id?: string;
  fullName: string;
  email: string;
  phone?: string;
  amount: number;
  donationType: 'one-time' | 'monthly';
  purpose: 'general' | 'events' | 'scholarships' | 'equipment' | 'other';
  message?: string;
  anonymous: boolean;
  donationDate: string;
  status: 'pending' | 'completed' | 'failed';
  paymentMethod?: string;
}

const purposeLabels = {
  general: 'General Support',
  events: 'Events & Workshops',
  scholarships: 'Student Scholarships',
  equipment: 'Equipment & Resources',
  other: 'Other',
};

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  completed: 'bg-green-100 text-green-800',
  failed: 'bg-red-100 text-red-800',
};

export default function AdminDonationsPage() {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    pending: 0,
    totalAmount: 0,
    completedAmount: 0,
  });

  useEffect(() => {
    const fetchDonations = async () => {
      setLoading(true);
      setError(null);
      try {
        const donationsQuery = query(collection(db, 'donations'), orderBy('donationDate', 'desc'));
        const donationsSnapshot = await getDocs(donationsQuery);
        const donationsList = donationsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Donation[];
        
        setDonations(donationsList);

        // Calculate stats
        const total = donationsList.length;
        const completed = donationsList.filter(d => d.status === 'completed').length;
        const pending = donationsList.filter(d => d.status === 'pending').length;
        const totalAmount = donationsList.reduce((sum, d) => sum + d.amount, 0);
        const completedAmount = donationsList
          .filter(d => d.status === 'completed')
          .reduce((sum, d) => sum + d.amount, 0);

        setStats({ total, completed, pending, totalAmount, completedAmount });

      } catch (err) {
        console.error("Error fetching donations:", err);
        setError("Failed to load donations. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchDonations();
  }, []);

  const updateDonationStatus = async (donationId: string, newStatus: 'completed' | 'failed') => {
    try {
      await updateDoc(doc(db, 'donations', donationId), {
        status: newStatus,
        updatedAt: new Date().toISOString(),
      });

      // Update local state
      setDonations(prev => prev.map(donation => 
        donation.id === donationId 
          ? { ...donation, status: newStatus }
          : donation
      ));

      // Recalculate stats
      const updatedDonations = donations.map(donation => 
        donation.id === donationId 
          ? { ...donation, status: newStatus }
          : donation
      );
      
      const completed = updatedDonations.filter(d => d.status === 'completed').length;
      const pending = updatedDonations.filter(d => d.status === 'pending').length;
      const completedAmount = updatedDonations
        .filter(d => d.status === 'completed')
        .reduce((sum, d) => sum + d.amount, 0);

      setStats(prev => ({ ...prev, completed, pending, completedAmount }));

    } catch (error) {
      console.error('Error updating donation status:', error);
    }
  };

  const downloadCsv = () => {
    const headers = ['Date', 'Name', 'Email', 'Amount', 'Type', 'Purpose', 'Status', 'Message'];
    const csvData = donations.map(donation => [
      new Date(donation.donationDate).toLocaleDateString(),
      donation.anonymous ? 'Anonymous' : donation.fullName,
      donation.email,
      `$${donation.amount}`,
      donation.donationType,
      purposeLabels[donation.purpose],
      donation.status,
      donation.message || '',
    ]);

    const csvContent = [headers.join(','), ...csvData.map(row => 
      row.map(cell => typeof cell === 'string' && cell.includes(',') ? `"${cell}"` : cell).join(',')
    )].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `donations-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-primary flex items-center">
        <Heart className="mr-3 h-8 w-8 text-accent" />
        Donations Management
      </h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Donations</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <Heart className="h-8 w-8 text-accent" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Completed</p>
                <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Raised</p>
                <p className="text-2xl font-bold text-primary">${stats.completedAmount}</p>
              </div>
              <DollarSign className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Donations List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>All Donations</CardTitle>
            <Button onClick={downloadCsv} variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export CSV
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center py-10">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="ml-3 text-muted-foreground">Loading donations...</p>
            </div>
          ) : error ? (
            <div className="flex items-center p-4 bg-destructive/10 text-destructive rounded-lg">
              <AlertCircle className="h-5 w-5 mr-3" />
              <p>{error}</p>
            </div>
          ) : donations.length > 0 ? (
            <div className="space-y-4">
              {donations.map((donation) => (
                <div key={donation.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <User className="h-5 w-5 text-muted-foreground" />
                        <span className="font-semibold">
                          {donation.anonymous ? 'Anonymous Donor' : donation.fullName}
                        </span>
                        <Badge className={`text-xs ${statusColors[donation.status]}`}>
                          {donation.status.charAt(0).toUpperCase() + donation.status.slice(1)}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Amount</p>
                          <p className="font-semibold text-lg">${donation.amount}</p>
                          <p className="text-xs text-muted-foreground">{donation.donationType}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Purpose</p>
                          <p className="font-medium">{purposeLabels[donation.purpose]}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Contact</p>
                          <p className="font-medium">{donation.email}</p>
                          {donation.phone && <p className="text-xs text-muted-foreground">{donation.phone}</p>}
                        </div>
                        <div>
                          <p className="text-muted-foreground">Date</p>
                          <p className="font-medium flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            {new Date(donation.donationDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      {donation.message && (
                        <div className="mt-3 p-3 bg-muted/30 rounded">
                          <p className="text-muted-foreground text-xs mb-1 flex items-center">
                            <MessageSquare className="h-3 w-3 mr-1" />
                            Message
                          </p>
                          <p className="text-sm">{donation.message}</p>
                        </div>
                      )}
                    </div>

                    {donation.status === 'pending' && (
                      <div className="flex space-x-2 ml-4">
                        <Button
                          size="sm"
                          onClick={() => updateDonationStatus(donation.id!, 'completed')}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          Mark Complete
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => updateDonationStatus(donation.id!, 'failed')}
                        >
                          Mark Failed
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Heart className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-lg font-medium text-muted-foreground">No donations yet</p>
              <p className="text-sm text-muted-foreground">Donations will appear here once people start contributing</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}