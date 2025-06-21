import { useState, useEffect } from 'react';
import { supabase, isUsingMockData } from '../lib/supabase';
import type { Reservation, ReservationFormData } from '../types';

// Mock data for demonstration
const mockReservations: Reservation[] = [
  {
    id: '1',
    customer_name: 'John Smith',
    customer_email: 'john.smith@email.com',
    customer_phone: '+1 (555) 123-4567',
    reservation_date: '2024-01-15',
    reservation_time: '19:00',
    party_size: 4,
    status: 'confirmed',
    special_requests: 'Window table preferred',
    created_at: '2024-01-10T10:00:00Z',
    updated_at: '2024-01-10T10:00:00Z'
  },
  {
    id: '2',
    customer_name: 'Emily Johnson',
    customer_email: 'emily.johnson@email.com',
    customer_phone: '+1 (555) 987-6543',
    reservation_date: '2024-01-16',
    reservation_time: '18:30',
    party_size: 2,
    status: 'confirmed',
    special_requests: 'Birthday celebration',
    created_at: '2024-01-11T14:30:00Z',
    updated_at: '2024-01-11T14:30:00Z'
  },
  {
    id: '3',
    customer_name: 'Michael Brown',
    customer_email: 'michael.brown@email.com',
    customer_phone: '+1 (555) 456-7890',
    reservation_date: '2024-01-17',
    reservation_time: '20:00',
    party_size: 6,
    status: 'confirmed',
    special_requests: 'Business dinner',
    created_at: '2024-01-12T09:15:00Z',
    updated_at: '2024-01-12T09:15:00Z'
  }
];

export function useReservations() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    try {
      setLoading(true);
      setError(null);

      if (isUsingMockData) {
        // Use mock data for demonstration
        setTimeout(() => {
          setReservations(mockReservations);
          setLoading(false);
        }, 500);
        return;
      }

      const { data, error } = await supabase
        .from('reservations')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setReservations(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      // Fallback to mock data on error
      setReservations(mockReservations);
    } finally {
      setLoading(false);
    }
  };

  const createReservation = async (data: ReservationFormData): Promise<boolean> => {
    try {
      setError(null);

      if (isUsingMockData) {
        // Mock creation
        const newReservation: Reservation = {
          ...data,
          id: Date.now().toString(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        setReservations(prev => [newReservation, ...prev]);
        return true;
      }

      const { error } = await supabase
        .from('reservations')
        .insert([{
          ...data,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }]);

      if (error) throw error;

      await fetchReservations();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create reservation');
      return false;
    }
  };

  const updateReservation = async (id: string, data: Partial<ReservationFormData>): Promise<boolean> => {
    try {
      setError(null);

      if (isUsingMockData) {
        // Mock update
        setReservations(prev => prev.map(res => 
          res.id === id 
            ? { ...res, ...data, updated_at: new Date().toISOString() }
            : res
        ));
        return true;
      }

      const { error } = await supabase
        .from('reservations')
        .update({
          ...data,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) throw error;

      await fetchReservations();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update reservation');
      return false;
    }
  };

  const deleteReservation = async (id: string): Promise<boolean> => {
  try {
    setError(null);

    if (isUsingMockData) {
      // Mock deletion
      setReservations(prev => prev.filter(res => res.id !== id));
      console.log(`Reservation with ID ${id} deleted successfully (mock data).`);
      return true;
    }

    const { error } = await supabase
      .from('reservations')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting reservation:', error);
      throw error;  // Re-throw error to be caught below
    }

    console.log(`Reservation with ID ${id} deleted successfully from Supabase.`);
    await fetchReservations();  // Refresh reservations after delete
    return true;
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Failed to delete reservation';
    setError(errorMessage);
    console.error('Error during deletion:', errorMessage);
    return false;
  }
};


  return {
    reservations,
    loading,
    error,
    fetchReservations,
    createReservation,
    updateReservation,
    deleteReservation
  };
}