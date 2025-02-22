
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const Sales = () => {
  return (
    <div className="container space-y-8 p-8 pt-6 animate-fadeIn">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Sales</h2>
        <div className="flex items-center space-x-2">
          <Button>
            <Plus className="mr-2 h-4 w-4" /> New Sale
          </Button>
        </div>
      </div>
      {/* Sales list will be added in next iteration */}
      <div className="rounded-lg border shadow-sm p-8 text-center text-muted-foreground">
        Sales tracking coming soon
      </div>
    </div>
  );
};

export default Sales;
