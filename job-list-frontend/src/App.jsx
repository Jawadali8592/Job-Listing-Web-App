import React from "react";
import MainComponent from "./components/MainComponent";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <MainComponent />
    </QueryClientProvider>
  );
}
