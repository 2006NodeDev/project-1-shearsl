create schema lsquaredmath;
set schema 'lsquaredmath';

create table roles(
	roleId serial primary key,
	workRoles text not null unique
);

insert into roles (workroles)
values('dev-mathematician-owner');

insert into roles (workroles)
values('dev-networkadmin');

insert into roles (workroles)
values('dev-webmaster');

insert into roles (workroles)
values('dev-humanresources');

insert into roles (workroles)
values('dev-mathematician');

insert into roles (workroles)
values('dev-writer');

insert into roles (workroles)
values('dev-marketing');

insert into roles (workroles)
values('dev-tester');

insert into roles (workroles)
values ('projectmanager');

insert into roles (workroles)
values ('itsecurity');

insert into roles (workroles)
values('developer');



create table users (
	userId serial primary key,
	userName text not null unique,
	userPassword text not null,
	firstName text not null,
	lastName text not null,
	email text not null,
	roleId int references roles (roleId) --foreign key
);

--alter sequence serial restart with 101 owned by users.userid;  <--- Couldn't get this to work yet.

insert into users (username, userpassword, firstname, lastname, email, roleId)
values('lauras', 'password', 'Laura', 'Sake', 'lauras@fakeemail.com', 1);

insert into users (username, userpassword, firstname, lastname, email, roleId)
values('joboah', 'password', 'Joboa', 'Hake', 'joboah@fakeemail.com', 2);

insert into users (username, userpassword, firstname, lastname, email, roleId)
values('qianh', 'password', 'Qian', 'Hake', 'qianh@fakeemail.com', 10);

insert into users (username, userpassword, firstname, lastname, email, roleId)
values('emmas', 'password', 'Emma', 'Sake', 'emmas@fakeemail.com', 7);

insert into users (username, userpassword, firstname, lastname, email, roleId)
values('rachelr', 'password', 'Rachel', 'Rake', 'rachelr@fakeemail.com', 5);

insert into users (username, userpassword, firstname, lastname, email, roleId)
values('ceciliap', 'password', 'Cecilia', 'Pake', 'ceciliap@fakeemail.com', 5);

insert into users (username, userpassword, firstname, lastname, email, roleId)
values('firdevsy', 'password', 'Firdevs', 'Yake', 'firdevsy@fakeemail.com', 8);

insert into users (username, userpassword, firstname, lastname, email, roleId)
values('taniquea', 'password', 'Tanique', 'Ake', 'taniquea@fakeemail.com', 6);

insert into users (username, userpassword, firstname, lastname, email, roleId)
values('rebap', 'password', 'Reba', 'Pake', 'rebap@fakeemail.com', 3);

insert into users (username, userpassword, firstname, lastname, email, roleId)
values('chrishp', 'password', 'Chrish', 'Pake', 'chrishp@fakeemail.com', 6);

insert into users (username, userpassword, firstname, lastname, email, roleId)
values('tanjav', 'password', 'Tanja', 'Vake', 'tanjav@fakeemail.com', 4);

insert into users (username, userpassword, firstname, lastname, email, roleId)
values('jazminm', 'password', 'Jazmin', 'Nake', 'jazmin@fakeemail.com', 9);

insert into users (username, userpassword, firstname, lastname, email, roleId)
values('taylorh', 'password', 'Taylor', 'Hake', 'taylorh@fakeemail.com', 10);

insert into users (username, userpassword, firstname, lastname, email, roleId)
values('rachelk', 'password', 'Rachel', 'Kake', 'rachelk@fakeemail.com', 4);

insert into users (username, userpassword, firstname, lastname, email, roleId)
values('christinab', 'password', 'Christina', 'Bake', 'christinab@fakeemail.com', 10);

insert into users (username, userpassword, firstname, lastname, email, roleId)
values('chinam', 'password', 'China', 'Make', 'chinam@fakeemail.com', 1);

insert into users (username, userpassword, firstname, lastname, email, roleId)
values('aliay', 'password', 'Alia', 'Yake', 'aliay@fakeemail.com', 10);

insert into users (username, userpassword, firstname, lastname, email, roleId)
values('amanda', 'password', 'Amanda', 'Bake', 'amandab@fakeemail.com', 10);

insert into users (username, userpassword, firstname, lastname, email, roleId)
values('arlettei', 'password', 'Arlette', 'Infake', 'arlettei@fakeemail.com', 10);

