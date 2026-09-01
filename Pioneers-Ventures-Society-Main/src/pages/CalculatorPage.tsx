import { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calculator } from 'lucide-react';

interface YearBreakdown {
  year: number;
  contributions: number;
  interest: number;
  balance: number;
}

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);

const compoundingOptions = [
  { label: 'Annually', value: '1' },
  { label: 'Semi-Annually', value: '2' },
  { label: 'Quarterly', value: '4' },
  { label: 'Monthly', value: '12' },
  { label: 'Daily', value: '365' },
];

export default function CalculatorPage() {
  const [principal, setPrincipal] = useState(1000);
  const [monthlyContribution, setMonthlyContribution] = useState(100);
  const [rate, setRate] = useState(7);
  const [years, setYears] = useState(10);
  const [compoundsPerYear, setCompoundsPerYear] = useState('12');

  useEffect(() => {
    document.title = 'Compound Interest Calculator - Pioneer Ventures Society';
  }, []);

  const schedule = useMemo<YearBreakdown[]>(() => {
    const periodsPerYear = Number(compoundsPerYear);
    const ratePerPeriod = rate / 100 / periodsPerYear;
    const contributionPerPeriod = (monthlyContribution * 12) / periodsPerYear;

    let balance = principal;
    let totalContributions = principal;
    const rows: YearBreakdown[] = [];

    for (let year = 1; year <= years; year++) {
      for (let p = 0; p < periodsPerYear; p++) {
        balance = balance * (1 + ratePerPeriod) + contributionPerPeriod;
        totalContributions += contributionPerPeriod;
      }
      rows.push({
        year,
        contributions: totalContributions,
        interest: balance - totalContributions,
        balance,
      });
    }

    return rows;
  }, [principal, monthlyContribution, rate, years, compoundsPerYear]);

  const final = schedule[schedule.length - 1];

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <main className="flex-grow container mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 md:mb-16">
          <Calculator className="h-16 w-16 text-accent mx-auto mb-4" />
          <h1 className="font-headline text-4xl sm:text-5xl font-bold text-primary mb-4">
            Compound Interest Calculator
          </h1>
          <p className="text-xl text-foreground/80 max-w-3xl mx-auto">
            See how your savings can grow over time with the power of compound interest.
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-8 max-w-5xl mx-auto">
          <Card className="lg:col-span-2 shadow-lg h-fit">
            <CardHeader>
              <CardTitle className="font-headline text-primary">Your Numbers</CardTitle>
              <CardDescription>Adjust the values to match your savings plan.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="principal">Initial Amount</Label>
                <Input
                  id="principal"
                  type="number"
                  min={0}
                  value={principal}
                  onChange={(e) => setPrincipal(Math.max(0, Number(e.target.value)))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="monthlyContribution">Monthly Contribution</Label>
                <Input
                  id="monthlyContribution"
                  type="number"
                  min={0}
                  value={monthlyContribution}
                  onChange={(e) => setMonthlyContribution(Math.max(0, Number(e.target.value)))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="rate">Annual Interest Rate (%)</Label>
                <Input
                  id="rate"
                  type="number"
                  min={0}
                  step={0.1}
                  value={rate}
                  onChange={(e) => setRate(Math.max(0, Number(e.target.value)))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="years">Number of Years</Label>
                <Input
                  id="years"
                  type="number"
                  min={1}
                  max={80}
                  value={years}
                  onChange={(e) => setYears(Math.min(80, Math.max(1, Number(e.target.value))))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="compounds">Compounding Frequency</Label>
                <Select value={compoundsPerYear} onValueChange={setCompoundsPerYear}>
                  <SelectTrigger id="compounds">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {compoundingOptions.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <div className="lg:col-span-3 space-y-6">
            <Card className="shadow-lg bg-primary text-primary-foreground">
              <CardContent className="pt-6">
                <p className="text-sm uppercase tracking-wide opacity-80 mb-1">
                  Balance after {years} {years === 1 ? 'year' : 'years'}
                </p>
                <p className="font-headline text-4xl sm:text-5xl font-bold mb-4">
                  {formatCurrency(final?.balance ?? principal)}
                </p>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="opacity-80">Total Contributions</p>
                    <p className="text-lg font-semibold">{formatCurrency(final?.contributions ?? principal)}</p>
                  </div>
                  <div>
                    <p className="opacity-80">Total Interest Earned</p>
                    <p className="text-lg font-semibold">{formatCurrency(final?.interest ?? 0)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="font-headline text-primary text-lg">Year-by-Year Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-muted-foreground border-b border-border">
                        <th className="py-2 pr-4 font-medium">Year</th>
                        <th className="py-2 pr-4 font-medium">Contributions</th>
                        <th className="py-2 pr-4 font-medium">Interest</th>
                        <th className="py-2 font-medium">Balance</th>
                      </tr>
                    </thead>
                    <tbody>
                      {schedule.map((row) => (
                        <tr key={row.year} className="border-b border-border/50 last:border-0">
                          <td className="py-2 pr-4">{row.year}</td>
                          <td className="py-2 pr-4">{formatCurrency(row.contributions)}</td>
                          <td className="py-2 pr-4">{formatCurrency(row.interest)}</td>
                          <td className="py-2 font-semibold text-primary">{formatCurrency(row.balance)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
