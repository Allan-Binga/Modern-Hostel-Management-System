--
-- PostgreSQL database dump
--

-- Dumped from database version 17.5 (Ubuntu 17.5-1.pgdg24.04+1)
-- Dumped by pg_dump version 17.5 (Ubuntu 17.5-1.pgdg24.04+1)

-- Started on 2025-05-27 09:03:54 AST

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 220 (class 1259 OID 65655)
-- Name: admins; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.admins (
    id integer NOT NULL,
    email character varying(255) NOT NULL,
    phonenumber character varying(20) NOT NULL,
    password character varying(255) NOT NULL
);


ALTER TABLE public.admins OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 65654)
-- Name: admins_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.admins_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.admins_id_seq OWNER TO postgres;

--
-- TOC entry 3555 (class 0 OID 0)
-- Dependencies: 219
-- Name: admins_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.admins_id_seq OWNED BY public.admins.id;


--
-- TOC entry 231 (class 1259 OID 73868)
-- Name: advertisements; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.advertisements (
    ad_id integer NOT NULL,
    tenant_id integer,
    ad_title character varying(255) NOT NULL,
    ad_description text NOT NULL,
    product_category character varying(100) NOT NULL,
    contact_details character varying(255) NOT NULL,
    duration_days integer NOT NULL,
    submission_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    approval_status character varying(20)
);


ALTER TABLE public.advertisements OWNER TO postgres;

--
-- TOC entry 230 (class 1259 OID 73867)
-- Name: advertisements_ad_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.advertisements_ad_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.advertisements_ad_id_seq OWNER TO postgres;

--
-- TOC entry 3556 (class 0 OID 0)
-- Dependencies: 230
-- Name: advertisements_ad_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.advertisements_ad_id_seq OWNED BY public.advertisements.ad_id;


--
-- TOC entry 225 (class 1259 OID 73817)
-- Name: bookings; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.bookings (
    booking_id integer NOT NULL,
    tenant_id integer,
    room_id integer,
    booking_date date,
    payment_status character varying(20),
    check_in_date date,
    check_out_date date,
    CONSTRAINT bookings_payment_status_check CHECK (((payment_status)::text = ANY ((ARRAY['Paid'::character varying, 'Unpaid'::character varying])::text[])))
);


ALTER TABLE public.bookings OWNER TO postgres;

--
-- TOC entry 224 (class 1259 OID 73816)
-- Name: bookings_booking_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.bookings_booking_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.bookings_booking_id_seq OWNER TO postgres;

--
-- TOC entry 3557 (class 0 OID 0)
-- Dependencies: 224
-- Name: bookings_booking_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.bookings_booking_id_seq OWNED BY public.bookings.booking_id;


--
-- TOC entry 227 (class 1259 OID 73847)
-- Name: issues; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.issues (
    issue_id integer NOT NULL,
    tenant_id integer,
    issue_description text,
    priority character varying(20),
    reported_date timestamp without time zone,
    resolved_date timestamp without time zone,
    status character varying(20),
    category character varying(50)
);


ALTER TABLE public.issues OWNER TO postgres;

--
-- TOC entry 226 (class 1259 OID 73846)
-- Name: issues_issue_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.issues_issue_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.issues_issue_id_seq OWNER TO postgres;

--
-- TOC entry 3558 (class 0 OID 0)
-- Dependencies: 226
-- Name: issues_issue_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.issues_issue_id_seq OWNED BY public.issues.issue_id;


--
-- TOC entry 233 (class 1259 OID 73883)
-- Name: notifications; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.notifications (
    notification_id integer NOT NULL,
    tenant_id integer NOT NULL,
    message text NOT NULL,
    notification_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    status text DEFAULT 'unread'::text
);


ALTER TABLE public.notifications OWNER TO postgres;

--
-- TOC entry 232 (class 1259 OID 73882)
-- Name: notifications_notification_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.notifications_notification_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.notifications_notification_id_seq OWNER TO postgres;

--
-- TOC entry 3559 (class 0 OID 0)
-- Dependencies: 232
-- Name: notifications_notification_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.notifications_notification_id_seq OWNED BY public.notifications.notification_id;


--
-- TOC entry 235 (class 1259 OID 73902)
-- Name: payments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.payments (
    payment_id integer NOT NULL,
    tenant_id integer,
    amount numeric(10,2),
    payment_date timestamp without time zone,
    mpesa_number character varying(20),
    transaction_id character varying(50),
    payment_status character varying(20),
    payment_method text
);


