create schema mathplay_sql;
set schema 'mathplay_sql';

create table roles(
	roleid serial primary key,
	roledescription text not null unique
);

insert into roles (roledescription) values('teacher');
insert into roles (roledescription) values('teaching-assistant');
insert into roles (roledescription) values('student');

select * from roles;

create table sections(
	sectionid serial primary key,
	classtitle text not null
)

drop table sections;

insert into sections (classtitle) values('precalculus 1');  -- use 3 times for 3 sections
insert into sections (classtitle) values('precalculus 2'); --use 2 times for 2 sections
insert into sections (classtitle) values('calculus 1'); --use 2 times
insert into sections (classtitle) values('calculus 2'); --use 1 time

select * from sections;

create table users (
	userid serial primary key,
	username text not null unique,
	userpassword text not null,
	firstname text not null,
	lastname text not null,
	email text not null,
	roleid int references roles (roleid), --foreign key
	sectionid int references sections (sectionid) -- foreign key
);

insert into users (username, userpassword, firstname, lastname, email, roleid, sectionid)
values('lauras', 'password', 'Laura', 'Sake', 'lauras@fakeemail.com', 1, 4);

insert into users (username, userpassword, firstname, lastname, email, roleid, sectionid)
values('rachelr', 'password', 'Rachel', 'Rake', 'rachelr@fakeemail.com', 2, 4);

insert into users (username, userpassword, firstname, lastname, email, roleid, sectionid)
values('innar', 'password', 'Inna', 'Rake', 'innar@fakeemail.com', 2, 4);

insert into users  (username, userpassword, firstname, lastname, email, roleid, sectionid)
values('chinam', 'password', 'China', 'Make', 'chinam@fakeemail.com', 3, 6);

insert into users  (username, userpassword, firstname, lastname, email, roleid, sectionid)
values('jazminh', 'password', 'Jazmin', 'Hake', 'jazminh@fakeemail.com', 3, 4);

insert into users (username, userpassword, firstname, lastname, email, roleid, sectionid)
values('jingw', 'password', 'Jing', 'Wake', 'jingw@fakemail.com', 1, 8);

insert into users (username, userpassword, firstname, lastname, email, roleid, sectionid)
values('aflar', 'password', 'Aflia', 'Rakename', 'aflar@fakeu.edu', 1, 6);

insert into users (username, userpassword, firstname, lastname, email, roleid, sectionid)
values('amandaa', 'password', 'Amanda', 'Abetfake', 'amandaa@fakeu,edu', 3, 6);

select * from users;

select * from (users natural join sections);

select userid, firstname, lastname, email, roledescription from (sections natural join users natural join roles) where sectionid=4;
select sectionid, classtitle, userid, firstname, lastname, email, roledescription from (sections natural join users natural join roles) order by sectionid, roleid, lastname;

drop table users;