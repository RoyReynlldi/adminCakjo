import React, { useState, useEffect } from 'react';
import { X, Save, Calendar, Clock, Users, Mail, Phone, MessageSquare } from 'lucide-react';
import type { Reservation, ReservationFormData } from '../types';

interface ReservationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: ReservationFormData) => Promise<boolean>;
  reservation?: Reservation;
  mode: 'create' | 'edit';
}

export function ReservationModal({ isOpen, onClose, onSave, reservation, mode }: ReservationModalProps) {
  const [formData, setFormData] = useState<ReservationFormData>({
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    reservation_date: '',
    reservation_time: '',
    party_size: 1,
    status: 'confirmed',
    special_requests: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isOpen) {
      if (mode === 'edit' && reservation) {
        setFormData({
          customer_name: reservation.customer_name,
          customer_email: reservation.customer_email,
          customer_phone: reservation.customer_phone,
          reservation_date: reservation.reservation_date,
          reservation_time: reservation.reservation_time,
          party_size: reservation.party_size,
          status: reservation.status,
          special_requests: reservation.special_requests || ''
        });
      } else {
        setFormData({
          customer_name: '',
          customer_email: '',
          customer_phone: '',
          reservation_date: '',
          reservation_time: '',
          party_size: 1,
          status: 'confirmed',
          special_requests: ''
        });
      }
      setErrors({});
    }
  }, [isOpen, mode, reservation]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.customer_name.trim()) {
      newErrors.customer_name = 'Customer name is required';
    }
    if (!formData.customer_email.trim()) {
      newErrors.customer_email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.customer_email)) {
      newErrors.customer_email = 'Please enter a valid email';
    }
    if (!formData.customer_phone.trim()) {
      newErrors.customer_phone = 'Phone number is required';
    }
    if (!formData.reservation_date) {
      newErrors.reservation_date = 'Reservation date is required';
    }
    if (!formData.reservation_time) {
      newErrors.reservation_time = 'Reservation time is required';
    }
    if (formData.party_size < 1 || formData.party_size > 20) {
      newErrors.party_size = 'Party size must be between 1 and 20';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    const success = await onSave(formData);
    setLoading(false);

    if (success) {
      onClose();
    }
  };

  const handleChange = (field: keyof ReservationFormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <h2 className="text-xl font-semibold text-white">
            {mode === 'create' ? 'Create New Reservation' : 'Edit Reservation'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <Users className="h-4 w-4 inline mr-2" />
                Customer Name
              </label>
              <input
                type="text"
                value={formData.customer_name}
                onChange={(e) => handleChange('customer_name', e.target.value)}
                className={`w-full px-3 py-2 bg-gray-700 border ${errors.customer_name ? 'border-red-500' : 'border-gray-600'} rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
                placeholder="Enter customer name"
              />
              {errors.customer_name && (
                <p className="mt-1 text-sm text-red-400">{errors.customer_name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <Mail className="h-4 w-4 inline mr-2" />
                Email
              </label>
              <input
                type="email"
                value={formData.customer_email}
                onChange={(e) => handleChange('customer_email', e.target.value)}
                className={`w-full px-3 py-2 bg-gray-700 border ${errors.customer_email ? 'border-red-500' : 'border-gray-600'} rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
                placeholder="Enter email address"
              />
              {errors.customer_email && (
                <p className="mt-1 text-sm text-red-400">{errors.customer_email}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <Phone className="h-4 w-4 inline mr-2" />
                Phone Number
              </label>
              <input
                type="tel"
                value={formData.customer_phone}
                onChange={(e) => handleChange('customer_phone', e.target.value)}
                className={`w-full px-3 py-2 bg-gray-700 border ${errors.customer_phone ? 'border-red-500' : 'border-gray-600'} rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
                placeholder="Enter phone number"
              />
              {errors.customer_phone && (
                <p className="mt-1 text-sm text-red-400">{errors.customer_phone}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <Users className="h-4 w-4 inline mr-2" />
                Party Size
              </label>
              <input
                type="number"
                min="1"
                max="20"
                value={formData.party_size}
                onChange={(e) => handleChange('party_size', parseInt(e.target.value))}
                className={`w-full px-3 py-2 bg-gray-700 border ${errors.party_size ? 'border-red-500' : 'border-gray-600'} rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
              />
              {errors.party_size && (
                <p className="mt-1 text-sm text-red-400">{errors.party_size}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <Calendar className="h-4 w-4 inline mr-2" />
                Reservation Date
              </label>
              <input
                type="date"
                value={formData.reservation_date}
                onChange={(e) => handleChange('reservation_date', e.target.value)}
                className={`w-full px-3 py-2 bg-gray-700 border ${errors.reservation_date ? 'border-red-500' : 'border-gray-600'} rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
              />
              {errors.reservation_date && (
                <p className="mt-1 text-sm text-red-400">{errors.reservation_date}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <Clock className="h-4 w-4 inline mr-2" />
                Reservation Time
              </label>
              <input
                type="time"
                value={formData.reservation_time}
                onChange={(e) => handleChange('reservation_time', e.target.value)}
                className={`w-full px-3 py-2 bg-gray-700 border ${errors.reservation_time ? 'border-red-500' : 'border-gray-600'} rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
              />
              {errors.reservation_time && (
                <p className="mt-1 text-sm text-red-400">{errors.reservation_time}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) => handleChange('status', e.target.value as 'confirmed' | 'cancelled' | 'completed' | 'no_show')}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="confirmed">Confirmed</option>
              <option value="cancelled">Cancelled</option>
              <option value="completed">Completed</option>
              <option value="no_show">No Show</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              <MessageSquare className="h-4 w-4 inline mr-2" />
              Special Requests
            </label>
            <textarea
              value={formData.special_requests}
              onChange={(e) => handleChange('special_requests', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
              placeholder="Any special requests or notes..."
            />
          </div>

          <div className="flex justify-end space-x-4 pt-4 border-t border-gray-700">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-600 rounded-lg text-gray-300 hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
            >
              {loading ? (
                <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              {loading ? 'Saving...' : 'Save Reservation'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}