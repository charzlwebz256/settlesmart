import TransitPlanner from '@/components/transit/TransitPlanner';
import EtsNetworkPanel from '@/components/transit/EtsNetworkPanel';

export default function TransitMap() {
  return (
    <div className="pb-16 md:pb-0">
      <TransitPlanner />
      {/* ETS routes, commutes and schedules */}
      <EtsNetworkPanel />
    </div>
  );
}