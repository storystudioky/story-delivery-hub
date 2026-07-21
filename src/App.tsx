import { Navigate, Route, Routes } from "react-router-dom";

import { DesignSystemPage } from "@/pages/DesignSystem";

function ProductionHome() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-6 text-center">
      <div className="max-w-md space-y-2">
        <h1 className="text-heading-md text-foreground">Delivery Hub</h1>
        <p className="text-body-sm text-muted-foreground">
          Application shell is ready. Feature routes will land in later steps.
        </p>
      </div>
    </div>
  );
}

/**
 * Delivery Hub application routes.
 *
 * `/design-system` is development-only and is not linked from production navigation.
 */
export default function App() {
  const isDev = import.meta.env.DEV;

  return (
    <Routes>
      <Route path="/" element={isDev ? <Navigate to="/design-system" replace /> : <ProductionHome />} />
      {isDev ? <Route path="/design-system" element={<DesignSystemPage />} /> : null}
      <Route path="*" element={<ProductionHome />} />
    </Routes>
  );
}
