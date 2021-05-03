CREATE TABLE products (
	id uuid PRIMARY key default uuid_generate_v4(),
	title TEXT NOT NULL,
	description text,
    price integer
);

insert into products (title, description, price) values
('The Voice of Frank Sinatra', 'Frank Sinatra - The Voice of Frank Sinatra', 60),
('Songs by Sinatra', 'Frank Sinatra - Songs by Sinatra', 55),
('Christmas Songs by Sinatra', 'Frank Sinatra - Christmas Songs by Sinatra', 80),
('Frankly Sentimental', 'Frank Sinatra - Frankly Sentimental', 50),
('Dedicated to You', 'Frank Sinatra - Dedicated to You', 60),
('Ella Sings Gershwin', 'Ella Fitzgerald - Ella Sings Gershwin', 50),
('Songs in a Mellow Mood', 'Ella Fitzgerald - Songs in a Mellow Mood', 45),
('Lullabies of Birdland', 'Ella Fitzgerald - Lullabies of Birdland', 45),
('For Sentimental Reasons', 'Ella Fitzgerald - For Sentimental Reasons', 45),
('Sweet and Hot', 'Ella Fitzgerald - Sweet and Hot', 50)


create table stocks (
  id uuid PRIMARY key default uuid_generate_v4(),
  product_id uuid,
  count integer,
  foreign key ("product_id") references "products" ("id")
);


--TODO: product-id are hard-coded, need to link with generated products data dynamically
insert into stocks (product_id , count) values
('13638241-106c-482e-a8e2-d5f784d87319', 100),
('18ad2483-1b8f-425b-9692-24fb856137b4', 95),
('2ac6640e-8671-42dd-b2a8-3623cea4d46d', 300)

create extension if not exists "uuid-ossp";