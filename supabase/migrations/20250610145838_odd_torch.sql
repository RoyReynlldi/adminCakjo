/*
  # Restaurant Reservation System Database Schema

  1. New Tables
    - `reservations`
      - `id` (uuid, primary key)
      - `customer_name` (text)
      - `customer_email` (text)
      - `customer_phone` (text)
      - `reservation_date` (date)
      - `reservation_time` (time)
      - `party_size` (integer)
      - `special_requests` (text, optional)
      - `status` (text, default: 'confirmed')
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `menu_items`
      - `id` (uuid, primary key)
      - `name` (text)
      - `description` (text)
      - `price` (decimal)
      - `category` (text)
      - `is_available` (boolean, default: true)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `restaurant_settings`
      - `id` (uuid, primary key)
      - `setting_key` (text, unique)
      - `setting_value` (text)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for public access to menu items and restaurant settings
    - Add policies for reservation management
*/

-- Create reservations table
CREATE TABLE IF NOT EXISTS reservations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name text NOT NULL,
  customer_email text NOT NULL,
  customer_phone text NOT NULL,
  reservation_date date NOT NULL,
  reservation_time time NOT NULL,
  party_size integer NOT NULL CHECK (party_size > 0 AND party_size <= 20),
  special_requests text DEFAULT '',
  status text DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'cancelled', 'completed', 'no_show')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create menu_items table
CREATE TABLE IF NOT EXISTS menu_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  price decimal(10,2) NOT NULL CHECK (price >= 0),
  category text NOT NULL CHECK (category IN ('starters', 'mains', 'desserts', 'drinks')),
  is_available boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create restaurant_settings table
CREATE TABLE IF NOT EXISTS restaurant_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  setting_key text UNIQUE NOT NULL,
  setting_value text NOT NULL,
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE restaurant_settings ENABLE ROW LEVEL SECURITY;

-- Create policies for reservations (public can create, read their own)
CREATE POLICY "Anyone can create reservations"
  ON reservations
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Anyone can view reservations"
  ON reservations
  FOR SELECT
  TO anon
  USING (true);

-- Create policies for menu_items (public read access)
CREATE POLICY "Anyone can view available menu items"
  ON menu_items
  FOR SELECT
  TO anon
  USING (is_available = true);

-- Create policies for restaurant_settings (public read access)
CREATE POLICY "Anyone can view restaurant settings"
  ON restaurant_settings
  FOR SELECT
  TO anon
  USING (true);

-- Insert sample menu items
INSERT INTO menu_items (name, description, price, category) VALUES
  -- Starters
  ('Truffle Arancini', 'Crispy risotto balls with black truffle and parmesan', 18.00, 'starters'),
  ('Seared Scallops', 'Pan-seared scallops with cauliflower purée and pancetta', 24.00, 'starters'),
  ('Burrata Caprese', 'Fresh burrata with heirloom tomatoes and basil oil', 16.00, 'starters'),
  ('Tuna Tartare', 'Fresh ahi tuna with avocado, citrus, and sesame', 22.00, 'starters'),
  
  -- Mains
  ('Wagyu Ribeye', 'Grilled wagyu ribeye with roasted vegetables and red wine jus', 65.00, 'mains'),
  ('Pan-Seared Salmon', 'Atlantic salmon with lemon herb risotto and asparagus', 38.00, 'mains'),
  ('Duck Confit', 'Slow-cooked duck leg with cherry gastrique and roasted potatoes', 42.00, 'mains'),
  ('Lobster Thermidor', 'Whole lobster with cognac cream sauce and herb crust', 58.00, 'mains'),
  ('Osso Buco', 'Braised veal shank with saffron risotto and gremolata', 48.00, 'mains'),
  ('Vegetarian Wellington', 'Mushroom and walnut wellington with seasonal vegetables', 32.00, 'mains'),
  
  -- Desserts
  ('Chocolate Soufflé', 'Dark chocolate soufflé with vanilla bean ice cream', 14.00, 'desserts'),
  ('Crème Brûlée', 'Classic vanilla custard with caramelized sugar', 12.00, 'desserts'),
  ('Tiramisu', 'Traditional Italian tiramisu with espresso and mascarpone', 13.00, 'desserts'),
  ('Lemon Tart', 'Tart lemon curd with meringue and berry compote', 11.00, 'desserts'),
  
  -- Drinks
  ('Wine Selection', 'Curated wines from renowned vineyards worldwide', 25.00, 'drinks'),
  ('Craft Cocktails', 'Signature cocktails crafted by our mixologists', 16.00, 'drinks'),
  ('Artisan Coffee', 'Single-origin coffee beans, expertly roasted', 7.00, 'drinks'),
  ('Premium Spirits', 'Fine whiskeys, cognacs, and aged spirits', 26.00, 'drinks');

-- Insert restaurant settings
INSERT INTO restaurant_settings (setting_key, setting_value) VALUES
  ('restaurant_name', 'Savoria'),
  ('phone_number', '(555) 123-4567'),
  ('email', 'info@savoria.com'),
  ('address', '123 Culinary Boulevard, Downtown District, New York, NY 10001'),
  ('opening_hours_mon_thu', '5:00 PM - 10:00 PM'),
  ('opening_hours_fri_sat', '5:00 PM - 11:00 PM'),
  ('opening_hours_sun', '4:00 PM - 9:00 PM'),
  ('max_party_size', '8'),
  ('advance_booking_days', '30');

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_reservations_updated_at
  BEFORE UPDATE ON reservations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_menu_items_updated_at
  BEFORE UPDATE ON menu_items
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_restaurant_settings_updated_at
  BEFORE UPDATE ON restaurant_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();