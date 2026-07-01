export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          name: string | null;
          role: string;
          avatar_url: string | null;
          xp: number;
          level: number;
          streak_days: number;
          last_activity_date: string | null;
          created_at: string;
        };
        Insert: {
          id: string;
          name?: string | null;
          role?: string;
          avatar_url?: string | null;
          xp?: number;
          level?: number;
          streak_days?: number;
          last_activity_date?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string | null;
          role?: string;
          avatar_url?: string | null;
          xp?: number;
          level?: number;
          streak_days?: number;
          last_activity_date?: string | null;
          created_at?: string;
        };
      };
      modules: {
        Row: {
          id: string;
          slug: string;
          title: string;
          description: string;
          role: string;
          order_index: number;
          is_locked: boolean;
          icon: string;
          total_lessons: number;
          color: string;
        };
        Insert: {
          id?: string;
          slug: string;
          title: string;
          description: string;
          role?: string;
          order_index?: number;
          is_locked?: boolean;
          icon?: string;
          total_lessons?: number;
          color?: string;
        };
        Update: Partial<Database["public"]["Tables"]["modules"]["Insert"]>;
      };
      lessons: {
        Row: {
          id: string;
          module_id: string;
          title: string;
          content: string;
          lesson_type: "theory" | "quiz" | "simulation";
          order_index: number;
          xp_reward: number;
        };
        Insert: Omit<Database["public"]["Tables"]["lessons"]["Row"], "id"> & {
          id?: string;
        };
        Update: Partial<Database["public"]["Tables"]["lessons"]["Insert"]>;
      };
      user_lesson_progress: {
        Row: {
          id: string;
          user_id: string;
          lesson_id: string;
          completed: boolean;
          score: number | null;
          completed_at: string | null;
        };
        Insert: Omit<
          Database["public"]["Tables"]["user_lesson_progress"]["Row"],
          "id"
        > & { id?: string };
        Update: Partial<
          Database["public"]["Tables"]["user_lesson_progress"]["Insert"]
        >;
      };
      simulations: {
        Row: {
          id: string;
          title: string;
          context: string;
          lead_name: string;
          lead_company: string;
          lead_role: string;
          channel: "cold_call" | "email" | "linkedin" | "whatsapp";
          difficulty: "easy" | "medium" | "hard";
        };
        Insert: Omit<Database["public"]["Tables"]["simulations"]["Row"], "id"> &
          { id?: string };
        Update: Partial<
          Database["public"]["Tables"]["simulations"]["Insert"]
        >;
      };
      simulation_turns: {
        Row: {
          id: string;
          simulation_id: string;
          turn_index: number;
          lead_message: string;
          options: SimulationOption[];
        };
        Insert: Omit<
          Database["public"]["Tables"]["simulation_turns"]["Row"],
          "id"
        > & { id?: string };
        Update: Partial<
          Database["public"]["Tables"]["simulation_turns"]["Insert"]
        >;
      };
      user_simulation_results: {
        Row: {
          id: string;
          user_id: string;
          simulation_id: string;
          total_score: number;
          xp_earned: number;
          feedback: string;
          answers: Json;
          completed_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["user_simulation_results"]["Row"],
          "id"
        > & { id?: string };
        Update: Partial<
          Database["public"]["Tables"]["user_simulation_results"]["Insert"]
        >;
      };
      daily_missions: {
        Row: {
          id: string;
          title: string;
          description: string;
          mission_type: string;
          target_value: number;
          xp_reward: number;
        };
        Insert: Omit<
          Database["public"]["Tables"]["daily_missions"]["Row"],
          "id"
        > & { id?: string };
        Update: Partial<
          Database["public"]["Tables"]["daily_missions"]["Insert"]
        >;
      };
      user_daily_missions: {
        Row: {
          id: string;
          user_id: string;
          mission_id: string;
          date: string;
          completed: boolean;
          progress: number;
        };
        Insert: Omit<
          Database["public"]["Tables"]["user_daily_missions"]["Row"],
          "id"
        > & { id?: string };
        Update: Partial<
          Database["public"]["Tables"]["user_daily_missions"]["Insert"]
        >;
      };
      achievements: {
        Row: {
          id: string;
          slug: string;
          title: string;
          description: string;
          icon: string;
          xp_reward: number;
          condition_type: string;
          condition_value: number;
        };
        Insert: Omit<Database["public"]["Tables"]["achievements"]["Row"], "id"> &
          { id?: string };
        Update: Partial<
          Database["public"]["Tables"]["achievements"]["Insert"]
        >;
      };
      user_achievements: {
        Row: {
          id: string;
          user_id: string;
          achievement_id: string;
          unlocked_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["user_achievements"]["Row"],
          "id"
        > & { id?: string };
        Update: Partial<
          Database["public"]["Tables"]["user_achievements"]["Insert"]
        >;
      };
    };
  };
}

export interface SimulationOption {
  id: string;
  text: string;
  score: number;
  feedback: string;
  is_best?: boolean;
}
