import { useBanquetStore } from '@/store/useBanquetStore';
import Header from '@/components/Header';
import ParamSelector from '@/components/ParamSelector';
import PlanSidebar from '@/components/PlanSidebar';
import PlanDetail from '@/components/PlanDetail';
import BudgetPanel from '@/components/BudgetPanel';
import ReplaceModal from '@/components/ReplaceModal';
import PlanDetailModal from '@/components/PlanDetailModal';
import ExportToast from '@/components/ExportToast';

export default function Home() {
  const { plans } = useBanquetStore();
  const hasPlans = plans.length > 0;

  return (
    <div className="min-h-screen flex flex-col bg-ivory-100">
      <Header />

      <div className="flex-1 flex overflow-hidden">
        <PlanSidebar />

        <div className="flex-1 flex flex-col overflow-hidden">
          <div className={`transition-all duration-500 ${hasPlans ? 'max-h-[500px] opacity-100' : 'max-h-none opacity-100'}`}>
            <div className="p-6">
              <ParamSelector />
            </div>
          </div>

          {hasPlans && <div className="divider-gold mx-6" />}

          <div className="flex-1 overflow-hidden">
            <PlanDetail />
          </div>
        </div>
      </div>

      <BudgetPanel />
      <ReplaceModal />
      <PlanDetailModal />
      <ExportToast />
    </div>
  );
}
