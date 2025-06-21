import React from 'react';
import { Edit2, Trash2, Phone, Mail, Calendar, Clock, Users, ChevronUp, ChevronDown } from 'lucide-react';
import type { Reservation, SortState } from '../types';

interface ReservationTableProps {
  reservations: Reservation[];
  onEdit: (reservation: Reservation) => void;
  onDelete: (id: string) => void;
  sortState: SortState;
  onSort: (field: keyof Reservation) => void;
}

export function ReservationTable({ reservations, onEdit, onDelete, sortState, onSort }: ReservationTableProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-900 text-green-200 border-green-700';
      case 'cancelled':
        return 'bg-red-900 text-red-200 border-red-700';
      case 'completed':
        return 'bg-blue-900 text-blue-200 border-blue-700';
      case 'no_show':
        return 'bg-gray-900 text-gray-200 border-gray-700';
      default:
        return 'bg-gray-900 text-gray-200 border-gray-700';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const formatStatus = (status: string) => {
    switch (status) {
      case 'no_show':
        return 'No Show';
      default:
        return status.charAt(0).toUpperCase() + status.slice(1);
    }
  };

  const SortableHeader = ({ field, children, className = '' }: { 
    field: keyof Reservation; 
    children: React.ReactNode; 
    className?: string 
  }) => (
    <th 
      className={`px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-700 transition-colors ${className}`}
      onClick={() => onSort(field)}
    >
      <div className="flex items-center">
        {children}
        <div className="ml-2 flex flex-col">
          <ChevronUp 
            className={`h-3 w-3 ${sortState.field === field && sortState.direction === 'asc' ? 'text-purple-400' : 'text-gray-500'}`} 
          />
          <ChevronDown 
            className={`h-3 w-3 -mt-1 ${sortState.field === field && sortState.direction === 'desc' ? 'text-purple-400' : 'text-gray-500'}`} 
          />
        </div>
      </div>
    </th>
  );

  if (reservations.length === 0) {
    return (
      <div className="bg-gray-800 rounded-lg border border-gray-700 p-8 text-center">
        <Calendar className="h-12 w-12 text-gray-500 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-300 mb-2">No reservations found</h3>
        <p className="text-gray-500">Create your first reservation to get started.</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-700">
          <thead className="bg-gray-900">
            <tr>
              <SortableHeader field="customer_name">
                <Users className="h-4 w-4 mr-2" />
                Customer
              </SortableHeader>
              <SortableHeader field="reservation_date">
                <Calendar className="h-4 w-4 mr-2" />
                Date & Time
              </SortableHeader>
              <SortableHeader field="party_size">
                <Users className="h-4 w-4 mr-2" />
                Party
              </SortableHeader>
              <SortableHeader field="status">
                Status
              </SortableHeader>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Contact
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Special Requests
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-gray-800 divide-y divide-gray-700">
            {reservations.map((reservation, index) => (
              <tr 
                key={reservation.id} 
                className={`hover:bg-gray-700 transition-colors ${index % 2 === 0 ? 'bg-gray-800' : 'bg-gray-850'}`}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-white">
                    {reservation.customer_name}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-white">
                    {formatDate(reservation.reservation_date)}
                  </div>
                  <div className="text-sm text-gray-400 flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    {formatTime(reservation.reservation_time)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-white font-medium">
                    {reservation.party_size} {reservation.party_size === 1 ? 'guest' : 'guests'}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getStatusColor(reservation.status)}`}>
                    {formatStatus(reservation.status)}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-300">
                    <div className="flex items-center mb-1">
                      <Mail className="h-3 w-3 mr-2 text-gray-500" />
                      <span className="truncate max-w-[150px]">{reservation.customer_email}</span>
                    </div>
                    <div className="flex items-center">
                      <Phone className="h-3 w-3 mr-2 text-gray-500" />
                      <span>{reservation.customer_phone}</span>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-300 max-w-[200px]">
                    {reservation.special_requests ? (
                      <p className="truncate" title={reservation.special_requests}>
                        {reservation.special_requests}
                      </p>
                    ) : (
                      <span className="text-gray-500 italic">None</span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => onEdit(reservation)}
                      className="text-purple-400 hover:text-purple-300 transition-colors p-1"
                      title="Edit reservation"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => onDelete(reservation.id)}
                      className="text-red-400 hover:text-red-300 transition-colors p-1"
                      title="Delete reservation"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}