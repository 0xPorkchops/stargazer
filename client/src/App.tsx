import React from "react";
import logo from "./logo.svg";
import { Button } from "./components/button";
import { Label } from "./components/label";
import { RadioGroup, RadioGroupItem } from "./components/radioGroup";
import { Toaster } from "./components/toaster";
import { useToast } from "./components/use-toast";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/clerk-react";

export const ToastDemo = () => {
  const { toast } = useToast();

  return (
    <Button
      onClick={() => {
        toast({
          title: "Scheduled: Catch up",
          description: "Friday, February 10, 2023 at 5:57 PM",
        });
      }}
    >
      Show Toast
    </Button>
  );
};

function App() {
  return (
    <div className="App">
      <h1 className="bg-green-500">
        If this text is green, tailwindcss is at least somewhat working.
      </h1>
      <Button>Test Button</Button>
      <RadioGroup defaultValue="option-one">
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="option-one" id="option-one" />
          <Label htmlFor="option-one">Option One</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="option-two" id="option-two" />
          <Label htmlFor="option-two">Option Two</Label>
        </div>
      </RadioGroup>
      <ToastDemo></ToastDemo>
      <Toaster />

      <SignedOut>
        <SignInButton />
      </SignedOut>
      <SignedIn>
        <UserButton />
      </SignedIn>
    </div>
  );
}

export default App;
