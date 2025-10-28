import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, Droplet, Loader2, FileText } from "lucide-react";
import { Plant } from "@/types/plant";
import { format } from "date-fns";
import { it } from "date-fns/locale";
import { getPlant, getCareLogsByPlant } from "@/lib/db";
import { signOut } from "@/lib/auth-local";

export const PlantDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [plant, setPlant] = useState<Plant | null>(null);
  const [careLogs, setCareLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const handleLogout = () => {
    signOut();
    navigate("/");
  };

  useEffect(() => {
    const fetchPlant = async () => {
      if (!id) return;
      
      const plantData = await getPlant(id);
      if (!plantData) {
        navigate("/");
        return;
      }
      
      const logs = await getCareLogsByPlant(id);
      setPlant(plantData);
      setCareLogs(logs);
      setLoading(false);
    };

    fetchPlant();
  }, [id, navigate]);

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

  if (!plant) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header onLogout={handleLogout} />
      <main className="container max-w-4xl mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="mb-6 hover-lift"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Torna al giardino
        </Button>

        <div className="grid gap-6">
          <Card className="card-elevated animate-fade-in overflow-hidden">
            {plant.image_url && (
              <div className="h-64 w-full overflow-hidden">
                <img
                  src={plant.image_url}
                  alt={plant.name}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-3xl mb-2 bg-gradient-sage bg-clip-text text-transparent">
                    {plant.name}
                  </CardTitle>
                  <Badge variant="secondary" className="text-sm">
                    {plant.category}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-4 rounded-lg bg-accent/50">
                  <Droplet className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Frequenza di cura</p>
                    <p className="font-semibold">Ogni {plant.care_frequency} giorni</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 rounded-lg bg-accent/50">
                  <Calendar className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Aggiunta il</p>
                    <p className="font-semibold">
                      {format(new Date(plant.created_at), "d MMMM yyyy", { locale: it })}
                    </p>
                  </div>
                </div>
              </div>

              {plant.notes && (
                <div className="p-4 rounded-lg bg-accent/50 space-y-2">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-muted-foreground" />
                    <p className="text-sm font-medium text-muted-foreground">Note</p>
                  </div>
                  <p className="text-sm">{plant.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="card-elevated">
            <CardHeader>
              <CardTitle className="text-xl">Registro delle cure</CardTitle>
            </CardHeader>
            <CardContent>
              {careLogs.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  Nessuna cura registrata ancora
                </p>
              ) : (
                <div className="space-y-3">
                  {careLogs.map((log: any) => (
                    <div
                      key={log.id}
                      className="flex items-start gap-3 p-4 rounded-lg bg-accent/50 hover:bg-accent/70 transition-colors"
                    >
                      <Droplet className="w-5 h-5 text-primary mt-0.5" />
                      <div className="flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <p className="font-medium capitalize">{log.careType}</p>
                          <span className="text-sm text-muted-foreground">
                            {format(new Date(log.careDate), "d MMM yyyy", { locale: it })}
                          </span>
                        </div>
                        {log.notes && (
                          <p className="text-sm text-muted-foreground mt-1">{log.notes}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};