ALTER TABLE public.payments OWNER TO postgres;

--
-- TOC entry 234 (class 1259 OID 73901)
-- Name: payments_payment_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.payments_payment_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.payments_payment_id_seq OWNER TO postgres;

--
-- TOC entry 3560 (class 0 OID 0)
-- Dependencies: 234
-- Name: payments_payment_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.payments_payment_id_seq OWNED BY public.payments.payment_id;


--
-- TOC entry 221 (class 1259 OID 65667)
-- Name: rooms; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.rooms (
    roomid integer NOT NULL,
    roomtype character varying(50),
    status character varying(20),
    price numeric(10,2),
    beds integer,
    image text
);


ALTER TABLE public.rooms OWNER TO postgres;

--
-- TOC entry 229 (class 1259 OID 73861)
-- Name: technicians; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.technicians (
    technician_id integer NOT NULL,
    name character varying(100) NOT NULL,
    phone_number character varying(15) NOT NULL,
    specialty character varying(50) NOT NULL,
    assignment_status text DEFAULT 'Unassigned'::text
);


ALTER TABLE public.technicians OWNER TO postgres;

--
-- TOC entry 228 (class 1259 OID 73860)
-- Name: technicians_technician_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.technicians_technician_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.technicians_technician_id_seq OWNER TO postgres;

--
-- TOC entry 3561 (class 0 OID 0)
-- Dependencies: 228
-- Name: technicians_technician_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.technicians_technician_id_seq OWNED BY public.technicians.technician_id;


--
-- TOC entry 218 (class 1259 OID 65640)
-- Name: tenants; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tenants (
    id integer NOT NULL,
    firstname character varying(255) NOT NULL,
    lastname character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    phonenumber character varying(20) NOT NULL,
    password character varying(255) NOT NULL,
    verificationtoken character varying(64),
    verificationtokenexpiry timestamp without time zone,
    isverified boolean DEFAULT false,
    "Date Joined" timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    passwordresettoken text,
    passwordresettokenexpiry timestamp without time zone
);


ALTER TABLE public.tenants OWNER TO postgres;

--
-- TOC entry 217 (class 1259 OID 65639)
-- Name: tenants_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.tenants_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.tenants_id_seq OWNER TO postgres;

--
-- TOC entry 3562 (class 0 OID 0)
-- Dependencies: 217
-- Name: tenants_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.tenants_id_seq OWNED BY public.tenants.id;


--
-- TOC entry 223 (class 1259 OID 73804)
-- Name: visitors; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.visitors (
    visitorid integer NOT NULL,
    name character varying(255) NOT NULL,
    phonenumber character varying(20) NOT NULL,
    entrytime timestamp without time zone NOT NULL,
    exittime timestamp without time zone,
    visitedroomid integer NOT NULL,
    is_active boolean DEFAULT true,
    plannedexittime timestamp without time zone
);


ALTER TABLE public.visitors OWNER TO postgres;

--
-- TOC entry 222 (class 1259 OID 73803)
-- Name: visitors_visitorid_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.visitors_visitorid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.visitors_visitorid_seq OWNER TO postgres;

--
-- TOC entry 3563 (class 0 OID 0)
-- Dependencies: 222
-- Name: visitors_visitorid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.visitors_visitorid_seq OWNED BY public.visitors.visitorid;


--
-- TOC entry 3337 (class 2604 OID 65658)
-- Name: admins id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.admins ALTER COLUMN id SET DEFAULT nextval('public.admins_id_seq'::regclass);


--
-- TOC entry 3344 (class 2604 OID 73871)
-- Name: advertisements ad_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.advertisements ALTER COLUMN ad_id SET DEFAULT nextval('public.advertisements_ad_id_seq'::regclass);


--
-- TOC entry 3340 (class 2604 OID 73820)
-- Name: bookings booking_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings ALTER COLUMN booking_id SET DEFAULT nextval('public.bookings_booking_id_seq'::regclass);


--
-- TOC entry 3341 (class 2604 OID 73850)
-- Name: issues issue_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.issues ALTER COLUMN issue_id SET DEFAULT nextval('public.issues_issue_id_seq'::regclass);


--
-- TOC entry 3346 (class 2604 OID 73886)
-- Name: notifications notification_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notifications ALTER COLUMN notification_id SET DEFAULT nextval('public.notifications_notification_id_seq'::regclass);


--
-- TOC entry 3349 (class 2604 OID 73905)
-- Name: payments payment_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments ALTER COLUMN payment_id SET DEFAULT nextval('public.payments_payment_id_seq'::regclass);


