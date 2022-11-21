import AppProvider from "./app/context/AppProvider";
import Index from "./index";

export default function App() {
  return (
    <AppProvider>
      <Index />
    </AppProvider>
  );
}
