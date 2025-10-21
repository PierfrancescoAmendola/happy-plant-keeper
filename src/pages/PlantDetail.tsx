import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, Droplet, Loader2, FileText } from "lucide-react";
import { Plant } from "@/types/plant";
import { format } from "date-fns";
import { it } from "date-fns/locale";

export const PlantDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [plant, setPlant] = useState<Plant | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlant = async () => {
      const { data, error } = await supabase
        .from("plants")
        .select(`
          *,
          plant_care_logs (*)
        `)
        .eq("id", id)
        .single();

      if (error) {
        console.error("Error fetching plant:", error);
        navigate("/");
      } else {
        setPlant(data);
      }
      setLoading(false);
    };

    fetchPlant();
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (!plant) {
    return null;
  }

  const sortedLogs = plant.plant_care_logs
    ? [...plant.plant_care_logs].sort(
        (a, b) =>
          new Date(b.care_date).getTime() - new Date(a.care_date).getTime()
      )
    : [];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container max-w-4xl mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="mb-6 hover-lift"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Torna al giardino
        </Button>

        <div className="space-y-6 animate-fade-in">
          <Card className="card-elevated overflow-hidden">
            <div className="aspect-video bg-muted relative">
              {plant.image_url ? (
                <img
                  src={plant.image_url}
                  alt={plant.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-sage">
                  <Droplet className="w-16 h-16 text-white/50" />
                </div>
              )}
            </div>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-3xl mb-2">{plant.name}</CardTitle>
                  <Badge variant="secondary" className="text-sm">
                    {plant.category}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm">
                    Cura ogni {plant.care_frequency}{" "}
                    {plant.care_frequency === 1 ? "giorno" : "giorni"}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Droplet className="w-4 h-4" />
                  <span className="text-sm">
                    {sortedLogs.length}{" "}
                    {sortedLogs.length === 1 ? "cura registrata" : "cure registrate"}
                  </span>
                </div>
              </div>
              {plant.notes && (
                <div className="pt-4 border-t">
                  <div className="flex items-start gap-2 text-muted-foreground mb-2">
                    <FileText className="w-4 h-4 mt-0.5" />
                    <span className="text-sm font-medium">Note</span>
                  </div>
                  <p className="text-sm text-foreground pl-6">{plant.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="card-elevated">
            <CardHeader>
              <CardTitle>Storico cure</CardTitle>
            </CardHeader>
            <CardContent>
              {sortedLogs.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  Nessuna cura registrata per questa pianta
                </p>
              ) : (
                <div className="space-y-3">
                  {sortedLogs.map((log) => (
                    <div
                      key={log.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <Droplet className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-sm capitalize">
                            {log.care_type === "water"
                              ? "Innaffiata"
                              : log.care_type}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {format(new Date(log.care_date), "d MMMM yyyy 'alle' HH:mm", {
                              locale: it,
                            })}
                          </p>
                        </div>
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
