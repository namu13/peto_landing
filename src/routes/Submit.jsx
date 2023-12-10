import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";

const Submit = () => {
  return (
    <div className="flex flex-col items-center ">
      <CheckCircle2 className="text-peto w-14 h-14 lg:w-20 lg:h-20" />
      <h1 className="mt-2 text-3xl text-center lg:text-5xl">
        Your project has been successfully registered!
      </h1>
      <p className="text-lg lg:text-2xl mt-2">
        Thank you for your participation.
      </p>
      <div className="flex flex-col items-center mt-12 mb-10 lg:mt-16 lg:mb-24">
        <Link to={"/projects"}>
          <Button className="px-10 py-4 lg:px-12 lg:py-6 text-xl font-bold rounded-[6px] border-none hover:bg-[#a1c930]">
            View project
          </Button>
        </Link>
        <Link to={"/"}>
          <Button
            variant="link"
            className="bg-[#0B0A09] border-none mt-2 text-lg"
          >
            Back to home
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default Submit;
