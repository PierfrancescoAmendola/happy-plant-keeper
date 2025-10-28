import { Header } from "@/components/layout/Header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Settings as SettingsIcon, Bell, Palette, Database } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useState } from "react";

export const Settings = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container max-w-2xl mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="mb-6"
        >
          ← Torna al giardino
        </Button>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <SettingsIcon className="w-5 h-5 text-primary" />
              Impostazioni
            </CardTitle>
            <CardDescription>
              Personalizza la tua esperienza con Giardino
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg bg-accent/50">
                <div className="flex items-center gap-3">
                  <Bell className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <Label htmlFor="notifications" className="font-medium">
                      Notifiche
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Ricevi promemoria per la cura delle piante
                    </p>
                  </div>
                </div>
                <Switch
                  id="notifications"
                  checked={notifications}
                  onCheckedChange={setNotifications}
                />
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg bg-accent/50">
                <div className="flex items-center gap-3">
                  <Palette className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <Label htmlFor="darkMode" className="font-medium">
                      Modalità Scura
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Attiva il tema scuro
                    </p>
                  </div>
                </div>
                <Switch
                  id="darkMode"
                  checked={darkMode}
                  onCheckedChange={setDarkMode}
                />
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg bg-accent/50">
                <div className="flex items-center gap-3">
                  <Database className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <Label className="font-medium">
                      Archiviazione Dati
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      I tuoi dati sono sincronizzati in modo sicuro
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};
