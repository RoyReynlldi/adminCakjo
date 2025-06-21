export interface Database {
  public: {
    Tables: {
      reservations: {
        Row: {
          id: string;
          customer_name: string;
          customer_email: string;
          customer_phone: string;
          reservation_date: string;
          reservation_time: string;
          party_size: number;
          status: 'confirmed' | 'cancelled' | 'completed' | 'no_show';
          special_requests: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          customer_name: string;
          customer_email: string;
          customer_phone: string;
          reservation_date: string;
          reservation_time: string;
          party_size: number;
          status?: 'confirmed' | 'cancelled' | 'completed' | 'no_show';
          special_requests?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          customer_name?: string;
          customer_email?: string;
          customer_phone?: string;
          reservation_date?: string;
          reservation_time?: string;
          party_size?: number;
          status?: 'confirmed' | 'cancelled' | 'completed' | 'no_show';
          special_requests?: string | null;
          updated_at?: string;
        };
      };
    };
  };
}