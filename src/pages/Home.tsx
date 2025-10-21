import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/layout/Header";
import { PlantCard } from "@/components/plants/PlantCard";
import { Plant } from "@/types/plant";
import { Loader2, Sprout } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export const Home = () => {
  const [plants, setPlants] = useState<Plant[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchPlants = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("plants")
      .select(`
        *,
        plant_care_logs (*)
      `)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching plants:", error);
    } else {
      setPlants(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPlants();

    // Realtime subscription
    const channel = supabase
      .channel("plants-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "plants",
        },
        () => {
          fetchPlants();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

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

  if (plants.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container max-w-4xl mx-auto px-4 py-12">
          <div className="text-center space-y-6 animate-fade-in">
            <div className="mx-auto w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center animate-float">
              <Sprout className="w-12 h-12 text-primary" />
            </div>
            <div className="space-y-2">
              <h2 className="text-3xl font-bold">Il tuo giardino è vuoto</h2>
              <p className="text-muted-foreground text-lg">
                Inizia ad aggiungere le tue prime piante per coltivarle con amore
              </p>
            </div>
            <Button
              onClick={() => navigate("/add")}
              size="lg"
              className="gradient-sage hover:opacity-90 hover-lift"
            >
              <Sprout className="w-5 h-5 mr-2" />
              Aggiungi la tua prima pianta
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8 animate-fade-in">
          <h2 className="text-3xl font-bold mb-2">Le tue piante 🌿</h2>
          <p className="text-muted-foreground">
            {plants.length} {plants.length === 1 ? "pianta" : "piante"} nel tuo giardino
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {plants.map((plant) => (
            <PlantCard key={plant.id} plant={plant} onUpdate={fetchPlants} />
          ))}
        </div>
      </main>
    </div>
  );
};
