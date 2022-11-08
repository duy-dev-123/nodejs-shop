
Create table orders(
   id_order  SERIAL PRIMARY KEY,
   id_user INT NOT NULL,
   id_product INT NOT NULL,
   qty INT NOT NULL,
   price INT NOT NULL,
   name_product           TEXT      NOT NULL,
   img            TEXT       NOT NULL
)
-- drop table order