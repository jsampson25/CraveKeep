export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  __InternalSupabase: { PostgrestVersion: '14.15' };
  public: {
    Tables: {
      capture_jobs: {
        Row: { created_at: string; error_message: string | null; extracted_recipe_id: string | null; id: string; owner_id: string; recovery_code: string | null; source_creator: string | null; source_host: string; source_title: string | null; source_url: string; stage: Database['public']['Enums']['import_stage'] | null; stage_index: number; status: Database['public']['Enums']['import_status']; updated_at: string };
        Insert: { created_at?: string; error_message?: string | null; extracted_recipe_id?: string | null; id?: string; owner_id: string; recovery_code?: string | null; source_creator?: string | null; source_host: string; source_title?: string | null; source_url: string; stage?: Database['public']['Enums']['import_stage'] | null; stage_index?: number; status?: Database['public']['Enums']['import_status']; updated_at?: string };
        Update: { created_at?: string; error_message?: string | null; extracted_recipe_id?: string | null; id?: string; owner_id?: string; recovery_code?: string | null; source_creator?: string | null; source_host?: string; source_title?: string | null; source_url?: string; stage?: Database['public']['Enums']['import_stage'] | null; stage_index?: number; status?: Database['public']['Enums']['import_status']; updated_at?: string };
        Relationships: [{ foreignKeyName: 'capture_jobs_extracted_recipe_id_fkey'; columns: ['extracted_recipe_id']; isOneToOne: false; referencedRelation: 'recipes'; referencedColumns: ['id'] }];
      };
      profiles: {
        Row: { created_at: string; display_name: string | null; id: string; updated_at: string };
        Insert: { created_at?: string; display_name?: string | null; id: string; updated_at?: string };
        Update: { created_at?: string; display_name?: string | null; id?: string; updated_at?: string };
        Relationships: [];
      };
      nutrition_provider_cache: {
        Row: { expires_at: string; fetched_at: string; payload: Json; provider: string; query_key: string };
        Insert: { expires_at: string; fetched_at?: string; payload: Json; provider: string; query_key: string };
        Update: { expires_at?: string; fetched_at?: string; payload?: Json; provider?: string; query_key?: string };
        Relationships: [];
      };
      recipe_nutrition_estimates: {
        Row: { id: string; recipe_id: string; owner_id: string; servings: number; calories: number; protein_grams: number; carbohydrate_grams: number; fat_grams: number; sodium_milligrams: number; coverage: number; confidence: string; serving_assumption: string; calculated_at: string };
        Insert: { id?: string; recipe_id: string; owner_id: string; servings: number; calories: number; protein_grams: number; carbohydrate_grams: number; fat_grams: number; sodium_milligrams: number; coverage: number; confidence: string; serving_assumption: string; calculated_at: string };
        Update: { id?: string; recipe_id?: string; owner_id?: string; servings?: number; calories?: number; protein_grams?: number; carbohydrate_grams?: number; fat_grams?: number; sodium_milligrams?: number; coverage?: number; confidence?: string; serving_assumption?: string; calculated_at?: string };
        Relationships: [];
      };
      nutrition_ingredient_matches: {
        Row: { id: string; estimate_id: string; position: number; ingredient_id: string; ingredient_name: string; provider: string; provider_id: string; serving_id: string | null; matched_name: string; grams: number; basis_grams: number; calories: number; protein_grams: number; carbohydrate_grams: number; fat_grams: number; sodium_milligrams: number; confidence: string };
        Insert: { id?: string; estimate_id: string; position: number; ingredient_id: string; ingredient_name: string; provider: string; provider_id: string; serving_id?: string | null; matched_name: string; grams: number; basis_grams: number; calories: number; protein_grams: number; carbohydrate_grams: number; fat_grams: number; sodium_milligrams: number; confidence: string };
        Update: { id?: string; estimate_id?: string; position?: number; ingredient_id?: string; ingredient_name?: string; provider?: string; provider_id?: string; serving_id?: string | null; matched_name?: string; grams?: number; basis_grams?: number; calories?: number; protein_grams?: number; carbohydrate_grams?: number; fat_grams?: number; sodium_milligrams?: number; confidence?: string };
        Relationships: [];
      };
      recipe_ingredients: {
        Row: { id: string; name: string; position: number; quantity: string; recipe_id: string };
        Insert: { id?: string; name: string; position: number; quantity?: string; recipe_id: string };
        Update: { id?: string; name?: string; position?: number; quantity?: string; recipe_id?: string };
        Relationships: [{ foreignKeyName: 'recipe_ingredients_recipe_id_fkey'; columns: ['recipe_id']; isOneToOne: false; referencedRelation: 'recipes'; referencedColumns: ['id'] }];
      };
      recipe_steps: {
        Row: { id: string; instruction: string; position: number; recipe_id: string };
        Insert: { id?: string; instruction: string; position: number; recipe_id: string };
        Update: { id?: string; instruction?: string; position?: number; recipe_id?: string };
        Relationships: [{ foreignKeyName: 'recipe_steps_recipe_id_fkey'; columns: ['recipe_id']; isOneToOne: false; referencedRelation: 'recipes'; referencedColumns: ['id'] }];
      };
      recipes: {
        Row: { adaptation_goal: string | null; cook_minutes: number; created_at: string; description: string; favorite: boolean; id: string; original_recipe_id: string | null; owner_id: string; prep_minutes: number; privacy: string; servings: number; source_captured_at: string; source_creator: string | null; source_kind: Database['public']['Enums']['recipe_source_kind']; source_label: string; source_url: string | null; taste_protection: string | null; title: string; updated_at: string; version_number: number };
        Insert: { adaptation_goal?: string | null; cook_minutes?: number; created_at?: string; description?: string; favorite?: boolean; id?: string; original_recipe_id?: string | null; owner_id: string; prep_minutes?: number; privacy?: string; servings?: number; source_captured_at?: string; source_creator?: string | null; source_kind: Database['public']['Enums']['recipe_source_kind']; source_label: string; source_url?: string | null; taste_protection?: string | null; title: string; updated_at?: string; version_number?: number };
        Update: { adaptation_goal?: string | null; cook_minutes?: number; created_at?: string; description?: string; favorite?: boolean; id?: string; original_recipe_id?: string | null; owner_id?: string; prep_minutes?: number; privacy?: string; servings?: number; source_captured_at?: string; source_creator?: string | null; source_kind?: Database['public']['Enums']['recipe_source_kind']; source_label?: string; source_url?: string | null; taste_protection?: string | null; title?: string; updated_at?: string; version_number?: number };
        Relationships: [{ foreignKeyName: 'recipes_original_recipe_id_fkey'; columns: ['original_recipe_id']; isOneToOne: false; referencedRelation: 'recipes'; referencedColumns: ['id'] }];
      };
    };
    Views: { [_ in never]: never };
    Functions: { [_ in never]: never };
    Enums: {
      import_stage: 'reading_source' | 'finding_ingredients' | 'building_steps' | 'checking_details' | 'preparing_recipe';
      import_status: 'queued' | 'processing' | 'needs_review' | 'completed' | 'failed';
      recipe_source_kind: 'manual' | 'sample' | 'imported';
    };
    CompositeTypes: { [_ in never]: never };
  };
};

type DatabaseWithoutInternals = Omit<Database, '__InternalSupabase'>;
type DefaultSchema = DatabaseWithoutInternals['public'];

export type Tables<TableName extends keyof DefaultSchema['Tables']> = DefaultSchema['Tables'][TableName]['Row'];
export type TablesInsert<TableName extends keyof DefaultSchema['Tables']> = DefaultSchema['Tables'][TableName]['Insert'];
export type TablesUpdate<TableName extends keyof DefaultSchema['Tables']> = DefaultSchema['Tables'][TableName]['Update'];
export type Enums<EnumName extends keyof DefaultSchema['Enums']> = DefaultSchema['Enums'][EnumName];

export const Constants = {
  public: {
    Enums: {
      import_stage: ['reading_source', 'finding_ingredients', 'building_steps', 'checking_details', 'preparing_recipe'],
      import_status: ['queued', 'processing', 'needs_review', 'completed', 'failed'],
      recipe_source_kind: ['manual', 'sample', 'imported']
    }
  }
} as const;
