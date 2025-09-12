import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Heart, Eye, Check, X, Download, Filter } from 'lucide-react';
import { collection, getDocs, query, orderBy, updateDoc, doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';
import { sendDonationApprovedEmail, sendDonationRejectedEmail } from '@/lib/email';

interface Donation {
  id: string;
  name: string;
  email: string;
  phone?: string;
  amount: number;
  donationType: 'one-time' | 'monthly';
  purpose: string;
  paymentMethod: string;
  proofOfPayment?: string;
  status: 'awaiting_payment' | 'pending_verification' | 'verified' | 'rejected';
  donationDate: string;
  reference: string;
  message?: string;
  anonymous: boolean;
}

export default function AdminDonationsPage() {
  const { toast } = useToast();
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'verified' | 'rejected'>('all');
  const [selectedDonation, setSelectedDonation] = useState<Donation | null>(null);
  const [showRejectionDialog, setShowRejectionDialog] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [donationToReject, setDonationToReject] = useState<string | null>(null);

  useEffect(() => {
    fetchDonations();
  }, []);

  const fetchDonations = async () => {
    setLoading(true);
    try {
      const donationsQuery = query(collection(db, 'donations'), orderBy('donationDate', 'desc'));
      const snapshot = await getDocs(donationsQuery);
      const donationsList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Donation[];

      setDonations(donationsList);
    } catch (error) {
      console.error('Error fetching donations:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load donations.",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateDonationStatus = async (donationId: string, status: Donation['status'], rejectionReason?: string) => {
    try {
      // Get the donation details first
      const donationDoc = await getDoc(doc(db, 'donations', donationId));
      const donationData = donationDoc.data() as Donation;

      // Update the donation status
      await updateDoc(doc(db, 'donations', donationId), {
        status,
        verifiedAt: new Date().toISOString(),
        rejectionReason: rejectionReason || null,
      });

      // Update local state
      setDonations(prev => prev.map(donation =>
        donation.id === donationId ? { ...donation, status } : donation
      ));

      // Send email notification
      try {
        if (status === 'verified') {
          await sendDonationApprovedEmail({
            email: donationData.email,
            name: donationData.name,
            amount: donationData.amount,
            reference: donationData.reference,
            purpose: donationData.purpose,
          });
        } else if (status === 'rejected') {
          await sendDonationRejectedEmail({
            email: donationData.email,
            name: donationData.name,
            amount: donationData.amount,
            reference: donationData.reference,
            reason: rejectionReason || 'Payment verification failed. Please contact us for assistance.',
          });
        }
        console.log(`Email notification sent for ${status} donation`);
      } catch (emailError) {
        console.error('Failed to send email notification:', emailError);
        // Don't fail the status update if email fails
      }

      toast({
        title: "Success",
        description: `Donation ${status === 'verified' ? 'approved' : 'rejected'} successfully. Email notification sent.`,
      });
    } catch (error) {
      console.error('Error updating donation:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update donation status.",
      });
    }
  };

  const getStatusBadge = (status: Donation['status']) => {
    const variants = {
      awaiting_payment: { variant: 'secondary' as const, label: 'Awaiting Payment', className: '' },
      pending_verification: { variant: 'default' as const, label: 'Pending Verification', className: '' },
      verified: { variant: 'default' as const, label: 'Verified', className: 'bg-green-500 hover:bg-green-600' },
      rejected: { variant: 'destructive' as const, label: 'Rejected', className: '' },
    };

    const config = variants[status];
    return (
      <Badge variant={config.variant} className={config.className}>
        {config.label}
      </Badge>
    );
  };

  const filteredDonations = donations.filter(donation => {
    if (filter === 'all') return true;
    if (filter === 'pending') return donation.status === 'pending_verification';
    return donation.status === filter;
  });

  const handleRejectDonation = (donationId: string) => {
    setDonationToReject(donationId);
    setRejectionReason('');
    setShowRejectionDialog(true);
  };

  const confirmRejection = async () => {
    if (donationToReject && rejectionReason.trim()) {
      await updateDonationStatus(donationToReject, 'rejected', rejectionReason.trim());
      setShowRejectionDialog(false);
      setDonationToReject(null);
      setRejectionReason('');
    }
  };

  const downloadCsv = () => {
    const csvHeaders = ['Date', 'Name', 'Email', 'Amount', 'Method', 'Purpose', 'Status', 'Reference'];
    const csvData = filteredDonations.map(donation => [
      new Date(donation.donationDate).toLocaleDateString(),
      donation.anonymous ? 'Anonymous' : donation.name,
      donation.email,
      `P${donation.amount}`,
      donation.paymentMethod,
      donation.purpose,
      donation.status,
      donation.reference
    ]);

    const csvContent = [csvHeaders.join(','), ...csvData.map(row => row.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `donations-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-primary flex items-center">
          <Heart className="mr-3 h-8 w-8 text-accent" />
          Donations Management
        </h1>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={downloadCsv}>
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex space-x-2">
        {[
          { key: 'all', label: 'All' },
          { key: 'pending', label: 'Pending Verification' },
          { key: 'verified', label: 'Verified' },
          { key: 'rejected', label: 'Rejected' },
        ].map(({ key, label }) => (
          <Button
            key={key}
            variant={filter === key ? 'default' : 'outline'}
            onClick={() => setFilter(key as any)}
            size="sm"
          >
            <Filter className="mr-2 h-4 w-4" />
            {label} ({donations.filter(d => key === 'all' || (key === 'pending' ? d.status === 'pending_verification' : d.status === key)).length})
          </Button>
        ))}
      </div>

      {/* Donations List */}
      <Card>
        <CardHeader>
          <CardTitle>
            {filter === 'all' ? 'All Donations' :
              filter === 'pending' ? 'Pending Verification' :
                filter === 'verified' ? 'Verified Donations' : 'Rejected Donations'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : filteredDonations.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No donations found.</p>
          ) : (
            <div className="space-y-4">
              {filteredDonations.map((donation) => (
                <div key={donation.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-4 mb-2">
                        <h3 className="font-semibold">
                          {donation.anonymous ? 'Anonymous Donor' : donation.name}
                        </h3>
                        {getStatusBadge(donation.status)}
                        <span className="text-sm text-muted-foreground">
                          {new Date(donation.donationDate).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="font-medium">Amount:</span>
                          <p className="text-green-600 font-semibold">P{donation.amount}</p>
                        </div>
                        <div>
                          <span className="font-medium">Method:</span>
                          <p className="capitalize">{donation.paymentMethod.replace('_', ' ')}</p>
                        </div>
                        <div>
                          <span className="font-medium">Purpose:</span>
                          <p className="capitalize">{donation.purpose.replace('_', ' ')}</p>
                        </div>
                        <div>
                          <span className="font-medium">Reference:</span>
                          <p className="font-mono text-xs">{donation.reference}</p>
                        </div>
                      </div>
                      {donation.message && (
                        <div className="mt-2">
                          <span className="font-medium text-sm">Message:</span>
                          <p className="text-sm text-muted-foreground italic">"{donation.message}"</p>
                        </div>
                      )}
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedDonation(donation)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      {donation.status === 'pending_verification' && (
                        <>
                          <Button
                            variant="default"
                            size="sm"
                            onClick={() => updateDonationStatus(donation.id, 'verified')}
                            className="bg-green-500 hover:bg-green-600"
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleRejectDonation(donation.id)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Donation Details Modal */}
      {selectedDonation && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Donation Details</CardTitle>
                <Button variant="ghost" onClick={() => setSelectedDonation(null)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="font-medium">Donor:</span>
                  <p>{selectedDonation.anonymous ? 'Anonymous' : selectedDonation.name}</p>
                </div>
                <div>
                  <span className="font-medium">Email:</span>
                  <p>{selectedDonation.email}</p>
                </div>
                <div>
                  <span className="font-medium">Phone:</span>
                  <p>{selectedDonation.phone || 'Not provided'}</p>
                </div>
                <div>
                  <span className="font-medium">Amount:</span>
                  <p className="text-green-600 font-semibold">P{selectedDonation.amount}</p>
                </div>
                <div>
                  <span className="font-medium">Type:</span>
                  <p className="capitalize">{selectedDonation.donationType.replace('-', ' ')}</p>
                </div>
                <div>
                  <span className="font-medium">Purpose:</span>
                  <p className="capitalize">{selectedDonation.purpose.replace('_', ' ')}</p>
                </div>
                <div>
                  <span className="font-medium">Payment Method:</span>
                  <p className="capitalize">{selectedDonation.paymentMethod.replace('_', ' ')}</p>
                </div>
                <div>
                  <span className="font-medium">Status:</span>
                  <div>{getStatusBadge(selectedDonation.status)}</div>
                </div>
              </div>

              {selectedDonation.message && (
                <div>
                  <span className="font-medium">Message:</span>
                  <p className="text-muted-foreground italic">"{selectedDonation.message}"</p>
                </div>
              )}

              {selectedDonation.proofOfPayment && (
                <div>
                  <span className="font-medium">Proof of Payment:</span>
                  <div className="mt-2">
                    <img
                      src={selectedDonation.proofOfPayment}
                      alt="Proof of payment"
                      className="max-w-full h-auto rounded border"
                    />
                  </div>
                </div>
              )}

              {selectedDonation.status === 'pending_verification' && (
                <div className="flex space-x-2 pt-4 border-t">
                  <Button
                    onClick={() => {
                      updateDonationStatus(selectedDonation.id, 'verified');
                      setSelectedDonation(null);
                    }}
                    className="bg-green-500 hover:bg-green-600"
                  >
                    <Check className="mr-2 h-4 w-4" />
                    Approve Donation
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => {
                      handleRejectDonation(selectedDonation.id);
                      setSelectedDonation(null);
                    }}
                  >
                    <X className="mr-2 h-4 w-4" />
                    Reject Donation
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Rejection Reason Dialog */}
      {showRejectionDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="max-w-md w-full">
            <CardHeader>
              <CardTitle className="text-red-600">Reject Donation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="rejection-reason">Reason for rejection:</Label>
                <Textarea
                  id="rejection-reason"
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="Please provide a clear reason for rejecting this donation..."
                  rows={4}
                  className="mt-1"
                />
              </div>
              <div className="flex space-x-2 justify-end">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowRejectionDialog(false);
                    setDonationToReject(null);
                    setRejectionReason('');
                  }}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={confirmRejection}
                  disabled={!rejectionReason.trim()}
                >
                  <X className="mr-2 h-4 w-4" />
                  Reject Donation
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}