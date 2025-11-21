import React, { useState, useEffect } from 'react';
import { Transaction, Budget } from '../types';
import { analyzeFinancials } from '../services/geminiService';
import { storage } from '../utils/storage';
import { useToast } from './ui/Toast';
import {
  Wallet,
  PieChart,
  TrendingUp,
  CreditCard,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Search,
  Sparkles,
  AlertCircle
} from 'lucide-react';

export const FinanceOS: React.FC = () => {
  const toast = useToast();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);

  const [aiQuery, setAiQuery] = useState('');
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Load financial data from storage on mount
  useEffect(() => {
    try {
      const savedData = localStorage.getItem('infigenie_finance');
      if (savedData) {
        const parsed = JSON.parse(savedData);
        if (parsed.transactions && Array.isArray(parsed.transactions)) {
          setTransactions(parsed.transactions);
        }
        if (parsed.budgets && Array.isArray(parsed.budgets)) {
          setBudgets(parsed.budgets);
        }
      }

      // Initialize with demo data if empty
      if (!savedData || (savedData && JSON.parse(savedData).transactions?.length === 0)) {
        const demoTransactions: Transaction[] = [
          { id: '1', merchant: 'AWS Web Services', amount: 245.00, date: '2025-11-19', category: 'Infrastructure', type: 'expense' },
          { id: '2', merchant: 'Client Retainer - TechCorp', amount: 5000.00, date: '2025-11-18', category: 'Revenue', type: 'income' },
          { id: '3', merchant: 'Uber Business', amount: 45.50, date: '2025-11-18', category: 'Transport', type: 'expense' },
          { id: '4', merchant: 'WeWork Subscription', amount: 450.00, date: '2025-11-15', category: 'Office', type: 'expense' },
          { id: '5', merchant: 'Starbucks', amount: 12.40, date: '2025-11-14', category: 'Meals', type: 'expense' },
        ];
        const demoBudgets: Budget[] = [
          { category: 'Infrastructure', limit: 500, spent: 245 },
          { category: 'Office', limit: 1000, spent: 450 },
          { category: 'Meals', limit: 200, spent: 145 },
          { category: 'Marketing', limit: 2000, spent: 1200 },
        ];
        setTransactions(demoTransactions);
        setBudgets(demoBudgets);
      }
    } catch (error) {
      console.error('Failed to load financial data:', error);
    }
  }, []);

  // Save financial data to storage whenever they change
  useEffect(() => {
    try {
      const financeData = {
        transactions,
        budgets,
        lastModified: new Date().toISOString()
      };
      localStorage.setItem('infigenie_finance', JSON.stringify(financeData));
    } catch (error) {
      console.error('Failed to save financial data:', error);
    }
  }, [transactions, budgets]);

  const handleFinancialAnalysis = async () => {
    if (!aiQuery) return;
    setIsAnalyzing(true);
    try {
      const response = await analyzeFinancials(transactions, aiQuery);
      setAiResponse(response);
      setAiQuery('');
    } catch (error) {
      toast.error('Failed to analyze finances. Please try again.');
      setAiResponse('Unable to analyze at this time. Please check your API connection.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Calculated stats
  const totalIncome = transactions.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
  const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);
  const netIncome = totalIncome - totalExpenses;

  return (
    <div className="h-full flex flex-col animate-in fade-in duration-300 font-mono">
      <div className="flex justify-between items-center mb-6 border-l-4 border-amber-500 pl-4">
        <div>
          <div className="text-[10px] text-amber-600 tracking-widest">[ FINANCIAL OPERATIONS ]</div>
          <h2 className="text-3xl font-bold text-amber-500 tracking-wide">FINANCE OS</h2>
          <p className="text-amber-700 text-sm tracking-wide">CAPITAL FLOW MONITORING</p>
        </div>
        <div className="flex gap-2">
          <button className="bg-amber-500 hover:bg-amber-400 text-black px-4 py-2 text-xs font-bold tracking-wider flex items-center gap-2 transition-colors border-2 border-amber-400">
            <Wallet size={16} /> CONNECT BANK
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 overflow-hidden">
        
        {/* Left Column: Overview & Budgets */}
        <div className="lg:col-span-2 flex flex-col gap-6 overflow-y-auto pr-2">
          
          {/* Stats Cards */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-black border-2 border-amber-900/50 p-5 relative">
              <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-amber-500"></div>
              <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-amber-500"></div>
              <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-amber-500"></div>
              <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-amber-500"></div>
              <div className="text-amber-700 text-[10px] mb-1 flex items-center gap-2 tracking-wider"><DollarSign size={14} /> NET MONTHLY</div>
              <div className={`text-2xl font-bold ${netIncome >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                ${netIncome.toLocaleString()}
              </div>
            </div>
            <div className="bg-black border-2 border-amber-900/50 p-5 relative">
              <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-amber-500"></div>
              <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-amber-500"></div>
              <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-amber-500"></div>
              <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-amber-500"></div>
              <div className="text-amber-700 text-[10px] mb-1 flex items-center gap-2 tracking-wider"><ArrowDownRight size={14} className="text-emerald-500" /> INCOME</div>
              <div className="text-2xl font-bold text-amber-500">
                ${totalIncome.toLocaleString()}
              </div>
            </div>
            <div className="bg-black border-2 border-amber-900/50 p-5 relative">
              <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-amber-500"></div>
              <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-amber-500"></div>
              <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-amber-500"></div>
              <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-amber-500"></div>
              <div className="text-amber-700 text-[10px] mb-1 flex items-center gap-2 tracking-wider"><ArrowUpRight size={14} className="text-rose-500" /> EXPENSES</div>
              <div className="text-2xl font-bold text-amber-500">
                ${totalExpenses.toLocaleString()}
              </div>
            </div>
          </div>

          {/* Transactions */}
          <div className="bg-black border-2 border-amber-900/50 overflow-hidden flex-1 min-h-[300px] relative">
            <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-amber-500"></div>
            <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-amber-500"></div>
            <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-amber-500"></div>
            <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-amber-500"></div>

            <div className="p-4 border-b-2 border-amber-900/50 flex justify-between items-center">
              <h3 className="font-bold text-amber-500 flex items-center gap-2 tracking-wide">
                <CreditCard size={18} className="text-amber-600" /> RECENT TRANSACTIONS
              </h3>
              <button className="text-[10px] text-amber-600 hover:text-amber-400 tracking-wider">VIEW ALL</button>
            </div>
            <div className="divide-y divide-amber-900/30">
              {transactions.map(tx => (
                <div key={tx.id} className="p-4 flex items-center justify-between hover:bg-amber-950/10 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 border-2 flex items-center justify-center ${tx.type === 'income' ? 'bg-emerald-950/20 text-emerald-400 border-emerald-800' : 'bg-amber-950/20 text-amber-600 border-amber-900/50'}`}>
                       {tx.type === 'income' ? <DollarSign size={18} /> : <CreditCard size={18} />}
                    </div>
                    <div>
                      <div className="font-bold text-amber-500 text-sm tracking-wide">{tx.merchant}</div>
                      <div className="text-[10px] text-amber-700 tracking-wider">{tx.category.toUpperCase()} • {tx.date}</div>
                    </div>
                  </div>
                  <div className={`font-mono font-bold text-sm ${tx.type === 'income' ? 'text-emerald-400' : 'text-amber-500'}`}>
                    {tx.type === 'income' ? '+' : '-'}${tx.amount.toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: AI & Budgets */}
        <div className="flex flex-col gap-6 overflow-y-auto">
          
          {/* AI Advisor */}
          <div className="bg-fuchsia-950/20 border-2 border-fuchsia-900/50 p-5 relative">
             <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-fuchsia-500"></div>
             <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-fuchsia-500"></div>
             <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-fuchsia-500"></div>
             <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-fuchsia-500"></div>

             <h3 className="font-bold text-fuchsia-400 mb-3 flex items-center gap-2 tracking-wider">
               <Sparkles size={16} /> CFO INTELLIGENCE
             </h3>
             <div className="space-y-3">
               <input
                 type="text"
                 placeholder="ASK ABOUT YOUR FINANCES..."
                 className="w-full bg-black border border-fuchsia-900/50 px-3 py-2 text-xs text-fuchsia-300 placeholder-fuchsia-900 focus:border-fuchsia-500 outline-none tracking-wide"
                 value={aiQuery}
                 onChange={(e) => setAiQuery(e.target.value)}
                 onKeyDown={(e) => e.key === 'Enter' && handleFinancialAnalysis()}
               />
               <button
                 onClick={handleFinancialAnalysis}
                 disabled={isAnalyzing}
                 className="w-full bg-fuchsia-950/30 hover:bg-fuchsia-950/50 text-fuchsia-300 py-2 border border-fuchsia-900/50 text-[10px] font-bold tracking-widest transition-colors flex justify-center"
               >
                 {isAnalyzing ? 'ANALYZING...' : 'ANALYZE DATA'}
               </button>
             </div>
             {aiResponse && (
               <div className="mt-4 p-3 bg-fuchsia-950/30 border border-fuchsia-900/50 text-xs text-fuchsia-200 animate-in fade-in slide-in-from-top-2 tracking-wide">
                 {aiResponse}
               </div>
             )}
          </div>

          {/* Budgets */}
          <div className="bg-black border-2 border-amber-900/50 p-5 relative">
            <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-amber-500"></div>
            <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-amber-500"></div>
            <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-amber-500"></div>
            <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-amber-500"></div>

            <h3 className="font-bold text-amber-500 mb-4 flex items-center gap-2 tracking-wider">
              <PieChart size={18} className="text-amber-600" /> BUDGET STATUS
            </h3>
            <div className="space-y-5">
              {budgets.map((budget, i) => {
                const percent = Math.min(100, (budget.spent / budget.limit) * 100);
                const isOver = budget.spent > budget.limit;
                return (
                  <div key={i}>
                    <div className="flex justify-between text-[10px] mb-1 tracking-wider">
                      <span className="text-amber-500 font-bold">{budget.category.toUpperCase()}</span>
                      <span className={isOver ? 'text-rose-400' : 'text-amber-600'}>
                        ${budget.spent} / ${budget.limit}
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-amber-950/30 overflow-hidden">
                      <div
                        className={`h-full ${isOver ? 'bg-rose-500' : percent > 80 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                        style={{ width: `${percent}%` }}
                      ></div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Alerts */}
          <div className="bg-black border-2 border-amber-900/50 p-5 relative">
             <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-amber-500"></div>
             <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-amber-500"></div>
             <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-amber-500"></div>
             <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-amber-500"></div>

             <h3 className="font-bold text-amber-500 mb-3 flex items-center gap-2 tracking-wider">
               <AlertCircle size={18} className="text-amber-600" /> INSIGHTS
             </h3>
             <div className="space-y-3">
               <div className="p-3 bg-amber-950/20 border border-amber-900/50 text-[10px] text-amber-300 tracking-wide">
                 <strong className="text-amber-500">HIGH SUBSCRIPTION COST:</strong> You spent $450 on WeWork this month.
               </div>
               <div className="p-3 bg-emerald-950/20 border border-emerald-900/50 text-[10px] text-emerald-300 tracking-wide">
                 <strong className="text-emerald-400">REVENUE UP:</strong> Income is 15% higher than last month average.
               </div>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
};