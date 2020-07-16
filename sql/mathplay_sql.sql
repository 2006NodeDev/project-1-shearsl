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

create table classsection(
	classid serial primary key,
	classtitle text not null
)

insert into classsection (classtitle) values('precalculus 1');
insert into classsection (classtitle) values('precalculus 2');
insert into classsection (classtitle) values('calculus 1');
insert into classsection (classtitle) values('calculus 2');

select * from classsection;

create table users (
	userid serial primary key,
	username text not null unique,
	userpassword text not null,
	firstname text not null,
	lastname text not null,
	email text not null,
	roleid int references roles (roleid), --foreign key
	classid int references classsection (classid) -- foreign key
);

insert into users (username, userpassword, firstname, lastname, email, roleid, classid)
values('lauras', 'password', 'Laura', 'Sake', 'lauras@fakeemail.com', 1, 4);

insert into users (username, userpassword, firstname, lastname, email, roleid, classid)
values('rachelr', 'password', 'Rachel', 'Rake', 'rachelr@fakeemail.com', 2, 4);

insert into users (username, userpassword, firstname, lastname, email, roleid, classid)
values('innar', 'password', 'Inna', 'Rake', 'innar@fakeemail.com', 2, 4);

select * from users;

drop table users;