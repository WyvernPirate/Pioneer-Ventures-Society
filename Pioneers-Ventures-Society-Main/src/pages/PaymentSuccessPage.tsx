import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Download, Mail, Home } from 'lucide-react';

export default function PaymentSuccessPage() {
  const [searchParams] = useSearchParams();
  const [paymentDetails, setPaymentDetails] = useState<any>(null);

  useEffect(() => {
    // Extract payment details from URL parameters
    const details = {
      paymentId: searchParams.get('pf_payment_id'),
      reference: searchParams.get('m_payment_id'),
      amount: searchParams.get('amount_gross'),
      status: searchParams.get('payment_status'),
    };
    setPaymentDetails(details);

    // You could also verify the payment with your backend here
  }, [searchParams]);

  const downloadReceipt = () => {
    // Generate a simple receipt
    const receiptContent = `
PIONEER VENTURES SOCIETY
Donation Receipt

Payment ID: ${paymentDetails?.paymentId || 'N/A'}
Reference: ${paymentDetails?.reference || 'N/A'}
Amount: P${paymentDetails?.amount || 'N/A'}
Status: ${paymentDetails?.status || 'Completed'}
Date: ${new Date().toLocaleDateString()}

Thank you for your generous donation!
This receipt serves as proof of your contribution.

For any queries, contact us at:
Email: finance@pioneer-ventures-society.org
Phone: +267 77123456
    `;

    const blob = new Blob([receiptContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `PVS-Receipt-${paymentDetails?.reference || Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <main className="flex-grow container mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <Card className="shadow-xl border-green-200 bg-green-50/50">
            <CardHeader className="text-center">
              <CheckCircle className="h-20 w-20 text-green-500 mx-auto mb-4" />
              <CardTitle className="text-3xl font-bold text-green-700">
                Payment Successful!
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <p className="text-lg text-muted-foreground mb-4">
                  Thank you for your generous donation to Pioneer Ventures Society!
                </p>
                <p className="text-sm text-muted-foreground">
                  Your contribution will help us empower the next generation of innovators and entrepreneurs.
                </p>
              </div>

              {paymentDetails && (
                <div className="bg-white p-6 rounded-lg border">
                  <h3 className="font-semibold text-lg mb-4">Payment Details</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Payment ID:</span>
                      <p className="text-muted-foreground">{paymentDetails.paymentId || 'Processing...'}</p>
                    </div>
                    <div>
                      <span className="font-medium">Reference:</span>
                      <p className="text-muted-foreground">{paymentDetails.reference}</p>
                    </div>
                    <div>
                      <span className="font-medium">Amount:</span>
                      <p className="text-muted-foreground">P{paymentDetails.amount}</p>
                    </div>
                    <div>
                      <span className="font-medium">Status:</span>
                      <p className="text-green-600 font-medium">{paymentDetails.status || 'Completed'}</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-4">
                <h3 className="font-semibold text-lg">What happens next?</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start">
                    <Mail className="h-4 w-4 mr-2 mt-0.5 text-primary" />
                    You'll receive a confirmation email with your receipt within 24 hours
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-4 w-4 mr-2 mt-0.5 text-primary" />
                    Your donation will be allocated according to your specified purpose
                  </li>
                  <li className="flex items-start">
                    <Mail className="h-4 w-4 mr-2 mt-0.5 text-primary" />
                    We'll keep you updated on how your contribution is making an impact
                  </li>
                </ul>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-6">
                <Button onClick={downloadReceipt} variant="outline" className="flex-1">
                  <Download className="mr-2 h-4 w-4" />
                  Download Receipt
                </Button>
                <Button asChild className="flex-1">
                  <Link to="/">
                    <Home className="mr-2 h-4 w-4" />
                    Back to Home
                  </Link>
                </Button>
              </div>

              <div className="text-center pt-6 border-t">
                <p className="text-sm text-muted-foreground">
                  Questions about your donation?{' '}
                  <a 
                    href="mailto:finance@pioneer-ventures-society.org" 
                    className="text-primary hover:underline"
                  >
                    Contact our finance team
                  </a>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}