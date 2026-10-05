-- ============================================
-- SERVICE REQUEST DASHBOARD
-- PostgreSQL Database Schema
-- ============================================

-- ============================================
-- CATEGORIES
-- ============================================

CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- ============================================
-- USERS
-- ============================================

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'employee',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- ============================================
-- REQUESTS
-- ============================================

CREATE TABLE IF NOT EXISTS requests (
    id SERIAL PRIMARY KEY,

    title VARCHAR(200) NOT NULL,

    description TEXT NOT NULL,

    category_id INTEGER NOT NULL,

    created_by INTEGER NOT NULL,

    assigned_to INTEGER,

    priority VARCHAR(20) NOT NULL DEFAULT 'medium',

    status VARCHAR(30) NOT NULL DEFAULT 'pending',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,


    CONSTRAINT fk_request_category
        FOREIGN KEY (category_id)
        REFERENCES categories(id),

    CONSTRAINT fk_request_creator
        FOREIGN KEY (created_by)
        REFERENCES users(id),

    CONSTRAINT fk_request_assignee
        FOREIGN KEY (assigned_to)
        REFERENCES users(id),


    CONSTRAINT check_request_priority
        CHECK (
            priority IN (
                'low',
                'medium',
                'high',
                'urgent'
            )
        ),

    CONSTRAINT check_request_status
        CHECK (
            status IN (
                'pending',
                'assigned',
                'in_progress',
                'resolved',
                'closed'
            )
        )
);


-- ============================================
-- REQUEST STATUS HISTORY
-- ============================================

CREATE TABLE IF NOT EXISTS request_status_history (
    id SERIAL PRIMARY KEY,

    request_id INTEGER NOT NULL,

    old_status VARCHAR(30),

    new_status VARCHAR(30) NOT NULL,

    changed_by INTEGER NOT NULL,

    changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,


    CONSTRAINT fk_history_request
        FOREIGN KEY (request_id)
        REFERENCES requests(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_history_user
        FOREIGN KEY (changed_by)
        REFERENCES users(id)
);


-- ============================================
-- UPDATED_AT TRIGGER
-- ============================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;


DROP TRIGGER IF EXISTS trg_requests_updated_at
ON requests;


CREATE TRIGGER trg_requests_updated_at

BEFORE UPDATE ON requests

FOR EACH ROW

EXECUTE FUNCTION update_updated_at_column();


-- ============================================
-- INDEXES
-- ============================================

CREATE INDEX IF NOT EXISTS idx_users_role
ON users(role);

CREATE INDEX IF NOT EXISTS idx_users_email
ON users(email);

CREATE INDEX IF NOT EXISTS idx_requests_created_by
ON requests(created_by);

CREATE INDEX IF NOT EXISTS idx_requests_assigned_to
ON requests(assigned_to);

CREATE INDEX IF NOT EXISTS idx_requests_category_id
ON requests(category_id);

CREATE INDEX IF NOT EXISTS idx_requests_status
ON requests(status);

CREATE INDEX IF NOT EXISTS idx_requests_priority
ON requests(priority);

CREATE INDEX IF NOT EXISTS idx_requests_created_at
ON requests(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_history_request_id
ON request_status_history(request_id);

CREATE INDEX IF NOT EXISTS idx_history_changed_by
ON request_status_history(changed_by);

CREATE INDEX IF NOT EXISTS idx_history_changed_at
ON request_status_history(changed_at DESC);


-- ============================================
-- SEED CATEGORIES
-- ============================================

INSERT INTO categories (name)
VALUES
    ('Laptop Problem'),
    ('Internet Issue'),
    ('Air Conditioner'),
    ('Office Chair'),
    ('Electrical Issue')
ON CONFLICT (name) DO NOTHING;