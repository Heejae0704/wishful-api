CREATE TYPE source_type AS ENUM (
    'prediction',
    'revelation',
    'comment'
);

ALTER TABLE wishful_likes
    ADD COLUMN
        source_type source_type;