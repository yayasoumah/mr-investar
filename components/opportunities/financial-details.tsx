"use client";

interface FinancialDetailsProps {
  financial: {
    equity_distributed: string;
    irr_expected: string;
    fundraising_goal: string;
    duration_months: string;
    pre_money_valuation: string;
  };
}

export function FinancialDetails({ financial }: FinancialDetailsProps) {
  const formatCurrency = (value: string) => {
    const number = parseFloat(value);
    return new Intl.NumberFormat('it-IT', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(number);
  };

  const formatPercentage = (value: string) => {
    const number = parseFloat(value);
    return new Intl.NumberFormat('it-IT', {
      style: 'percent',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(number / 100);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div>
        <span className="text-sm font-medium text-gray-500">Equity Distributed</span>
        <p className="text-lg font-semibold">
          {formatPercentage(financial.equity_distributed)}
        </p>
      </div>
      <div>
        <span className="text-sm font-medium text-gray-500">Expected IRR</span>
        <p className="text-lg font-semibold">
          {formatPercentage(financial.irr_expected)}
        </p>
      </div>
      <div>
        <span className="text-sm font-medium text-gray-500">Fundraising Goal</span>
        <p className="text-lg font-semibold">
          {formatCurrency(financial.fundraising_goal)}
        </p>
      </div>
      <div>
        <span className="text-sm font-medium text-gray-500">Duration</span>
        <p className="text-lg font-semibold">
          {financial.duration_months} months
        </p>
      </div>
      <div>
        <span className="text-sm font-medium text-gray-500">Pre-Money Valuation</span>
        <p className="text-lg font-semibold">
          {formatCurrency(financial.pre_money_valuation)}
        </p>
      </div>
    </div>
  );
}
