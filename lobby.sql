-- public.users definition

-- Drop table

-- DROP TABLE public.users;

CREATE TABLE public.users (
	id uuid NOT NULL,
	email varchar NOT NULL,
	username varchar NOT NULL,
	"password" varchar NOT NULL,
	firstname varchar NOT NULL,
	lastname varchar NOT NULL,
	createdat timestamp NULL DEFAULT CURRENT_TIMESTAMP,
	bio varchar NULL,
	dob date NULL,
	avater varchar NULL,
	CONSTRAINT email_un UNIQUE (email),
	CONSTRAINT users_pk PRIMARY KEY (id),
	CONSTRAINT users_un UNIQUE (username)
);

-- public.community definition

-- Drop table

-- DROP TABLE public.community;

CREATE TABLE public.community (
	id uuid NOT NULL,
	"name" varchar NOT NULL,
	description varchar NULL,
	avatar varchar NULL,
	creator varchar NOT NULL,
	"admin" _varchar NULL,
	members _varchar NULL,
	createdat timestamp NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT community_pk PRIMARY KEY (id)
);

-- public.rooms definition

-- Drop table

-- DROP TABLE public.rooms;

CREATE TABLE public.rooms (
	id uuid NOT NULL,
	"name" varchar NOT NULL,
	creator varchar NOT NULL,
	communityid uuid NOT NULL,
	enablemessage bool NOT NULL DEFAULT true,
	createdat timestamp NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT rooms_pk PRIMARY KEY (id)
);

-- public.message definition

-- Drop table

-- DROP TABLE public.message;

CREATE TABLE public.message (
	id uuid NOT NULL,
	creator varchar NOT NULL,
	message varchar NOT NULL,
	communityid uuid NOT NULL,
	roomid uuid NOT NULL,
	createdat timestamp NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT message_pk PRIMARY KEY (id)
);