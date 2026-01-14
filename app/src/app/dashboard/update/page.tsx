import TrailUpdateForm from '@/components/dashboard/TrailUpdateForm';

export default function TrailUpdatePage() {
  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-2">Post Trail Update</h2>
        <p className="text-muted">Share your progress from the trail</p>
      </div>

      <TrailUpdateForm />
    </div>
  );
}
