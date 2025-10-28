import { useEffect, useState } from "react";
import { Header } from "@/components/layout/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, User, Mail, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { getCurrentUser, signOut } from "@/lib/auth-local";

export const Profile = () => {
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState<string>("");
  const [createdAt, setCreatedAt] = useState<string>("");
  const navigate = useNavigate();

  const handleLogout = () => {
    signOut();
    navigate("/");
  };

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      const user = getCurrentUser();
      
      if (user) {
        setUserEmail(user.email || "");
        setCreatedAt(new Date(user.createdAt).toLocaleDateString("it-IT"));
      }
      setLoading(false);
    };

    fetchUserData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header onLogout={handleLogout} />
        <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header onLogout={handleLogout} />
      <main className="container max-w-2xl mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="mb-6"
        >
          ← Torna al giardino
        </Button>

        <Card className="card-elevated">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5 text-primary" />
              Il Mio Profilo
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-3 p-4 rounded-lg bg-accent/50">
              <Mail className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{userEmail}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 rounded-lg bg-accent/50">
              <Calendar className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Membro dal</p>
                <p className="font-medium">{createdAt}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};
