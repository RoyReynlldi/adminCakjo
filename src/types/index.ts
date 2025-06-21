export interface Reservation {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  reservation_date: string;
  reservation_time: string;
  party_size: number;
  status: 'confirmed' | 'cancelled' | 'completed' | 'no_show';
  special_requests?: string;
  created_at: string;
  updated_at: string;
}

export interface ReservationFormData {
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  reservation_date: string;
  reservation_time: string;
  party_size: number;
  status: 'confirmed' | 'cancelled' | 'completed' | 'no_show';
  special_requests?: string;
}

export interface FilterState {
  search: string;
  status: string;
  date: string;
}

export interface SortState {
  field: keyof Reservation;
  direction: 'asc' | 'desc';
}