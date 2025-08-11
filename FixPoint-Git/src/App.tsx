import { Button } from "@/components/ui/button";
import { ModeToggle } from "./components/mode-toggle";

function App() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center">
      <ModeToggle />
      <h1 className="text-3xl font-bold">Hello, world!</h1>
      <p className="text-lg">This is a simple example of a React component.</p>
      <Button>Click me</Button>
    </div>
  );
}

export default App;
