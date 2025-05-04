import AppHeader from '@/components/app-header';
import FooterWarning from '@/components/footer-warning';
import MainMenu from '@/components/main-menu';
import MotionWrapper from '@/components/motion-wrapper';

export default function LiquidezPage() {
  return (
    <div className="container mx-auto max-w-md p-4 mb-24">
      <AppHeader title="Liquidez" />
      
      <MotionWrapper>
        <div className="text-center p-8">
          <h2 className="text-xl font-semibold mb-4">Liquidez Page</h2>
          <p className="mb-4">This page is under construction.</p>
          <div className="bg-primary/10 p-4 rounded-lg">
            <p className="text-primary font-medium">Coming soon!</p>
          </div>
        </div>
      </MotionWrapper>
      
      <MainMenu />
      <FooterWarning />
    </div>
  );
} 