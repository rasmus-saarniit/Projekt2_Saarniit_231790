USE [DB_SaarniitRasmus]
GO
/****** Object:  Schema [clinic]    Script Date: 18.05.2025 10:07:24 ******/
CREATE SCHEMA [clinic]
GO
/****** Object:  Table [clinic].[Haiguslood]    Script Date: 18.05.2025 10:07:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [clinic].[Haiguslood](
	[HaiguslooID] [int] IDENTITY(1,1) NOT NULL,
	[PatsiendiID] [int] NOT NULL,
	[T99tajaID] [int] NOT NULL,
	[KliendiID] [int] NOT NULL,
	[Kuupäev] [date] NOT NULL,
	[Kirjeldus] [nvarchar](255) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[HaiguslooID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [clinic].[Kasutajad]    Script Date: 18.05.2025 10:07:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [clinic].[Kasutajad](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[username] [varchar](100) NOT NULL,
	[passwordHash] [varchar](255) NOT NULL,
	[role] [varchar](20) NOT NULL,
	[createdAt] [datetime2](7) NOT NULL,
	[updatedAt] [datetime2](7) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
UNIQUE NONCLUSTERED 
(
	[username] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [clinic].[Klient]    Script Date: 18.05.2025 10:07:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [clinic].[Klient](
	[KliendiID] [int] IDENTITY(1,1) NOT NULL,
	[Eesnimi] [nvarchar](50) NOT NULL,
	[Perekonnanimi] [nvarchar](50) NOT NULL,
	[Isikukood] [nvarchar](50) NOT NULL,
	[Telefoninr] [nvarchar](50) NOT NULL,
	[Epost] [nvarchar](50) NOT NULL,
	[Elukoht] [nvarchar](50) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[KliendiID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [clinic].[Liik]    Script Date: 18.05.2025 10:07:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [clinic].[Liik](
	[LiigiID] [int] IDENTITY(1,1) NOT NULL,
	[Nimetus] [varchar](50) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[LiigiID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [clinic].[Patsiendid]    Script Date: 18.05.2025 10:07:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [clinic].[Patsiendid](
	[PatsiendiID] [int] IDENTITY(1,1) NOT NULL,
	[Nimi] [nvarchar](50) NOT NULL,
	[Vanus] [tinyint] NOT NULL,
	[T6ug] [nvarchar](50) NOT NULL,
	[Steriliseerimine] [bit] NOT NULL,
	[LiigiID] [int] NOT NULL,
	[KliendiID] [int] NOT NULL,
	[VisiidiID] [int] NULL,
	[HaiguslooID] [int] NULL,
PRIMARY KEY CLUSTERED 
(
	[PatsiendiID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [clinic].[Patsiendid_Audit]    Script Date: 18.05.2025 10:07:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [clinic].[Patsiendid_Audit](
	[PatsiendiID] [int] NULL,
	[Nimi] [nvarchar](50) NULL,
	[Vanus] [tinyint] NULL,
	[T6ug] [nvarchar](50) NULL,
	[Steriliseerimine] [bit] NULL,
	[LiigiID] [int] NULL,
	[KliendiID] [int] NULL,
	[VisiidiID] [int] NULL,
	[HaiguslooID] [int] NULL,
	[DeletedAt] [datetime] NULL,
	[DeletedByUserID] [int] NULL
) ON [PRIMARY]
GO
/****** Object:  Table [clinic].[Spetsialiseerumine]    Script Date: 18.05.2025 10:07:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [clinic].[Spetsialiseerumine](
	[ArstiID] [int] NOT NULL,
	[Valdkond] [varchar](50) NOT NULL
) ON [PRIMARY]
GO
/****** Object:  Table [clinic].[T99tajad]    Script Date: 18.05.2025 10:07:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [clinic].[T99tajad](
	[T99tajaID] [int] IDENTITY(1,1) NOT NULL,
	[LaborandiID] [int] NULL,
	[TehnikuID] [int] NULL,
	[ArstiID] [int] NULL,
	[Valdkond] [varchar](50) NOT NULL,
	[Eesnimi] [varchar](50) NOT NULL,
	[Perekonnanimi] [varchar](50) NOT NULL,
	[UserID] [int] NULL,
PRIMARY KEY CLUSTERED 
(
	[T99tajaID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [clinic].[Visiit]    Script Date: 18.05.2025 10:07:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [clinic].[Visiit](
	[VisiidiID] [int] IDENTITY(1,1) NOT NULL,
	[PatsiendiID] [int] NOT NULL,
	[T99tajaID] [int] NOT NULL,
	[Kuup2ev] [date] NOT NULL,
	[Kaal] [real] NOT NULL,
	[HaiguslooID] [int] NULL,
PRIMARY KEY CLUSTERED 
(
	[VisiidiID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
ALTER TABLE [clinic].[Kasutajad] ADD  DEFAULT ('User') FOR [role]
GO
ALTER TABLE [clinic].[Patsiendid_Audit] ADD  DEFAULT (getdate()) FOR [DeletedAt]
GO
ALTER TABLE [clinic].[Visiit] ADD  DEFAULT (getdate()) FOR [Kuup2ev]
GO
ALTER TABLE [clinic].[Haiguslood]  WITH CHECK ADD  CONSTRAINT [FK_Haiguslood_Klient] FOREIGN KEY([KliendiID])
REFERENCES [clinic].[Klient] ([KliendiID])
GO
ALTER TABLE [clinic].[Haiguslood] CHECK CONSTRAINT [FK_Haiguslood_Klient]
GO
ALTER TABLE [clinic].[Haiguslood]  WITH CHECK ADD  CONSTRAINT [FK_Haiguslood_Patsiendid] FOREIGN KEY([PatsiendiID])
REFERENCES [clinic].[Patsiendid] ([PatsiendiID])
GO
ALTER TABLE [clinic].[Haiguslood] CHECK CONSTRAINT [FK_Haiguslood_Patsiendid]
GO
ALTER TABLE [clinic].[Haiguslood]  WITH CHECK ADD  CONSTRAINT [FK_Haiguslood_T99tajad] FOREIGN KEY([T99tajaID])
REFERENCES [clinic].[T99tajad] ([T99tajaID])
GO
ALTER TABLE [clinic].[Haiguslood] CHECK CONSTRAINT [FK_Haiguslood_T99tajad]
GO
ALTER TABLE [clinic].[Patsiendid]  WITH CHECK ADD  CONSTRAINT [FK_Patsiendid_Haiguslood] FOREIGN KEY([HaiguslooID])
REFERENCES [clinic].[Haiguslood] ([HaiguslooID])
GO
ALTER TABLE [clinic].[Patsiendid] CHECK CONSTRAINT [FK_Patsiendid_Haiguslood]
GO
ALTER TABLE [clinic].[Patsiendid]  WITH CHECK ADD  CONSTRAINT [FK_Patsiendid_Klient] FOREIGN KEY([KliendiID])
REFERENCES [clinic].[Klient] ([KliendiID])
GO
ALTER TABLE [clinic].[Patsiendid] CHECK CONSTRAINT [FK_Patsiendid_Klient]
GO
ALTER TABLE [clinic].[Patsiendid]  WITH CHECK ADD  CONSTRAINT [FK_Patsiendid_Liik] FOREIGN KEY([LiigiID])
REFERENCES [clinic].[Liik] ([LiigiID])
GO
ALTER TABLE [clinic].[Patsiendid] CHECK CONSTRAINT [FK_Patsiendid_Liik]
GO
ALTER TABLE [clinic].[Patsiendid]  WITH CHECK ADD  CONSTRAINT [FK_Patsiendid_Visiit] FOREIGN KEY([VisiidiID])
REFERENCES [clinic].[Visiit] ([VisiidiID])
GO
ALTER TABLE [clinic].[Patsiendid] CHECK CONSTRAINT [FK_Patsiendid_Visiit]
GO
ALTER TABLE [clinic].[Patsiendid_Audit]  WITH CHECK ADD  CONSTRAINT [FK_Patsiendid_Audit_Kasutajad] FOREIGN KEY([DeletedByUserID])
REFERENCES [clinic].[Kasutajad] ([id])
GO
ALTER TABLE [clinic].[Patsiendid_Audit] CHECK CONSTRAINT [FK_Patsiendid_Audit_Kasutajad]
GO
ALTER TABLE [clinic].[Spetsialiseerumine]  WITH CHECK ADD  CONSTRAINT [FK_Spetsialiseerumine_ArstiID] FOREIGN KEY([ArstiID])
REFERENCES [clinic].[T99tajad] ([T99tajaID])
GO
ALTER TABLE [clinic].[Spetsialiseerumine] CHECK CONSTRAINT [FK_Spetsialiseerumine_ArstiID]
GO
ALTER TABLE [clinic].[T99tajad]  WITH CHECK ADD  CONSTRAINT [FK_T99tajad_Kasutajad] FOREIGN KEY([UserID])
REFERENCES [clinic].[Kasutajad] ([id])
GO
ALTER TABLE [clinic].[T99tajad] CHECK CONSTRAINT [FK_T99tajad_Kasutajad]
GO
ALTER TABLE [clinic].[Visiit]  WITH CHECK ADD  CONSTRAINT [FK_Visiit_Haiguslood] FOREIGN KEY([HaiguslooID])
REFERENCES [clinic].[Haiguslood] ([HaiguslooID])
GO
ALTER TABLE [clinic].[Visiit] CHECK CONSTRAINT [FK_Visiit_Haiguslood]
GO
ALTER TABLE [clinic].[Visiit]  WITH CHECK ADD  CONSTRAINT [FK_Visiit_Patsiendid] FOREIGN KEY([PatsiendiID])
REFERENCES [clinic].[Patsiendid] ([PatsiendiID])
GO
ALTER TABLE [clinic].[Visiit] CHECK CONSTRAINT [FK_Visiit_Patsiendid]
GO
ALTER TABLE [clinic].[Visiit]  WITH CHECK ADD  CONSTRAINT [FK_Visiit_T99tajad] FOREIGN KEY([T99tajaID])
REFERENCES [clinic].[T99tajad] ([T99tajaID])
GO
ALTER TABLE [clinic].[Visiit] CHECK CONSTRAINT [FK_Visiit_T99tajad]
GO
