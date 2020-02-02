CREATE TYPE rating_category AS ENUM (
    '1',
    '2',
    '3',
    '4',
    '5'
);

ALTER TABLE bookmarks
    ADD COLUMN
        rating rating_category;