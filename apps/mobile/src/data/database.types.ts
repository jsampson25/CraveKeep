export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  __InternalSupabase: { PostgrestVersion: '14.15' };
  public: {
    Tables: {
      cook_sessions: {
        Row: { id: string; owner_id: string; recipe_id: string; taste: number; effort: 'easy' | 'expected' | 'hard'; repeat_intent: boolean; notes: string; cooked_at: string };
        Insert: { id?: string; owner_id: string; recipe_id: string; taste: number; effort: 'easy' | 'expected' | 'hard'; repeat_intent: boolean; notes?: string; cooked_at?: string };
        Update: { id?: string; owner_id?: string; recipe_id?: string; taste?: number; effort?: 'easy' | 'expected' | 'hard'; repeat_intent?: boolean; notes?: string; cooked_at?: string };
        Relationships: [{ foreignKeyName: 'cook_sessions_recipe_id_fkey'; columns: ['recipe_id']; isOneToOne: false; referencedRelation: 'recipes'; referencedColumns: ['id'] }];
      };
      capture_jobs: {
        Row: { created_at: string; error_message: string | null; extracted_recipe_id: string | null; id: string; owner_id: string; recovery_code: string | null; source_creator: string | null; source_host: string; source_title: string | null; source_url: string; stage: Database['public']['Enums']['import_stage'] | null; stage_index: number; status: Database['public']['Enums']['import_status']; updated_at: string };
        Insert: { created_at?: string; error_message?: string | null; extracted_recipe_id?: string | null; id?: string; owner_id: string; recovery_code?: string | null; source_creator?: string | null; source_host: string; source_title?: string | null; source_url: string; stage?: Database['public']['Enums']['import_stage'] | null; stage_index?: number; status?: Database['public']['Enums']['import_status']; updated_at?: string };
        Update: { created_at?: string; error_message?: string | null; extracted_recipe_id?: string | null; id?: string; owner_id?: string; recovery_code?: string | null; source_creator?: string | null; source_host?: string; source_title?: string | null; source_url?: string; stage?: Database['public']['Enums']['import_stage'] | null; stage_index?: number; status?: Database['public']['Enums']['import_status']; updated_at?: string };
        Relationships: [{ foreignKeyName: 'capture_jobs_extracted_recipe_id_fkey'; columns: ['extracted_recipe_id']; isOneToOne: false; referencedRelation: 'recipes'; referencedColumns: ['id'] }];
      };
      profiles: {
        Row: { avatar_url: string | null; created_at: string; display_name: string | null; id: string; onboarding_completed: boolean; updated_at: string; username: string | null };
        Insert: { avatar_url?: string | null; created_at?: string; display_name?: string | null; id: string; onboarding_completed?: boolean; updated_at?: string; username?: string | null };
        Update: { avatar_url?: string | null; created_at?: string; display_name?: string | null; id?: string; onboarding_completed?: boolean; updated_at?: string; username?: string | null };
        Relationships: [];
      };
      food_profiles: {
        Row: { owner_id: string; loved_foods: string[]; avoided_foods: string[]; never_suggest_foods: string[]; allergies: string[]; dietary_preferences: string[]; cooking_time: string; cooking_skill: string; appliances: string[]; updated_at: string };
        Insert: { owner_id: string; loved_foods?: string[]; avoided_foods?: string[]; never_suggest_foods?: string[]; allergies?: string[]; dietary_preferences?: string[]; cooking_time?: string; cooking_skill?: string; appliances?: string[]; updated_at?: string };
        Update: { owner_id?: string; loved_foods?: string[]; avoided_foods?: string[]; never_suggest_foods?: string[]; allergies?: string[]; dietary_preferences?: string[]; cooking_time?: string; cooking_skill?: string; appliances?: string[]; updated_at?: string };
        Relationships: [];
      };
      nutrition_goals: {
        Row: { owner_id: string; goal: string; calculation_mode: string; calories: number; protein_grams: number; carbohydrate_grams: number; fat_grams: number; fiber_grams: number; age: number | null; sex_for_calculation: string | null; height_cm: number | null; current_weight_kg: number | null; target_weight_kg: number | null; activity_level: string | null; weekly_average: boolean; flexible_day: boolean; updated_at: string };
        Insert: { owner_id: string; goal?: string; calculation_mode?: string; calories?: number; protein_grams?: number; carbohydrate_grams?: number; fat_grams?: number; fiber_grams?: number; age?: number | null; sex_for_calculation?: string | null; height_cm?: number | null; current_weight_kg?: number | null; target_weight_kg?: number | null; activity_level?: string | null; weekly_average?: boolean; flexible_day?: boolean; updated_at?: string };
        Update: { owner_id?: string; goal?: string; calculation_mode?: string; calories?: number; protein_grams?: number; carbohydrate_grams?: number; fat_grams?: number; fiber_grams?: number; age?: number | null; sex_for_calculation?: string | null; height_cm?: number | null; current_weight_kg?: number | null; target_weight_kg?: number | null; activity_level?: string | null; weekly_average?: boolean; flexible_day?: boolean; updated_at?: string };
        Relationships: [];
      };
      households: {
        Row: { id: string; owner_id: string; name: string; created_at: string; updated_at: string };
        Insert: { id?: string; owner_id: string; name: string; created_at?: string; updated_at?: string };
        Update: { id?: string; owner_id?: string; name?: string; created_at?: string; updated_at?: string };
        Relationships: [];
      };
      household_members: {
        Row: { household_id: string; user_id: string; role: string; display_name: string | null };
        Insert: { household_id: string; user_id: string; role?: string; display_name?: string | null };
        Update: { household_id?: string; user_id?: string; role?: string; display_name?: string | null };
        Relationships: [];
      };
      household_dependents: {
        Row: { id: string; household_id: string; display_name: string; member_type: string; allergies: string[]; preferences: string[]; created_at: string; updated_at: string };
        Insert: { id?: string; household_id: string; display_name: string; member_type?: string; allergies?: string[]; preferences?: string[]; created_at?: string; updated_at?: string };
        Update: { id?: string; household_id?: string; display_name?: string; member_type?: string; allergies?: string[]; preferences?: string[]; created_at?: string; updated_at?: string };
        Relationships: [];
      };
      nutrition_provider_cache: {
        Row: { expires_at: string; fetched_at: string; payload: Json; provider: string; query_key: string };
        Insert: { expires_at: string; fetched_at?: string; payload: Json; provider: string; query_key: string };
        Update: { expires_at?: string; fetched_at?: string; payload?: Json; provider?: string; query_key?: string };
        Relationships: [];
      };
      daily_nutrition_targets: {
        Row: { owner_id: string; calories: number; protein_grams: number; carbohydrate_grams: number; fat_grams: number; sodium_milligrams: number; updated_at: string };
        Insert: { owner_id: string; calories: number; protein_grams: number; carbohydrate_grams: number; fat_grams: number; sodium_milligrams: number; updated_at?: string };
        Update: { owner_id?: string; calories?: number; protein_grams?: number; carbohydrate_grams?: number; fat_grams?: number; sodium_milligrams?: number; updated_at?: string };
        Relationships: [];
      };
      planned_meals: {
        Row: { id: string; owner_id: string; meal_date: string; slot: 'breakfast' | 'lunch' | 'dinner' | 'snack'; recipe_id: string; servings: number; status: 'planned' | 'eaten'; created_at: string };
        Insert: { id?: string; owner_id: string; meal_date: string; slot: 'breakfast' | 'lunch' | 'dinner' | 'snack'; recipe_id: string; servings: number; status?: 'planned' | 'eaten'; created_at?: string };
        Update: { id?: string; owner_id?: string; meal_date?: string; slot?: 'breakfast' | 'lunch' | 'dinner' | 'snack'; recipe_id?: string; servings?: number; status?: 'planned' | 'eaten'; created_at?: string };
        Relationships: [{ foreignKeyName: 'planned_meals_recipe_id_fkey'; columns: ['recipe_id']; isOneToOne: false; referencedRelation: 'recipes'; referencedColumns: ['id'] }];
      };
      grocery_items: {
        Row: { id: string; owner_id: string; item_key: string; name: string; quantity: string; aisle: 'produce' | 'meat_seafood' | 'dairy_eggs' | 'bakery' | 'pantry' | 'frozen' | 'other'; note: string; source_recipe_ids: string[]; checked: boolean; uncertain: boolean; updated_at: string };
        Insert: { id?: string; owner_id: string; item_key: string; name: string; quantity?: string; aisle?: 'produce' | 'meat_seafood' | 'dairy_eggs' | 'bakery' | 'pantry' | 'frozen' | 'other'; note?: string; source_recipe_ids?: string[]; checked?: boolean; uncertain?: boolean; updated_at?: string };
        Update: { id?: string; owner_id?: string; item_key?: string; name?: string; quantity?: string; aisle?: 'produce' | 'meat_seafood' | 'dairy_eggs' | 'bakery' | 'pantry' | 'frozen' | 'other'; note?: string; source_recipe_ids?: string[]; checked?: boolean; uncertain?: boolean; updated_at?: string };
        Relationships: [];
      };
      pantry_items: {
        Row: { owner_id: string; item_key: string; name: string; quantity: string; confidence: 'confirmed' | 'estimated' | 'unknown'; expires_on: string | null; updated_at: string };
        Insert: { owner_id: string; item_key: string; name: string; quantity?: string; confidence?: 'confirmed' | 'estimated' | 'unknown'; expires_on?: string | null; updated_at?: string };
        Update: { owner_id?: string; item_key?: string; name?: string; quantity?: string; confidence?: 'confirmed' | 'estimated' | 'unknown'; expires_on?: string | null; updated_at?: string };
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
    Functions: { create_my_household: { Args: { household_name: string }; Returns: string }; is_username_available: { Args: { candidate: string }; Returns: boolean } };
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