--
-- TOC entry 3342 (class 2604 OID 73864)
-- Name: technicians technician_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.technicians ALTER COLUMN technician_id SET DEFAULT nextval('public.technicians_technician_id_seq'::regclass);


--
-- TOC entry 3334 (class 2604 OID 65643)
-- Name: tenants id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tenants ALTER COLUMN id SET DEFAULT nextval('public.tenants_id_seq'::regclass);


--
-- TOC entry 3338 (class 2604 OID 73807)
-- Name: visitors visitorid; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.visitors ALTER COLUMN visitorid SET DEFAULT nextval('public.visitors_visitorid_seq'::regclass);


--
-- TOC entry 3534 (class 0 OID 65655)
-- Dependencies: 220
-- Data for Name: admins; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.admins (id, email, phonenumber, password) FROM stdin;
2	allanbinga73@gmail.com	0712519615	$2b$10$3e.lqTKQ5i/JJlzsHEhleudrURrRicsHhmsscVa55yG25oVRgSnKO
\.


--
-- TOC entry 3545 (class 0 OID 73868)
-- Dependencies: 231
-- Data for Name: advertisements; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.advertisements (ad_id, tenant_id, ad_title, ad_description, product_category, contact_details, duration_days, submission_date, approval_status) FROM stdin;
\.


--
-- TOC entry 3539 (class 0 OID 73817)
-- Dependencies: 225
-- Data for Name: bookings; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.bookings (booking_id, tenant_id, room_id, booking_date, payment_status, check_in_date, check_out_date) FROM stdin;
\.


--
-- TOC entry 3541 (class 0 OID 73847)
-- Dependencies: 227
-- Data for Name: issues; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.issues (issue_id, tenant_id, issue_description, priority, reported_date, resolved_date, status, category) FROM stdin;
\.


--
-- TOC entry 3547 (class 0 OID 73883)
-- Dependencies: 233
-- Data for Name: notifications; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.notifications (notification_id, tenant_id, message, notification_date, status) FROM stdin;
\.


--
-- TOC entry 3549 (class 0 OID 73902)
-- Dependencies: 235
-- Data for Name: payments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.payments (payment_id, tenant_id, amount, payment_date, mpesa_number, transaction_id, payment_status, payment_method) FROM stdin;
\.


--
-- TOC entry 3535 (class 0 OID 65667)
-- Dependencies: 221
-- Data for Name: rooms; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.rooms (roomid, roomtype, status, price, beds, image) FROM stdin;
4	Shared	Available	6500.00	2	https://cdn.pixabay.com/photo/2024/07/15/11/55/living-room-8896570_640.jpg
9	Shared	Occupied	6000.00	2	https://cdn.pixabay.com/photo/2023/09/25/15/06/living-room-8275327_640.jpg
3	Shared	Available	7000.00	2	https://cdn.pixabay.com/photo/2021/09/13/06/26/apartment-6620408_640.jpg
6	Shared	Available	7500.00	2	https://cdn.pixabay.com/photo/2023/12/11/06/21/living-room-8442887_640.jpg
19	Single	Available	12500.00	1	https://cdn.pixabay.com/photo/2021/02/11/23/21/house-6006723_640.jpg
5	Shared	Available	6000.00	2	https://cdn.pixabay.com/photo/2023/11/06/02/21/kitchen-8368678_640.jpg
7	Shared	Available	7000.00	2	https://cdn.pixabay.com/photo/2024/08/31/11/18/living-room-9011266_640.jpg
8	Shared	Available	6500.00	2	https://cdn.pixabay.com/photo/2018/03/20/17/35/furniture-3243991_640.jpg
10	Shared	Available	7000.00	2	https://cdn.pixabay.com/photo/2015/09/08/22/03/luggage-930804_640.jpg
11	Single	Available	10000.00	1	https://cdn.pixabay.com/photo/2017/02/24/12/19/apartment-2094659_640.jpg
12	Single	Available	9500.00	1	https://cdn.pixabay.com/photo/2014/08/11/21/26/kitchen-416027_640.jpg
13	Single	Available	11000.00	1	https://cdn.pixabay.com/photo/2014/08/11/21/31/wall-panel-416041_640.jpg
14	Single	Available	12000.00	1	https://cdn.pixabay.com/photo/2023/11/06/02/18/living-room-8368640_640.jpg
15	Single	Available	10500.00	1	https://cdn.pixabay.com/photo/2023/11/06/02/20/kitchen-8368660_640.jpg
16	Single	Available	13000.00	1	https://cdn.pixabay.com/photo/2023/09/18/12/01/living-room-8260397_640.jpg
17	Single	Available	11500.00	1	https://cdn.pixabay.com/photo/2023/09/25/15/06/bedroom-8275328_640.jpg
18	Single	Available	10000.00	1	https://cdn.pixabay.com/photo/2023/12/11/06/20/living-room-8442806_640.jpg
20	Single	Available	11000.00	1	https://cdn.pixabay.com/photo/2013/06/30/19/07/bed-142516_640.jpg
1	Shared	Available	6000.00	2	https://cdn.pixabay.com/photo/2023/12/11/06/21/living-room-8442895_640.jpg
2	Shared	Available	5000.00	2	https://cdn.pixabay.com/photo/2013/06/30/19/07/bed-142517_640.jpg
\.


