export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      exam_items: {
        Row: {
          completed_at: string | null
          created_at: string | null
          form_snapshot: Json
          id: string
          request_id: string
          status: string
          template_id: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string | null
          form_snapshot?: Json
          id?: string
          request_id: string
          status?: string
          template_id?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string | null
          form_snapshot?: Json
          id?: string
          request_id?: string
          status?: string
          template_id?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "exam_items_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "exam_requests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "exam_items_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "exam_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      exam_phrases: {
        Row: {
          category: string
          content: string
          created_at: string | null
          id: string
          label: string
          unit_id: string | null
          user_id: string
        }
        Insert: {
          category: string
          content: string
          created_at?: string | null
          id?: string
          label: string
          unit_id?: string | null
          user_id: string
        }
        Update: {
          category?: string
          content?: string
          created_at?: string | null
          id?: string
          label?: string
          unit_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "exam_phrases_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "units"
            referencedColumns: ["id"]
          },
        ]
      }
      exam_requests: {
        Row: {
          completed_at: string | null
          created_at: string | null
          date: string
          id: string
          notes: string | null
          patient_id: string
          status: string
          unit_id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string | null
          date?: string
          id?: string
          notes?: string | null
          patient_id: string
          status?: string
          unit_id: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string | null
          date?: string
          id?: string
          notes?: string | null
          patient_id?: string
          status?: string
          unit_id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "exam_requests_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "exam_requests_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "units"
            referencedColumns: ["id"]
          },
        ]
      }
      exam_templates: {
        Row: {
          active: boolean | null
          created_at: string | null
          description: string | null
          id: string
          impression: string | null
          technique: string | null
          title: string
          unit_id: string | null
          updated_at: string | null
          user_id: string
          variables: Json
        }
        Insert: {
          active?: boolean | null
          created_at?: string | null
          description?: string | null
          id?: string
          impression?: string | null
          technique?: string | null
          title: string
          unit_id?: string | null
          updated_at?: string | null
          user_id: string
          variables?: Json
        }
        Update: {
          active?: boolean | null
          created_at?: string | null
          description?: string | null
          id?: string
          impression?: string | null
          technique?: string | null
          title?: string
          unit_id?: string | null
          updated_at?: string | null
          user_id?: string
          variables?: Json
        }
        Relationships: [
          {
            foreignKeyName: "exam_templates_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "units"
            referencedColumns: ["id"]
          },
        ]
      }
      patients: {
        Row: {
          birth_date: string | null
          cpf: string | null
          created_at: string | null
          gender: string | null
          id: string
          mother_name: string | null
          name: string
          notes: string | null
          phone: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          birth_date?: string | null
          cpf?: string | null
          created_at?: string | null
          gender?: string | null
          id?: string
          mother_name?: string | null
          name: string
          notes?: string | null
          phone?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          birth_date?: string | null
          cpf?: string | null
          created_at?: string | null
          gender?: string | null
          id?: string
          mother_name?: string | null
          name?: string
          notes?: string | null
          phone?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          crm: string | null
          email: string
          full_name: string | null
          id: string
          role: string
          signature: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          crm?: string | null
          email: string
          full_name?: string | null
          id: string
          role?: string
          signature?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          crm?: string | null
          email?: string
          full_name?: string | null
          id?: string
          role?: string
          signature?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      units: {
        Row: {
          active: boolean | null
          address: string | null
          created_at: string | null
          id: string
          logo_url: string | null
          name: string
          phone: string | null
          report_footer: string | null
          report_header: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          active?: boolean | null
          address?: string | null
          created_at?: string | null
          id?: string
          logo_url?: string | null
          name: string
          phone?: string | null
          report_footer?: string | null
          report_header?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          active?: boolean | null
          address?: string | null
          created_at?: string | null
          id?: string
          logo_url?: string | null
          name?: string
          phone?: string | null
          report_footer?: string | null
          report_header?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database["public"]

export type Tables<T extends keyof DefaultSchema["Tables"]> =
  DefaultSchema["Tables"][T]["Row"]

export type TablesInsert<T extends keyof DefaultSchema["Tables"]> =
  DefaultSchema["Tables"][T]["Insert"]

export type TablesUpdate<T extends keyof DefaultSchema["Tables"]> =
  DefaultSchema["Tables"][T]["Update"]

// Convenience types
export type Profile = Tables<"profiles">
export type Unit = Tables<"units">
export type Patient = Tables<"patients">
export type ExamTemplate = Tables<"exam_templates">
export type ExamPhrase = Tables<"exam_phrases">
export type ExamRequest = Tables<"exam_requests">
export type ExamItem = Tables<"exam_items">

// Variable definition structure for exam templates
export interface TemplateVariable {
  name: string      // e.g. "ecogenicidade"
  label: string     // e.g. "Ecogenicidade"
  options: string[] // e.g. ["normal", "aumentada", "reduzida"]
}

// Form snapshot stored in exam_items
export interface ExamFormSnapshot {
  technique?: string
  description?: string
  impression?: string
  variable_selections: Record<string, string> // { [varName]: selectedOption }
}
