CREATE EXTENSION IF NOT EXISTS pgcrypto;

DO $$
BEGIN
  CREATE TYPE cart_status AS ENUM ('OPEN', 'ORDERED');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  password text NOT NULL,
  created_at timestamp NOT NULL DEFAULT now(),
  updated_at timestamp NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS carts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  created_at timestamp NOT NULL DEFAULT now(),
  updated_at timestamp NOT NULL DEFAULT now(),
  status cart_status NOT NULL DEFAULT 'OPEN'
);

CREATE TABLE IF NOT EXISTS cart_items (
  cart_id uuid NOT NULL REFERENCES carts (id) ON DELETE CASCADE,
  product_id uuid NOT NULL,
  count integer NOT NULL CHECK (count > 0),
  PRIMARY KEY (cart_id, product_id)
);

CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  cart_id uuid NOT NULL REFERENCES carts (id),
  payment jsonb,
  delivery jsonb,
  comments text,
  status text NOT NULL DEFAULT 'NEW',
  total numeric(10, 2) NOT NULL,
  created_at timestamp NOT NULL DEFAULT now()
);

-- Test data
INSERT INTO users (id, name, password)
VALUES (
  '11111111-1111-1111-1111-111111111111',
  'testuser',
  'TEST_PASSWORD'
)
ON CONFLICT (id) DO NOTHING;

INSERT INTO carts (id, user_id, status)
VALUES (
  '22222222-2222-2222-2222-222222222222',
  '11111111-1111-1111-1111-111111111111',
  'OPEN'
)
ON CONFLICT (id) DO NOTHING;

INSERT INTO cart_items (cart_id, product_id, count)
VALUES
  (
    '22222222-2222-2222-2222-222222222222',
    '33333333-3333-3333-3333-333333333333',
    2
  ),
  (
    '22222222-2222-2222-2222-222222222222',
    '44444444-4444-4444-4444-444444444444',
    1
  )
ON CONFLICT (cart_id, product_id) DO NOTHING;

INSERT INTO orders (id, user_id, cart_id, payment, delivery, comments, status, total)
VALUES (
  '55555555-5555-5555-5555-555555555555',
  '11111111-1111-1111-1111-111111111111',
  '22222222-2222-2222-2222-222222222222',
  '{"method": "card", "transactionId": "tx-001"}'::jsonb,
  '{"address": "123 Main St", "firstName": "Test", "lastName": "User"}'::jsonb,
  'Test order',
  'NEW',
  59.99
)
ON CONFLICT (id) DO NOTHING;