--
-- TOC entry 3543 (class 0 OID 73861)
-- Dependencies: 229
-- Data for Name: technicians; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.technicians (technician_id, name, phone_number, specialty, assignment_status) FROM stdin;
32	Leo Adams	0724345678	Pest Control	\N
33	Mona Carter	0735345678	Cleaning	\N
34	Nathan Hughes	0746345678	Security	\N
35	Olivia Ward	0757345678	Plumbing	\N
36	Paul Baker	0768345678	Electrical	\N
37	Quincy Perez	0779345678	Carpentry	\N
39	Steve Rogers	0792345678	Pest Control	\N
40	Tina Foster	0703345678	Cleaning	\N
41	Umar Davis	0714345678	Security	\N
42	Vera Martin	0725345678	Plumbing	\N
43	Will Howard	0736345678	Electrical	\N
44	Xena Parker	0747345678	Carpentry	\N
46	Zane Fisher	0769345678	Pest Control	\N
47	Amber Ross	0770345678	Cleaning	\N
48	Brian Watson	0781345678	Security	\N
49	Chloe King	0792345678	Plumbing	\N
50	Derek Young	0704345678	Electrical	\N
21	Alice Johnson	0712345678	Plumbing	Unassigned
22	Bob Smith	0722345678	Electrical	Unassigned
23	Cathy Brown	0732345678	Carpentry	Unassigned
25	Eve Black	0752345678	Pest Control	Unassigned
26	Frank Green	0762345678	Cleaning	Unassigned
27	Grace Lee	0772345678	Security	Unassigned
28	Henry Clark	0782345678	Plumbing	Unassigned
29	Ivy Turner	0792345678	Electrical	Unassigned
30	Jack Wright	0701345678	Carpentry	Unassigned
31	Karen Scott	0713345678	Internet	Unassigned
38	Rachel Bell	0781345678	Internet	Unassigned
45	Yara Cooper	0758345678	Internet	Unassigned
24	Daniel White	0742345678	Internet	Assigned
\.


--
-- TOC entry 3532 (class 0 OID 65640)
-- Dependencies: 218
-- Data for Name: tenants; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tenants (id, firstname, lastname, email, phonenumber, password, verificationtoken, verificationtokenexpiry, isverified, "Date Joined", passwordresettoken, passwordresettokenexpiry) FROM stdin;
\.


--
-- TOC entry 3537 (class 0 OID 73804)
-- Dependencies: 223
-- Data for Name: visitors; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.visitors (visitorid, name, phonenumber, entrytime, exittime, visitedroomid, is_active, plannedexittime) FROM stdin;
8	Allan	254712519615	2025-05-22 06:14:19.953	\N	1	t	2025-05-22 13:00:00
\.


--
-- TOC entry 3564 (class 0 OID 0)
-- Dependencies: 219
-- Name: admins_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.admins_id_seq', 2, true);


--
-- TOC entry 3565 (class 0 OID 0)
-- Dependencies: 230
-- Name: advertisements_ad_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.advertisements_ad_id_seq', 8, true);


--
-- TOC entry 3566 (class 0 OID 0)
-- Dependencies: 224
-- Name: bookings_booking_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.bookings_booking_id_seq', 35, true);


--
-- TOC entry 3567 (class 0 OID 0)
-- Dependencies: 226
-- Name: issues_issue_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.issues_issue_id_seq', 20, true);


--
-- TOC entry 3568 (class 0 OID 0)
-- Dependencies: 232
-- Name: notifications_notification_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.notifications_notification_id_seq', 23, true);


--
-- TOC entry 3569 (class 0 OID 0)
-- Dependencies: 234
-- Name: payments_payment_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.payments_payment_id_seq', 26, true);


