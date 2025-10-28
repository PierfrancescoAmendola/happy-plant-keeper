import { Sprout, LogOut, Plus, User, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useState } from "react";
import { signOut } from "@/lib/auth-local";

interface HeaderProps {
  onLogout: () => void;
}

export const Header = ({ onLogout }: HeaderProps) => {
  const navigate = useNavigate();
  const [sheetOpen, setSheetOpen] = useState(false);

  const handleLogout = () => {
    signOut();
    onLogout();
    toast({
      title: "Arrivederci! 👋",
      description: "Logout effettuato con successo",
    });
  };

  const navigateAndClose = (path: string) => {
    navigate(path);
    setSheetOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
            <SheetTrigger asChild>
              <button className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary/20 transition-colors">
                <Sprout className="w-5 h-5 text-primary" />
              </button>
            </SheetTrigger>
            <SheetContent side="left">
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  <Sprout className="w-5 h-5 text-primary" />
                  Menu
                </SheetTitle>
              </SheetHeader>
              <nav className="mt-8 space-y-2">
                <button
                  onClick={() => navigateAndClose("/")}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-accent transition-colors"
                >
                  <Sprout className="w-5 h-5" />
                  <span>Le mie Piante</span>
                </button>
                <button
                  onClick={() => navigateAndClose("/profile")}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-accent transition-colors"
                >
                  <User className="w-5 h-5" />
                  <span>Profilo</span>
                </button>
                <button
                  onClick={() => navigateAndClose("/settings")}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-accent transition-colors"
                >
                  <Settings className="w-5 h-5" />
                  <span>Impostazioni</span>
                </button>
              </nav>
            </SheetContent>
          </Sheet>
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
            <Plus className="w-4 h-4 md:mr-2" />
            <span className="hidden md:inline">Aggiungi Pianta</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="hover:bg-destructive/10 hover:text-destructive"
          >
            <LogOut className="w-4 h-4 md:mr-2" />
            <span className="hidden md:inline">Esci</span>
          </Button>
        </div>
      </div>
    </header>
  );
};
