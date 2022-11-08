
Create table users(
   id  SERIAL PRIMARY KEY,
   username           TEXT      NOT NULL,
   password           TEXT       NOT NULL,
   roles TEXT NOT NULL
)

-- drop table users