--
-- TOC entry 3570 (class 0 OID 0)
-- Dependencies: 228
-- Name: technicians_technician_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.technicians_technician_id_seq', 50, true);


--
-- TOC entry 3571 (class 0 OID 0)
-- Dependencies: 217
-- Name: tenants_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.tenants_id_seq', 11, true);


--
-- TOC entry 3572 (class 0 OID 0)
-- Dependencies: 222
-- Name: visitors_visitorid_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.visitors_visitorid_seq', 8, true);


--
-- TOC entry 3358 (class 2606 OID 65664)
-- Name: admins admins_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.admins
    ADD CONSTRAINT admins_email_key UNIQUE (email);


--
-- TOC entry 3360 (class 2606 OID 65666)
-- Name: admins admins_phonenumber_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.admins
    ADD CONSTRAINT admins_phonenumber_key UNIQUE (phonenumber);


--
-- TOC entry 3362 (class 2606 OID 65662)
-- Name: admins admins_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.admins
    ADD CONSTRAINT admins_pkey PRIMARY KEY (id);


--
-- TOC entry 3374 (class 2606 OID 73876)
-- Name: advertisements advertisements_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.advertisements
    ADD CONSTRAINT advertisements_pkey PRIMARY KEY (ad_id);


--
-- TOC entry 3368 (class 2606 OID 73823)
-- Name: bookings bookings_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_pkey PRIMARY KEY (booking_id);


--
-- TOC entry 3370 (class 2606 OID 73854)
-- Name: issues issues_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.issues
    ADD CONSTRAINT issues_pkey PRIMARY KEY (issue_id);


--
-- TOC entry 3376 (class 2606 OID 73892)
-- Name: notifications notifications_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_pkey PRIMARY KEY (notification_id);


--
-- TOC entry 3378 (class 2606 OID 73907)
-- Name: payments payments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_pkey PRIMARY KEY (payment_id);


--
-- TOC entry 3364 (class 2606 OID 65671)
-- Name: rooms rooms_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rooms
    ADD CONSTRAINT rooms_pkey PRIMARY KEY (roomid);


--
-- TOC entry 3372 (class 2606 OID 73866)
-- Name: technicians technicians_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.technicians
    ADD CONSTRAINT technicians_pkey PRIMARY KEY (technician_id);


--
-- TOC entry 3352 (class 2606 OID 65650)
-- Name: tenants tenants_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tenants
    ADD CONSTRAINT tenants_email_key UNIQUE (email);


--
-- TOC entry 3354 (class 2606 OID 65652)
-- Name: tenants tenants_phonenumber_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tenants
    ADD CONSTRAINT tenants_phonenumber_key UNIQUE (phonenumber);


--
-- TOC entry 3356 (class 2606 OID 65648)
-- Name: tenants tenants_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tenants
    ADD CONSTRAINT tenants_pkey PRIMARY KEY (id);


--
-- TOC entry 3366 (class 2606 OID 73809)
-- Name: visitors visitors_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.visitors
    ADD CONSTRAINT visitors_pkey PRIMARY KEY (visitorid);


--
-- TOC entry 3383 (class 2606 OID 73877)
-- Name: advertisements advertisements_tenant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.advertisements
    ADD CONSTRAINT advertisements_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON DELETE CASCADE;


--
-- TOC entry 3380 (class 2606 OID 73829)
-- Name: bookings bookings_room_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_room_id_fkey FOREIGN KEY (room_id) REFERENCES public.rooms(roomid);


--
-- TOC entry 3381 (class 2606 OID 82258)
-- Name: bookings bookings_tenant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON DELETE CASCADE;


--
-- TOC entry 3385 (class 2606 OID 73908)
-- Name: payments fk_tenant; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT fk_tenant FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON DELETE CASCADE;


--
-- TOC entry 3382 (class 2606 OID 82263)
-- Name: issues issues_tenant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.issues
    ADD CONSTRAINT issues_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON DELETE CASCADE;


--
-- TOC entry 3384 (class 2606 OID 73893)
-- Name: notifications notifications_tenant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON DELETE CASCADE;


--
-- TOC entry 3379 (class 2606 OID 73810)
-- Name: visitors visitors_visitedroomid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.visitors
    ADD CONSTRAINT visitors_visitedroomid_fkey FOREIGN KEY (visitedroomid) REFERENCES public.rooms(roomid);


-- Completed on 2025-05-27 09:03:54 AST

--
-- PostgreSQL database dump complete
--

