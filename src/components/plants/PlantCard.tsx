import { Plant } from "@/types/plant";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Droplet, Trash2 } from "lucide-react";
import { format, differenceInDays } from "date-fns";
import { it } from "date-fns/locale";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { deletePlant, createCareLog, getCareLogsByPlant } from "@/lib/db";
import { useEffect, useState } from "react";

interface PlantCardProps {
  plant: Plant;
  onUpdate: () => void;
}

export const PlantCard = ({ plant, onUpdate }: PlantCardProps) => {
  const navigate = useNavigate();
  const [careLogs, setCareLogs] = useState<any[]>([]);

  useEffect(() => {
    const fetchCareLogs = async () => {
      const logs = await getCareLogsByPlant(plant.id);
      setCareLogs(logs);
    };
    fetchCareLogs();
  }, [plant.id]);

  const getLastCareDate = () => {
    if (careLogs.length === 0) return null;
    const lastLog = careLogs.sort((a, b) => 
      new Date(b.careDate).getTime() - new Date(a.careDate).getTime()
    )[0];
    return new Date(lastLog.careDate);
  };

  const needsCare = () => {
    const lastCare = getLastCareDate();
    if (!lastCare) return true;
    const daysSince = differenceInDays(new Date(), lastCare);
    return daysSince >= plant.care_frequency;
  };

  const handleCare = async () => {
    try {
      await createCareLog({
        plantId: plant.id,
        careType: "water",
        careDate: new Date().toISOString(),
      });

      toast({
        title: "Ottimo lavoro! 💚",
        description: `${plant.name} è stata curata`,
      });
      onUpdate();
    } catch (error) {
      toast({
        title: "Errore",
        description: "Impossibile registrare la cura",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async () => {
    try {
      await deletePlant(plant.id);
      toast({
        title: "Pianta rimossa",
        description: `${plant.name} è stata eliminata`,
      });
      onUpdate();
    } catch (error) {
      toast({
        title: "Errore",
        description: "Impossibile eliminare la pianta",
        variant: "destructive",
      });
    }
  };

  const lastCare = getLastCareDate();
  const status = needsCare() ? "needs-care" : "good";

  return (
    <Card 
      className="overflow-hidden hover-lift cursor-pointer group animate-fade-in card-elevated"
      onClick={() => navigate(`/plant/${plant.id}`)}
    >
      <div className="aspect-video bg-muted relative overflow-hidden">
        {plant.image_url ? (
          <img
            src={plant.image_url}
            alt={plant.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-sage">
            <Droplet className="w-12 h-12 text-white/50" />
          </div>
        )}
        {status === "needs-care" && (
          <Badge className="absolute top-3 right-3 bg-warning text-foreground shadow-lg">
            Da curare
          </Badge>
        )}
      </div>
      <CardContent className="p-5">
        <h3 className="font-semibold text-lg mb-1 bg-gradient-sage bg-clip-text text-transparent">
          {plant.name}
        </h3>
        <p className="text-sm text-muted-foreground mb-2">{plant.category}</p>
        {lastCare ? (
          <p className="text-xs text-muted-foreground">
            Ultima cura: {format(lastCare, "d MMMM yyyy", { locale: it })}
          </p>
        ) : (
          <p className="text-xs text-muted-foreground">Nessuna cura registrata</p>
        )}
      </CardContent>
      <CardFooter className="p-5 pt-0 gap-2" onClick={(e) => e.stopPropagation()}>
        <Button
          onClick={handleCare}
          className="flex-1 gradient-sage hover:opacity-90 shadow-md"
          size="sm"
        >
          <Droplet className="w-4 h-4 mr-2" />
          Cura
        </Button>
        <Button
          onClick={handleDelete}
          variant="outline"
          size="sm"
          className="hover:bg-destructive/10 hover:text-destructive hover:border-destructive"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};
