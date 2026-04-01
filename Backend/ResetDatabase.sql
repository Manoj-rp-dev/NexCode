USE Project;
GO

-- Disable all constraints to allow safe dropping
DECLARE @Sql NVARCHAR(MAX) = '';
SELECT @Sql += 'ALTER TABLE ' + QUOTENAME(OBJECT_SCHEMA_NAME(parent_object_id)) + '.' + QUOTENAME(OBJECT_NAME(parent_object_id)) + ' DROP CONSTRAINT ' + QUOTENAME(name) + ';'
FROM sys.foreign_keys;
EXEC sp_executesql @Sql;
GO

-- Drop all tables in reverse dependency order
DROP TABLE IF EXISTS HackathonApplications;
DROP TABLE IF EXISTS ParticipantsProfile;
DROP TABLE IF EXISTS HostHackathon;
DROP TABLE IF EXISTS Participants;
DROP TABLE IF EXISTS Host;
DROP TABLE IF EXISTS Admin;
GO

-- Create Admin table
CREATE TABLE Admin (
    AdminID INT PRIMARY KEY IDENTITY(1,1),
    Username NVARCHAR(100) NOT NULL,
    UserPassword NVARCHAR(MAX) NOT NULL
);
GO

-- Create Participants table
CREATE TABLE Participants (
    ParticipantsID INT PRIMARY KEY IDENTITY(1,1),
    Firstname VARCHAR(30) NOT NULL,
    Lastname VARCHAR(20) NOT NULL,
    Email VARCHAR(40) NOT NULL,
    Dob DATE NOT NULL,
    Degree VARCHAR(60) NOT NULL,
    Collegename VARCHAR(60) NOT NULL,
    Username VARCHAR(25) NOT NULL,
    UserPassword VARCHAR(255)
);
GO

-- Create Host table
CREATE TABLE Host (
    HostID INT PRIMARY KEY IDENTITY(1,1),
    HostName NVARCHAR(100) NOT NULL,
    HostType NVARCHAR(50) NOT NULL,
    OrganizationName NVARCHAR(150),
    Email NVARCHAR(100) NOT NULL,
    Country NVARCHAR(60) NOT NULL,
    City NVARCHAR(60) NOT NULL,
    Username NVARCHAR(50) NOT NULL,
    UserPassword VARCHAR(255),
    Bio NVARCHAR(MAX),
    ProfileImage VARBINARY(MAX),
    Website NVARCHAR(255),
    Industry NVARCHAR(100),
    IsApproved BIT DEFAULT 0,
    IsBlocked BIT DEFAULT 0
);
GO

-- Create HostHackathon table
CREATE TABLE HostHackathon (
    HackathonID INT PRIMARY KEY IDENTITY(1,1),
    HostID INT NOT NULL,
    HackathonName NVARCHAR(150) NOT NULL,
    HackathonType NVARCHAR(100) NOT NULL,
    Mode NVARCHAR(50) NOT NULL,
    ParticipationType NVARCHAR(50),
    PrizePool DECIMAL(18,2),
    EventDate DATE NOT NULL,
    ImageData VARBINARY(MAX) NOT NULL,
    Description NVARCHAR(MAX),
    WebsiteLink NVARCHAR(MAX),
    TeamSize INT,
    RegistrationStartDate DATE,
    RegistrationEndDate DATE,
    IsBlocked BIT DEFAULT 0,
    CONSTRAINT FK_HostHackathon_Host FOREIGN KEY (HostID) REFERENCES Host(HostID) ON DELETE CASCADE
);
GO

-- Create ParticipantsProfile table
CREATE TABLE ParticipantsProfile (
    ProfileID INT PRIMARY KEY IDENTITY(1,1),
    ParticipantsID INT NOT NULL,
    Skill NVARCHAR(200),
    Place NVARCHAR(200),
    GithubLink NVARCHAR(300),
    Bio NVARCHAR(MAX),
    ProfileImage VARBINARY(MAX),
    CONSTRAINT FK_ParticipantsProfile_Participants FOREIGN KEY (ParticipantsID) REFERENCES Participants(ParticipantsID) ON DELETE CASCADE
);
GO

-- Create HackathonApplications table
CREATE TABLE HackathonApplications (
    ApplicationID INT PRIMARY KEY IDENTITY(1,1),
    ParticipantsID INT NOT NULL,  -- Matches backend expectation
    HostHackathonID INT NOT NULL,
    CollegeName NVARCHAR(MAX),    -- Added missing column
    PortfolioUrl NVARCHAR(MAX),   -- Added missing column
    Motivation NVARCHAR(MAX),      -- Added missing column
    TeamMembers NVARCHAR(MAX),     -- Added missing column
    AppliedAt DATETIME DEFAULT GETDATE(), -- Renamed from ApplicationDate
    Status NVARCHAR(50) DEFAULT 'Pending',
    ResumeData VARBINARY(MAX),
    IsWinner BIT DEFAULT 0,
    HasParticipated BIT DEFAULT 0,
    HostIsNotificationCleared BIT DEFAULT 0, -- Added missing column
    CONSTRAINT FK_HackathonApplications_Participants FOREIGN KEY (ParticipantsID) REFERENCES Participants(ParticipantsID) ON DELETE CASCADE,
    CONSTRAINT FK_HackathonApplications_HostHackathon FOREIGN KEY (HostHackathonID) REFERENCES HostHackathon(HackathonID) ON DELETE CASCADE
);
GO

-- Empty database reset
GO

-- Seed Admin User (admin / admin123)
INSERT INTO Admin (Username, UserPassword) 
VALUES ('admin', 'admin123');
GO
