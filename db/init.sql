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
  user_id uuid NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  created_at timestamp NOT NULL DEFAULT now(),
  updated_at timestamp NOT NULL DEFAULT now(),
  status cart_status NOT NULL DEFAULT 'OPEN'
);

CREATE TABLE IF NOT EXISTS cart_items (
  cart_id uuid NOT NULL REFERENCES carts (id) ON DELETE CASCADE,
  product_id uuid NOT NULL,
  count integer NOT NULL CHECK (count > 0),
  product jsonb NOT NULL DEFAULT '{}'::jsonb,
  PRIMARY KEY (cart_id, product_id)
);

CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  cart_id uuid NOT NULL REFERENCES carts (id),
  payment jsonb,
  delivery jsonb,
  comments text,
  status text NOT NULL DEFAULT 'NEW',
  total numeric(10, 2) NOT NULL,
  created_at timestamp NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS carts_user_id_idx ON carts (user_id);
CREATE INDEX IF NOT EXISTS orders_user_id_idx ON orders (user_id);

-- Test data (each user owns their carts and orders)
INSERT INTO users (id, name, password)
VALUES
  (
    '11111111-1111-1111-1111-111111111111',
    'testuser',
    'TEST_PASSWORD'
  ),
  (
    '77777777-7777-7777-7777-777777777777',
    'otheruser',
    'TEST_PASSWORD'
  )
ON CONFLICT (id) DO NOTHING;

-- testuser: cart used for a completed order
INSERT INTO carts (id, user_id, status)
VALUES (
  '22222222-2222-2222-2222-222222222222',
  '11111111-1111-1111-1111-111111111111',
  'ORDERED'
)
ON CONFLICT (id) DO NOTHING;

-- testuser: current open cart
INSERT INTO carts (id, user_id, status)
VALUES (
  '66666666-6666-6666-6666-666666666666',
  '11111111-1111-1111-1111-111111111111',
  'OPEN'
)
ON CONFLICT (id) DO NOTHING;

-- otheruser: own open cart
INSERT INTO carts (id, user_id, status)
VALUES (
  '88888888-8888-8888-8888-888888888888',
  '77777777-7777-7777-7777-777777777777',
  'OPEN'
)
ON CONFLICT (id) DO NOTHING;

INSERT INTO cart_items (cart_id, product_id, count, product)
VALUES
  (
    '66666666-6666-6666-6666-666666666666',
    '33333333-3333-3333-3333-333333333333',
    2,
    '{"id":"33333333-3333-3333-3333-333333333333","title":"Product A","description":"Test product A","price":10}'::jsonb
  ),
  (
    '66666666-6666-6666-6666-666666666666',
    '44444444-4444-4444-4444-444444444444',
    1,
    '{"id":"44444444-4444-4444-4444-444444444444","title":"Product B","description":"Test product B","price":20}'::jsonb
  ),
  (
    '88888888-8888-8888-8888-888888888888',
    '33333333-3333-3333-3333-333333333333',
    1,
    '{"id":"33333333-3333-3333-3333-333333333333","title":"Product A","description":"Test product A","price":10}'::jsonb
  )
ON CONFLICT (cart_id, product_id) DO NOTHING;

INSERT INTO orders (id, user_id, cart_id, payment, delivery, comments, status, total)
VALUES (
  '55555555-5555-5555-5555-555555555555',
  '11111111-1111-1111-1111-111111111111',
  '22222222-2222-2222-2222-222222222222',
  '{"items":[{"productId":"33333333-3333-3333-3333-333333333333","count":2},{"productId":"44444444-4444-4444-4444-444444444444","count":1}]}'::jsonb,
  '{"address":"123 Main St","firstName":"Test","lastName":"User","comment":"Test order"}'::jsonb,
  'Test order',
  'OPEN',
  40.00
)
ON CONFLICT (id) DO NOTHING;