insert into users (username, userpassword, firstname, lastname, email, roleId)
values('innar', 'password', 'Inna', 'Rake', 'innar@fakeemail.com', 10);

insert into users (username, userpassword, firstname, lastname, email, roleId)
values('jodis', 'password', 'Jodi', 'Sake', 'jodis@fakeemail.com', 10);

insert into users (username, userpassword, firstname, lastname, email, roleId)
values('laurenp', 'password', 'Lauren', 'Pake', 'laurenp@fakeemail.com', 10);

insert into users (username, userpassword, firstname, lastname, email, roleId)
values('maricruzz', 'password', 'Maricruz', 'Zake', 'maricruzz@fakeemail.com', 10);

create table reimbursementStatus (
  statusId serial primary key,
  status text not null unique
);

drop table reimbursementstatus;
drop table reimbursementtype;
drop table reimbursement;


insert into reimbursementStatus (status) values ('Pending');
insert into reimbursementStatus (status) values ('Approved');
insert into reimbursementStatus (status) values ('Paid');
insert into reimbursementStatus (status) values ('Denied');

create table reimbursementType(
	typeId serial primary key,
	reimburseType text not null unique
);


insert into reimbursementType (reimburseType) values ('Lodging');
insert into reimbursementType (reimburseType) values ('Travel');
insert into reimbursementType (reimburseType) values ('Food');
insert into reimbursementType (reimburseType) values ('Other');

select * from reimbursementType;
select * from reimbursementStatus;

 


create table reimbursement (
	reimbursementId serial primary key,
	userId int references users (userId),  --foreign key
	amount numeric not null,
	dateSubmitted numeric not null,
	dateResolved numeric not null,
	description text not null,
	resolver int references users (userId),  --foreign key
	statusId int references reimbursementStatus (statusId),  --foreign key
	typeId int references reimbursementType (typeId)  --foreign key 
  );
  
 --using the ISO 8601 standard for dates: YYYYMMDD
 --statusId: Pending: 1, Approved 2, Paid 3, Dennied 4
 --typeId: Lodging: 1, Travel: 2, Food: 3, Other: 4
insert into reimbursement (userId, amount, datesubmitted, dateresolved, description, statusId, typeId )
values(7, 123.54, 20200621, 0, 'supplies for Alien Arithmetic swag', 1, 4);

insert into reimbursement  (userId, amount, datesubmitted, dateresolved, description, statusId, typeId )
values(8, 150.50, 20200628, 20200630, 'Holiday Inn 2 nights', 4, 1);

insert into reimbursement  (userId, amount, datesubmitted, dateresolved, description, statusId, typeId )
values(8, 67.34, 20200628, 20200630, 'mileage, used own car', 4, 2);

insert into reimbursement  (userId, amount, datesubmitted, dateresolved, description, statusId, typeId )
values(8, 45, 20200628, 20200630, '3 meals, standard allowance per meal', 4, 3);

insert into reimbursement  (userId, amount, datesubmitted, dateresolved, description, statusId, typeId )
values(9, 150.50, 20200703, 0, 'Holiday Inn 2 nights', 2, 1);

insert into reimbursement  (userId, amount, datesubmitted, dateresolved, description, statusId, typeId )
values(9, 45, 2020703, 0, '3 meals, standard allowance per meal', 2, 3);

select * from reimbursement;

select userid, firstname fname, lastname lname, workroles, roleid from
	 ( select * from users natural join roles where not roleid=10) as Adminteam order by roleid;
	
select * from
	 ( select * from users natural join roles) as Adminteam order by roleid, userid;
	
select * from
	 ( select * from users natural join roles) as team
	 
	
--- update Jodi from role 10 developer to role 8 tester
update users set roleid = 8 where userid = 24;

---update Jodi in general where it is not necessarily known which fields will be updated
--put users Jodi

select * from users natural join roles;

select * from users;

select * from roles;
 
delete from users where username = 'aleckb';

-- Set up a cursor - code found at: https://www.postgresql.org/docs/8.2/sql-fetch.html
begin;
DECLARE usercursor SCROLL CURSOR FOR SELECT * FROM users;
-- Fetch the first 5 rows in the cursor usercursor:
FETCH FORWARD 5 FROM usercursor;
-- Fetch the previous row:
FETCH PRIOR FROM usercursor;
fetch backward 2 from usercursor;
fetch forward 2 from usercursor;
fetch next from usercursor;
close usercursor;
commit;
