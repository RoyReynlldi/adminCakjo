import { useState, useMemo } from 'react';
import { 
  Plus, 
  Search, 
  Calendar, 
  Users, 
  LogOut, 
  RefreshCw,
  ChefHat,
  TrendingUp,
  Clock
} from 'lucide-react';
import { useReservations } from '../hooks/useReservations';
import { ReservationTable } from './ReservationTable';
import { ReservationModal } from './ReservationModal';
import type { Reservation, FilterState, SortState, ReservationFormData } from '../types';

interface DashboardProps {
  onLogout: () => void;
}

export function Dashboard({ onLogout }: DashboardProps) {
  const { reservations, loading, error, createReservation, updateReservation, deleteReservation, fetchReservations } = useReservations();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [selectedReservation, setSelectedReservation] = useState<Reservation | undefined>();
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    status: '',
    date: ''
  });
  const [sortState, setSortState] = useState<SortState>({
    field: 'reservation_date',
    direction: 'desc'
  });

  const filteredAndSortedReservations = useMemo(() => {
    let filtered = reservations.filter(reservation => {
      const matchesSearch = 
        reservation.customer_name.toLowerCase().includes(filters.search.toLowerCase()) ||
        reservation.customer_email.toLowerCase().includes(filters.search.toLowerCase()) ||
        reservation.customer_phone.includes(filters.search);
      
      const matchesStatus = !filters.status || reservation.status === filters.status;
      const matchesDate = !filters.date || reservation.reservation_date === filters.date;
      
      return matchesSearch && matchesStatus && matchesDate;
    });

    // Sort reservations
    filtered.sort((a, b) => {
      let aValue = a[sortState.field];
      let bValue = b[sortState.field];

      // Provide fallback for undefined values
      if (aValue === undefined) aValue = '';
      if (bValue === undefined) bValue = '';

      // Handle different data types
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (aValue < bValue) {
        return sortState.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortState.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });

    return filtered;
  }, [reservations, filters, sortState]);

  const handleSort = (field: keyof Reservation) => {
    setSortState(prev => ({
      field,
      direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleCreateReservation = () => {
    setModalMode('create');
    setSelectedReservation(undefined);
    setIsModalOpen(true);
  };

  const handleEditReservation = (reservation: Reservation) => {
    setModalMode('edit');
    setSelectedReservation(reservation);
    setIsModalOpen(true);
  };

  const handleDeleteReservation = async (id: string) => {
  console.log('handleDeleteReservation is called with id:', id);  // Debugging log
  if (window.confirm('Are you sure you want to delete this reservation?')) {
    const result = await deleteReservation(id);
    if (result) {
      console.log(`Reservation with ID ${id} deleted successfully.`);
    } else {
      console.error('Failed to delete reservation.');
    }
  }
};



  const handleSaveReservation = async (data: ReservationFormData): Promise<boolean> => {
    if (modalMode === 'create') {
      return await createReservation(data);
    } else if (selectedReservation) {
      return await updateReservation(selectedReservation.id, data);
    }
    return false;
  };

  const stats = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    const todayReservations = reservations.filter(r => r.reservation_date === today);
    const confirmedReservations = reservations.filter(r => r.status === 'confirmed');
    const totalGuests = reservations.reduce((sum, r) => sum + r.party_size, 0);
    
    return {
      total: reservations.length,
      today: todayReservations.length,
      confirmed: confirmedReservations.length,
      guests: totalGuests
    };
  }, [reservations]);

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="h-8 w-8 bg-purple-600 rounded-lg flex items-center justify-center mr-3">
              <ChefHat className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-white">Restaurant Admin CakJo!</h1>
              <p className="text-sm text-gray-400">Reservation Management System</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={fetchReservations}
              disabled={loading}
              className="p-2 text-gray-400 hover:text-white transition-colors"
              title="Refresh reservations"
            >
              <RefreshCw className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={onLogout}
              className="flex items-center px-3 py-2 text-sm text-gray-300 hover:text-white transition-colors"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
            <div className="flex items-center">
              <div className="h-12 w-12 bg-purple-600 rounded-lg flex items-center justify-center">
                <Calendar className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-400">Total Reservations</p>
                <p className="text-2xl font-bold text-white">{stats.total}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
            <div className="flex items-center">
              <div className="h-12 w-12 bg-blue-600 rounded-lg flex items-center justify-center">
                <Clock className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-400">Today's Reservations</p>
                <p className="text-2xl font-bold text-white">{stats.today}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
            <div className="flex items-center">
              <div className="h-12 w-12 bg-green-600 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-400">Confirmed</p>
                <p className="text-2xl font-bold text-white">{stats.confirmed}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
            <div className="flex items-center">
              <div className="h-12 w-12 bg-orange-600 rounded-lg flex items-center justify-center">
                <Users className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-400">Total Guests</p>
                <p className="text-2xl font-bold text-white">{stats.guests}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Controls */}
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 flex-1">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search by name, email, or phone..."
                  value={filters.search}
                  onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                  className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              
              <div className="flex space-x-4">
                <select
                  value={filters.status}
                  onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                  className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="">All Status</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="completed">Completed</option>
                  <option value="no_show">No Show</option>
                </select>
                
                <input
                  type="date"
                  value={filters.date}
                  onChange={(e) => setFilters(prev => ({ ...prev, date: e.target.value }))}
                  className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <button
              onClick={handleCreateReservation}
              className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Reservation
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-900/50 border border-red-700 text-red-200 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin h-8 w-8 border-2 border-purple-500 border-t-transparent rounded-full"></div>
            <span className="ml-3 text-gray-400">Loading reservations...</span>
          </div>
        )}

        {/* Reservations Table */}
        {!loading && (
          <ReservationTable
            reservations={filteredAndSortedReservations}
            onEdit={handleEditReservation}
            onDelete={handleDeleteReservation}
            sortState={sortState}
            onSort={handleSort}
          />
        )}
      </div>

      {/* Modal */}
      <ReservationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveReservation}
        reservation={selectedReservation}
        mode={modalMode}
      />
    </div>
  );
}