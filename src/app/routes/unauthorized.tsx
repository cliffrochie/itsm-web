import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export default function UnauthorizedPage() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col justify-center h-screen items-center gap-4 bg-background text-foreground">
      <h1 className="text-4xl font-bold">403</h1>
      <h2 className="text-xl font-semibold">Unauthorized Access</h2>
      <p className="text-muted-foreground">
        You do not have permission to view this page.
      </p>
      <Button variant="outline" onClick={() => navigate('/')}>
        Return to Home
      </Button>
    </div>
  );
}
