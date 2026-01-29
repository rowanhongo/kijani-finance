import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { HomeRibbon } from "@/components/layout/HomeRibbon";
import { MyCasesView } from "@/components/home/MyCasesView";
import { MessagesView } from "@/components/home/MessagesView";
import { ReportsView } from "@/components/home/ReportsView";
import { ContactsView } from "@/components/home/ContactsView";
import { MySourcesView } from "@/components/home/MySourcesView";

const Index = () => {
  // Default to My Cases tab
  const [activeTab, setActiveTab] = useState("/");

  // Render the active view based on tab selection
  const renderActiveView = () => {
    switch (activeTab) {
      case "/":
        return <MyCasesView />;
      case "/messages":
        return <MessagesView />;
      case "/reports":
        return <ReportsView />;
      case "/contacts":
        return <ContactsView />;
      case "/sources":
        return <MySourcesView />;
      default:
        return <MyCasesView />;
    }
  };

  return (
    <AppLayout showRibbon={<HomeRibbon activeTab={activeTab} onTabChange={setActiveTab} />}>
      {renderActiveView()}
    </AppLayout>
  );
};

export default Index;