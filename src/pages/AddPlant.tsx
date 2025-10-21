import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const CATEGORIES = [
  "Indoor",
  "Outdoor",
  "Aromatiche",
  "Grasse",
  "Fiorite",
  "Ortaggi",
  "Alberi",
  "Altra",
];

export const AddPlant = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    care_frequency: "3",
    image_url: "",
    notes: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      toast({
        title: "Errore",
        description: "Devi essere autenticato",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    const { error } = await supabase.from("plants").insert({
      user_id: user.id,
      name: formData.name,
      category: formData.category,
      care_frequency: parseInt(formData.care_frequency),
      image_url: formData.image_url || null,
      notes: formData.notes || null,
    });

    if (error) {
      toast({
        title: "Errore",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Pianta aggiunta! 🌱",
        description: `${formData.name} è stata aggiunta al tuo giardino`,
      });
      navigate("/");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container max-w-2xl mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="mb-6 hover-lift"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Torna al giardino
        </Button>

        <Card className="card-elevated animate-fade-in">
          <CardHeader>
            <CardTitle className="text-2xl">Aggiungi una nuova pianta 🌿</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Nome della pianta *</Label>
                <Input
                  id="name"
                  placeholder="Es. Monstera deliciosa"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                  className="transition-all focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Categoria *</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) =>
                    setFormData({ ...formData, category: value })
                  }
                  required
                >
                  <SelectTrigger className="transition-all focus:ring-2 focus:ring-primary">
                    <SelectValue placeholder="Seleziona categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="frequency">Frequenza di cura (giorni) *</Label>
                <Input
                  id="frequency"
                  type="number"
                  min="1"
                  placeholder="3"
                  value={formData.care_frequency}
                  onChange={(e) =>
                    setFormData({ ...formData, care_frequency: e.target.value })
                  }
                  required
                  className="transition-all focus:ring-2 focus:ring-primary"
                />
                <p className="text-xs text-muted-foreground">
                  Ogni quanti giorni va curata questa pianta
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="image">URL Immagine (opzionale)</Label>
                <Input
                  id="image"
                  type="url"
                  placeholder="https://esempio.com/immagine.jpg"
                  value={formData.image_url}
                  onChange={(e) =>
                    setFormData({ ...formData, image_url: e.target.value })
                  }
                  className="transition-all focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Note (opzionale)</Label>
                <Textarea
                  id="notes"
                  placeholder="Aggiungi note o consigli sulla cura..."
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                  className="min-h-24 transition-all focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/")}
                  className="flex-1"
                  disabled={loading}
                >
                  Annulla
                </Button>
                <Button
                  type="submit"
                  className="flex-1 gradient-sage hover:opacity-90 hover-lift"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Aggiunta...
                    </>
                  ) : (
                    "Aggiungi Pianta"
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};
