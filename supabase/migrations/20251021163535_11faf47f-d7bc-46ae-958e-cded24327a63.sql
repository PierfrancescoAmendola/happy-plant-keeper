-- Tabella principale delle piante
CREATE TABLE IF NOT EXISTS public.plants (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  image_url TEXT,
  care_frequency INTEGER NOT NULL DEFAULT 3, -- giorni tra una cura e l'altra
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabella per lo storico delle cure
CREATE TABLE IF NOT EXISTS public.plant_care_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  plant_id UUID NOT NULL REFERENCES public.plants(id) ON DELETE CASCADE,
  care_type TEXT NOT NULL, -- 'water', 'sun', 'fertilize', etc.
  care_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Abilita Row Level Security
ALTER TABLE public.plants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.plant_care_logs ENABLE ROW LEVEL SECURITY;

-- Politiche RLS per plants
CREATE POLICY "Users can view their own plants" 
ON public.plants 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own plants" 
ON public.plants 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own plants" 
ON public.plants 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own plants" 
ON public.plants 
FOR DELETE 
USING (auth.uid() = user_id);

-- Politiche RLS per plant_care_logs
CREATE POLICY "Users can view their own care logs" 
ON public.plant_care_logs 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.plants 
    WHERE plants.id = plant_care_logs.plant_id 
    AND plants.user_id = auth.uid()
  )
);

CREATE POLICY "Users can create care logs for their plants" 
ON public.plant_care_logs 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.plants 
    WHERE plants.id = plant_care_logs.plant_id 
    AND plants.user_id = auth.uid()
  )
);

CREATE POLICY "Users can delete their own care logs" 
ON public.plant_care_logs 
FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM public.plants 
    WHERE plants.id = plant_care_logs.plant_id 
    AND plants.user_id = auth.uid()
  )
);

-- Funzione per aggiornare automaticamente updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Trigger per aggiornare automaticamente updated_at nelle plants
CREATE TRIGGER update_plants_updated_at
BEFORE UPDATE ON public.plants
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Indici per migliorare le performance
CREATE INDEX idx_plants_user_id ON public.plants(user_id);
CREATE INDEX idx_plant_care_logs_plant_id ON public.plant_care_logs(plant_id);
CREATE INDEX idx_plant_care_logs_care_date ON public.plant_care_logs(care_date DESC);