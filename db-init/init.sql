-- init.sql
-- 4th Normal Form (4NF) Schema for R-Intelligence

CREATE DATABASE IF NOT EXISTS r_intelligence;
USE r_intelligence;

-- 1. users table
CREATE TABLE IF NOT EXISTS users (
    user_id CHAR(36) PRIMARY KEY,
    region VARCHAR(100),
    location_type ENUM('urban', 'suburban', 'rural'),
    sustainability_score FLOAT DEFAULT 0.0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. material_properties table
CREATE TABLE IF NOT EXISTS material_properties (
    material_id INT AUTO_INCREMENT PRIMARY KEY,
    material_key VARCHAR(100) UNIQUE NOT NULL,
    co2_per_kg FLOAT NOT NULL, -- Environmental impact metric
    recyclability_pct FLOAT NOT NULL, -- 0.0 to 1.0
    repair_feasibility FLOAT NOT NULL -- 0.0 to 1.0
);

-- 3. items table
CREATE TABLE IF NOT EXISTS items (
    item_id INT AUTO_INCREMENT PRIMARY KEY,
    item_name VARCHAR(100) UNIQUE NOT NULL,
    material_id INT,
    FOREIGN KEY (material_id) REFERENCES material_properties(material_id) ON DELETE SET NULL
);

-- 4. decisions table
CREATE TABLE IF NOT EXISTS decisions (
    decision_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id CHAR(36),
    item_id INT,
    item_condition ENUM('new', 'good', 'fair', 'damaged', 'broken', 'end_of_life'),
    recommended_strategy VARCHAR(50), -- Top strategy recommended
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (item_id) REFERENCES items(item_id) ON DELETE CASCADE
);

-- 5. decision_alternatives table
CREATE TABLE IF NOT EXISTS decision_alternatives (
    alternative_id INT AUTO_INCREMENT PRIMARY KEY,
    decision_id INT,
    strategy_name VARCHAR(50) NOT NULL,
    score FLOAT NOT NULL,
    FOREIGN KEY (decision_id) REFERENCES decisions(decision_id) ON DELETE CASCADE
);

-- ==========================================
-- DATA SEEDING
-- ==========================================

-- Seed Mock User
INSERT IGNORE INTO users (user_id, region, location_type, sustainability_score) VALUES
('123e4567-e89b-12d3-a456-426614174000', 'North America', 'urban', 75.5);

-- Seed Material Properties (EPA/World Bank logic approximations)
INSERT IGNORE INTO material_properties (material_key, co2_per_kg, recyclability_pct, repair_feasibility) VALUES
('PET_Plastic', 2.5, 0.45, 0.10),
('HDPE_Plastic', 2.0, 0.60, 0.15),
('Aluminum', 11.5, 0.90, 0.60),
('Glass', 0.9, 0.85, 0.05),
('Electronics_Mixed', 25.0, 0.30, 0.70),
('Cotton_Textile', 4.0, 0.20, 0.85),
('Wood', 0.5, 0.10, 0.90),
('Steel', 1.8, 0.88, 0.75);

-- Seed Items mapped to materials
INSERT IGNORE INTO items (item_name, material_id) VALUES
('Smartphone', (SELECT material_id FROM material_properties WHERE material_key = 'Electronics_Mixed')),
('Laptop', (SELECT material_id FROM material_properties WHERE material_key = 'Electronics_Mixed')),
('Plastic Water Bottle', (SELECT material_id FROM material_properties WHERE material_key = 'PET_Plastic')),
('Aluminum Can', (SELECT material_id FROM material_properties WHERE material_key = 'Aluminum')),
('Glass Jar', (SELECT material_id FROM material_properties WHERE material_key = 'Glass')),
('Cotton T-Shirt', (SELECT material_id FROM material_properties WHERE material_key = 'Cotton_Textile')),
('Wooden Chair', (SELECT material_id FROM material_properties WHERE material_key = 'Wood')),
('Steel Cutlery', (SELECT material_id FROM material_properties WHERE material_key = 'Steel'));

-- Seed some historical decisions for behavioral intelligence (e.g., > 10 plastic disposals)
-- Assuming 'Recycle' or 'Recover' for plastics counts as disposal
INSERT IGNORE INTO decisions (user_id, item_id, item_condition, recommended_strategy, created_at) VALUES
('123e4567-e89b-12d3-a456-426614174000', (SELECT item_id FROM items WHERE item_name = 'Plastic Water Bottle'), 'end_of_life', 'Recycle', DATE_SUB(NOW(), INTERVAL 2 DAY)),
('123e4567-e89b-12d3-a456-426614174000', (SELECT item_id FROM items WHERE item_name = 'Plastic Water Bottle'), 'end_of_life', 'Recycle', DATE_SUB(NOW(), INTERVAL 3 DAY)),
('123e4567-e89b-12d3-a456-426614174000', (SELECT item_id FROM items WHERE item_name = 'Plastic Water Bottle'), 'end_of_life', 'Recycle', DATE_SUB(NOW(), INTERVAL 4 DAY)),
('123e4567-e89b-12d3-a456-426614174000', (SELECT item_id FROM items WHERE item_name = 'Plastic Water Bottle'), 'end_of_life', 'Recycle', DATE_SUB(NOW(), INTERVAL 5 DAY)),
('123e4567-e89b-12d3-a456-426614174000', (SELECT item_id FROM items WHERE item_name = 'Plastic Water Bottle'), 'end_of_life', 'Recycle', DATE_SUB(NOW(), INTERVAL 6 DAY)),
('123e4567-e89b-12d3-a456-426614174000', (SELECT item_id FROM items WHERE item_name = 'Plastic Water Bottle'), 'end_of_life', 'Recycle', DATE_SUB(NOW(), INTERVAL 7 DAY)),
('123e4567-e89b-12d3-a456-426614174000', (SELECT item_id FROM items WHERE item_name = 'Plastic Water Bottle'), 'end_of_life', 'Recycle', DATE_SUB(NOW(), INTERVAL 8 DAY)),
('123e4567-e89b-12d3-a456-426614174000', (SELECT item_id FROM items WHERE item_name = 'Plastic Water Bottle'), 'end_of_life', 'Recycle', DATE_SUB(NOW(), INTERVAL 9 DAY)),
('123e4567-e89b-12d3-a456-426614174000', (SELECT item_id FROM items WHERE item_name = 'Plastic Water Bottle'), 'end_of_life', 'Recycle', DATE_SUB(NOW(), INTERVAL 10 DAY)),
('123e4567-e89b-12d3-a456-426614174000', (SELECT item_id FROM items WHERE item_name = 'Plastic Water Bottle'), 'end_of_life', 'Recycle', DATE_SUB(NOW(), INTERVAL 11 DAY)),
('123e4567-e89b-12d3-a456-426614174000', (SELECT item_id FROM items WHERE item_name = 'Plastic Water Bottle'), 'end_of_life', 'Recycle', DATE_SUB(NOW(), INTERVAL 12 DAY));
