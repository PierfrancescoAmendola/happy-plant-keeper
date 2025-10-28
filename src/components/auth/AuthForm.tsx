import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Sprout } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { signIn, signUp } from "@/lib/auth-local";
import heroImage from "@/assets/hero-garden.jpg";

interface AuthFormProps {
  onAuthChange: (user: any) => void;
}

export const AuthForm = ({ onAuthChange }: AuthFormProps) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (password.length < 6) {
      toast({
        title: "Errore",
        description: "La password deve essere di almeno 6 caratteri",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    const { user, error } = isLogin 
      ? await signIn(email, password)
      : await signUp(email, password);

    if (error) {
      toast({
        title: "Errore",
        description: error,
        variant: "destructive",
      });
    } else if (user) {
      toast({
        title: isLogin ? "Bentornato! 🌿" : "Benvenuto! 🌱",
        description: isLogin ? "Accesso effettuato con successo" : "Account creato con successo",
      });
      onAuthChange(user);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-accent/5 to-background p-4">
      <div className="w-full max-w-6xl grid md:grid-cols-2 gap-8 items-center">
        <div className="hidden md:block animate-fade-in">
          <img 
            src={heroImage} 
            alt="Giardino" 
            className="rounded-3xl shadow-2xl w-full h-[600px] object-cover ring-1 ring-border/50"
          />
        </div>
        
        <Card className="w-full max-w-md mx-auto card-elevated animate-fade-in backdrop-blur-sm bg-card/95">
          <CardHeader className="space-y-4 text-center">
            <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-sage flex items-center justify-center shadow-lg animate-float">
              <Sprout className="w-8 h-8 text-white" />
            </div>
            <div className="space-y-2">
              <CardTitle className="text-3xl font-bold bg-gradient-sage bg-clip-text text-transparent">
                Giardino
              </CardTitle>
              <CardDescription className="text-base">
                {isLogin ? "Bentornato nel tuo giardino" : "Crea il tuo giardino digitale"}
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="nome@esempio.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-11 transition-all focus:ring-2 focus:ring-primary"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="h-11 transition-all focus:ring-2 focus:ring-primary"
                />
                <p className="text-xs text-muted-foreground">Minimo 6 caratteri</p>
              </div>
              <Button
                type="submit"
                className="w-full h-11 gradient-sage hover:opacity-90 transition-all hover-lift text-base font-medium"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    {isLogin ? "Accesso..." : "Registrazione..."}
                  </>
                ) : (
                  isLogin ? "Accedi" : "Registrati"
                )}
              </Button>
            </form>
            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-sm text-muted-foreground hover:text-primary transition-colors underline-offset-4 hover:underline"
              >
                {isLogin ? "Non hai un account? Registrati" : "Hai già un account? Accedi"}
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
