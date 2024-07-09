create table product(
    product_id int unsigned unique not null primary key auto_increment,
    product_name varchar(100) default "name",
    product_source_link varchar(150) unique not null,
    description text,
    product_image varchar(255),
    created_at datetime default current_timestamp
);

create table parts(
    product_id int unsigned,
    parts_id int unsigned not null primary key auto_increment,
    parts_name varchar(50) not null,
    parts_image varchar(255) not null default "image",
    parts_price int not null,
    foreign key (product_id) references product(product_id),
    unique (product_id,parts_id,parts_name,parts_image)
);

create table default_Parts(
    product_id int unsigned,
    parts_name varchar(100) not null,
    foreign key (product_id) references product(product_id),
    unique (product_id,parts_name)
);
create table segment(
	product_id int unsigned,
    segment_id int unsigned primary key auto_increment,
    segment_name varchar(255) not null,
    foreign key (product_id) references Product(product_id),
    unique (product_id,segment_id,segment_name)
);
create table segment_attribute(
	segment_id int unsigned,
    parts_name varchar(200) not null,
    foreign key (segment_id) references segment(segment_id),
    unique(segment_id,parts_name)
);

create table sub_parts(
    parts_id int unsigned,
    sub_parts_id int unsigned not null primary key auto_increment,
    sub_parts_name varchar(100) not null,
    heading varchar(255) not null,
    foreign key (parts_id) references Parts(parts_id),
    unique(parts_id,sub_parts_id,sub_parts_name,heading)
);

create table material(
    sub_parts_id int unsigned,
    material_name varchar(255) not null,
    display_name varchar(100) not null,
    price int unsigned not null,
    foreign key (sub_parts_id) references sub_parts(sub_parts_id),
    unique(sub_parts_id,material_name,display_name,price)
);

create table attribute(
    sub_parts_id int unsigned,
    attribute_id int unsigned not null primary key auto_increment,
    attribute_type varchar(100) not null,
    display_name varchar(150) not null,
    unique (sub_parts_id,attribute_id,attribute_type,display_name),
    foreign key (sub_parts_id) references sub_parts(sub_parts_id)
);

create table attribute_data(
    attribute_id int unsigned,
    attribute_value varchar(255) not null,
    attribute_price int unsigned not null,
    attribute_name varchar(255) not null,
    unique(attribute_id,attribute_value,attribute_price,attribute_name),
    foreign key (attribute_id) references Attribute(attribute_id)
);

create table user(
user_id int unsigned unique not null primary key auto_increment,
first_name varchar(200) not null,
last_name varchar(100) not null,
email varchar(200) not null,
password text not null,
phone_no varchar(20) not null,
office_name text,
office_address text,
user_type varchar(50) not null,
country varchar(200) not null,
state varchar(200) not null,
gst_number varchar(20)
);

create table user_product_mapping(
user_product_mapping_id int unsigned not null primary key auto_increment,
user_id int unsigned,
product_id int unsigned,
is_authorised boolean,
foreign key (user_id) references user(user_id),
foreign key (product_id) references product(product_id),
unique(user_product_mapping_id,user_id,product_id,is_authorised)
);