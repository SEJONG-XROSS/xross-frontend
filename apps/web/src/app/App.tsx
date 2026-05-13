import { useRoutes } from "react-router";
import { routes } from "@/app/routes";
import { useFCMSetup } from "@/shared/lib/firebase/useFCMSetup";

function App() {
  useFCMSetup();

  return useRoutes(routes);
}

export default App;
