import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { XCircle, ArrowLeft, RefreshCw, Mail } from 'lucide-react';

export default function PaymentCancelPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <main className="flex-grow container mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <Card className="shadow-xl border-orange-200 bg-orange-50/50">
            <CardHeader className="text-center">
              <XCircle className="h-20 w-20 text-orange-500 mx-auto mb-4" />
              <CardTitle className="text-3xl font-bold text-orange-700">
                Payment Cancelled
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <p className="text-lg text-muted-foreground mb-4">
                  Your payment was cancelled and no charges were made.
                </p>
                <p className="text-sm text-muted-foreground">
                  We understand that sometimes plans change. Your support means a lot to us, 
                  and we're here whenever you're ready to contribute.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg border">
                <h3 className="font-semibold text-lg mb-4">Alternative Ways to Support Us</h3>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-start">
                    <span className="font-medium mr-2">•</span>
                    <div>
                      <strong>Mobile Money:</strong> Use Orange Money or Mascom MyZaka for quick payments
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="font-medium mr-2">•</span>
                    <div>
                      <strong>Bank Transfer:</strong> Direct transfer to our FNB account
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="font-medium mr-2">•</span>
                    <div>
                      <strong>Volunteer:</strong> Contribute your time and skills to our programs
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="font-medium mr-2">•</span>
                    <div>
                      <strong>Spread the Word:</strong> Share our mission with friends and family
                    </div>
                  </li>
                </ul>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-6">
                <Button asChild variant="outline" className="flex-1">
                  <Link to="/">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Home
                  </Link>
                </Button>
                <Button asChild className="flex-1">
                  <Link to="/donations">
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Try Again
                  </Link>
                </Button>
              </div>

              <div className="text-center pt-6 border-t">
                <p className="text-sm text-muted-foreground mb-2">
                  Having trouble with payments?
                </p>
                <Button variant="ghost" size="sm" asChild>
                  <a href="mailto:support@pioneer-ventures-society.org">
                    <Mail className="mr-2 h-4 w-4" />
                    Contact Support
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}