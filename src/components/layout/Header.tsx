import { Sprout, LogOut, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

export const Header = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: "Errore",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Arrivederci! 👋",
        description: "Logout effettuato con successo",
      });
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <Sprout className="w-5 h-5 text-primary" />
          </div>
          <h1 className="text-xl font-bold bg-gradient-sage bg-clip-text text-transparent">
            Giardino
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate("/add")}
            className="hover-lift"
          >
            <Plus className="w-4 h-4 mr-2" />
            Aggiungi Pianta
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="hover:bg-destructive/10 hover:text-destructive"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Esci
          </Button>
        </div>
      </div>
    </header>
  );
};
