export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      catalogo_items: {
        Row: {
          activo: boolean
          created_at: string
          descripcion: string | null
          id: number
          nombre: string
          precio_referecia: number
          tipo_unidad: string
          usuario_id: number
        }
        Insert: {
          activo?: boolean
          created_at?: string
          descripcion?: string | null
          id?: never
          nombre: string
          precio_referecia: number
          tipo_unidad: string
          usuario_id: number
        }
        Update: {
          activo?: boolean
          created_at?: string
          descripcion?: string | null
          id?: never
          nombre?: string
          precio_referecia?: number
          tipo_unidad?: string
          usuario_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "catalogo_items_usuario_id_fkey"
            columns: ["usuario_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      clientes: {
        Row: {
          created_at: string
          email: string
          empresa: string
          id: number
          nombre: string
          telefono: string
          usuario_id: number
        }
        Insert: {
          created_at?: string
          email: string
          empresa: string
          id?: never
          nombre: string
          telefono: string
          usuario_id: number
        }
        Update: {
          created_at?: string
          email?: string
          empresa?: string
          id?: never
          nombre?: string
          telefono?: string
          usuario_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "clientes_usuario_id_fkey"
            columns: ["usuario_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      pagos: {
        Row: {
          created_at: string
          fecha_pago: string
          id: number
          metodo: string
          monto: number
          notas: string | null
          proyecto_id: number
        }
        Insert: {
          created_at?: string
          fecha_pago?: string
          id?: never
          metodo: string
          monto: number
          notas?: string | null
          proyecto_id: number
        }
        Update: {
          created_at?: string
          fecha_pago?: string
          id?: never
          metodo?: string
          monto?: number
          notas?: string | null
          proyecto_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "pagos_proyecto_id_fkey"
            columns: ["proyecto_id"]
            isOneToOne: false
            referencedRelation: "proyectos"
            referencedColumns: ["id"]
          },
        ]
      }
      presupuesto_items: {
        Row: {
          cantidad: number
          id: number
          nombre_historico: string
          precio_unitario: number
          presupuesto_id: number
          subtotal_item: number
          tipo_unidad_historica: string
        }
        Insert: {
          cantidad: number
          id?: never
          nombre_historico: string
          precio_unitario: number
          presupuesto_id: number
          subtotal_item: number
          tipo_unidad_historica: string
        }
        Update: {
          cantidad?: number
          id?: never
          nombre_historico?: string
          precio_unitario?: number
          presupuesto_id?: number
          subtotal_item?: number
          tipo_unidad_historica?: string
        }
        Relationships: [
          {
            foreignKeyName: "presupuesto_items_presupuesto_id_fkey"
            columns: ["presupuesto_id"]
            isOneToOne: false
            referencedRelation: "presupuestos"
            referencedColumns: ["id"]
          },
        ]
      }
      presupuestos: {
        Row: {
          codigo: string
          created_at: string
          estado: string
          fecha_emision: string
          id: number
          impuestos: number
          pdf_url: string | null
          proyecto_id: number
          subtotal: number
          total: number
        }
        Insert: {
          codigo: string
          created_at?: string
          estado?: string
          fecha_emision?: string
          id?: never
          impuestos: number
          pdf_url?: string | null
          proyecto_id: number
          subtotal: number
          total: number
        }
        Update: {
          codigo?: string
          created_at?: string
          estado?: string
          fecha_emision?: string
          id?: never
          impuestos?: number
          pdf_url?: string | null
          proyecto_id?: number
          subtotal?: number
          total?: number
        }
        Relationships: [
          {
            foreignKeyName: "presupuestos_proyecto_id_fkey"
            columns: ["proyecto_id"]
            isOneToOne: false
            referencedRelation: "proyectos"
            referencedColumns: ["id"]
          },
        ]
      }
      proyecto_repositorios: {
        Row: {
          created_at: string
          id: number
          nombre: string
          proyecto_id: number
          url: string
        }
        Insert: {
          created_at?: string
          id?: never
          nombre: string
          proyecto_id: number
          url: string
        }
        Update: {
          created_at?: string
          id?: never
          nombre?: string
          proyecto_id?: number
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "proyecto_repositorios_proyecto_id_fkey"
            columns: ["proyecto_id"]
            isOneToOne: false
            referencedRelation: "proyectos"
            referencedColumns: ["id"]
          },
        ]
      }
      proyectos: {
        Row: {
          cliente_id: number
          created_at: string
          descripcion: string | null
          estado: string
          id: number
          nombre: string
        }
        Insert: {
          cliente_id: number
          created_at?: string
          descripcion?: string | null
          estado?: string
          id?: never
          nombre: string
        }
        Update: {
          cliente_id?: number
          created_at?: string
          descripcion?: string | null
          estado?: string
          id?: never
          nombre?: string
        }
        Relationships: [
          {
            foreignKeyName: "proyectos_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["id"]
          },
        ]
      }
      usuarios: {
        Row: {
          auth_user_id: string | null
          created_at: string
          email: string
          empresa_nombre: string
          id: number
          nombre: string
        }
        Insert: {
          auth_user_id?: string | null
          created_at?: string
          email: string
          empresa_nombre: string
          id?: never
          nombre: string
        }
        Update: {
          auth_user_id?: string | null
          created_at?: string
          email?: string
          empresa_nombre?: string
          id?: never
          nombre?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      current_usuario_id: { Args: never; Returns: number }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
