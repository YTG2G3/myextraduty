import { Button } from "@/components/ui/button";
import { bricolage } from "./fonts";

export default function FourOFour() {
  return (
    <div className="flex justify-center items-center w-screen h-screen">
      <div className="flex flex-col items-center gap-4">
        <span className={`${bricolage.className} text-9xl opacity-40 font-black`}>404</span>
        <span>The requested page could not be found.</span>
        <Button>Go back to the home page</Button>
      </div>
    </div>
  );
}
