set character_set_client=utf8;
set character_set_connection=utf8;
set character_set_database=utf8;
set character_set_results=utf8;
set character_set_server=utf8;
set time_zone='+8:00';

CREATE USER $username@'localhost' IDENTIFIED BY '$password';

CREATE DATABASE videodb DEFAULT CHARSET=utf8;
GRANT all privileges on videodb.* 
TO $username@'localhost';

use videodb;

CREATE TABLE storage
(
	id INT PRIMARY KEY auto_increment,
	name VARCHAR(64) NOT NULL,
	note VARCHAR(256)
);

CREATE TABLE resolution
(
	id INT PRIMARY KEY auto_increment,
	name VARCHAR(64) NOT NULL,
	note VARCHAR(256)
);

CREATE TABLE encodegroup
(
	id INT PRIMARY KEY auto_increment,
	name VARCHAR(64) NOT NULL,
	note VARCHAR(256)
);

CREATE TABLE movie
(
	id INT PRIMARY KEY auto_increment,
	chinese VARCHAR(256) NOT NULL,
	english VARCHAR(256) NOT NULL,
	addtime TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	resolution INT NOT NULL,
	encodegroup INT NOT NULL,
	storage INT NOT NULL,
	
	FOREIGN KEY(resolution) references resolution(id),
	FOREIGN KEY(encodegroup) references encodegroup(id),
	FOREIGN KEY(storage) references storage(id)
);

CREATE TABLE tvseries
(
	id INT PRIMARY KEY auto_increment,
	chinese VARCHAR(256) NOT NULL,
	english VARCHAR(256) NOT NULL,
	season VARCHAR(64) NOT NULL,
	addtime TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	resolution INT NOT NULL,
	encodegroup INT NOT NULL,
	storage INT NOT NULL,
	FOREIGN KEY(resolution) references resolution(id),
	FOREIGN KEY(encodegroup) references encodegroup(id),
	FOREIGN KEY(storage) references storage(id)
);

CREATE TABLE collection
(
	id INT PRIMARY KEY auto_increment,
	chinese VARCHAR(256) NOT NULL,
	english VARCHAR(256) NOT NULL,
	count INT NOT NULL,
	addtime TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	resolution INT NOT NULL,
	encodegroup INT NOT NULL,
	storage INT NOT NULL,
	FOREIGN KEY(resolution) references resolution(id),
	FOREIGN KEY(encodegroup) references encodegroup(id),
	FOREIGN KEY(storage) references storage(id)
);