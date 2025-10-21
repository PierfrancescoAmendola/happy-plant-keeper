export interface Plant {
  id: string;
  user_id: string;
  name: string;
  category: string;
  image_url?: string;
  care_frequency: number;
  notes?: string;
  created_at: string;
  updated_at: string;
  plant_care_logs?: PlantCareLog[];
}

export interface PlantCareLog {
  id: string;
  plant_id: string;
  care_type: string;
  care_date: string;
  notes?: string;
  created_at: string;
}
