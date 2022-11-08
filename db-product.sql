
Create table products(
   name TEXT NOT NULL,
   price INT NOT NULL,
   id  SERIAL PRIMARY KEY,
   img           TEXT      NOT NULL,
   qty           INT       NOT NULL
)
-- drop table products