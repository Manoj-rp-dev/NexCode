/*
==============================================================================
MASTER DATABASE DEPLOYMENT SCRIPT
Project: NexCode Hackathon Platform
Target environment: MonsterASP.net (MSSQL)
==============================================================================
This script sets up:
1. All Tables (Admin, Host, Participants, etc.)
2. All Advanced Views (Joins for Dashboards)
3. Stored Procedures (Authentication, Profile Management, Reports)
4. Triggers (Auditing)
5. Seed Data (Admin User)
==============================================================================
*/

-- 1. CLEANUP: Drop all existing objects to ensure a fresh start
-- Disable all constraints first
DECLARE @Sql NVARCHAR(MAX) = '';
SELECT @Sql += 'ALTER TABLE ' + QUOTENAME(OBJECT_SCHEMA_NAME(parent_object_id)) + '.' + QUOTENAME(OBJECT_NAME(parent_object_id)) + ' DROP CONSTRAINT ' + QUOTENAME(name) + ';'
FROM sys.foreign_keys;
EXEC sp_executesql @Sql;

-- Drop Tables
DROP TABLE IF EXISTS ApplicationAuditLogs;
DROP TABLE IF EXISTS HackathonApplications;
DROP TABLE IF EXISTS ParticipantsProfile;
DROP TABLE IF EXISTS HostHackathon;
DROP TABLE IF EXISTS Participants;
DROP TABLE IF EXISTS Host;
DROP TABLE IF EXISTS Admin;

-- Drop Procedures
DROP PROCEDURE IF EXISTS SaveParticipantsProfile;
DROP PROCEDURE IF EXISTS sp_ApplyForHackathon;
DROP PROCEDURE IF EXISTS sp_GetHackathonStatsReport;

-- Drop Views
DROP VIEW IF EXISTS v_HackathonWithHost;
DROP VIEW IF EXISTS v_ExpandedApplications;
DROP VIEW IF EXISTS v_HostApplicantReport;
DROP VIEW IF EXISTS v_HackathonNotifications;
GO

-- 2. CREATE TABLES
-- ==============================================================================

CREATE TABLE Admin (
    AdminID INT PRIMARY KEY IDENTITY(1,1),
    Username NVARCHAR(100) NOT NULL,
    UserPassword NVARCHAR(MAX) NOT NULL
);

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

CREATE TABLE HackathonApplications (
    ApplicationID INT PRIMARY KEY IDENTITY(1,1),
    ParticipantsID INT NOT NULL,
    HostHackathonID INT NOT NULL,
    CollegeName NVARCHAR(MAX),
    PortfolioUrl NVARCHAR(MAX),
    Motivation NVARCHAR(MAX),
    TeamMembers NVARCHAR(MAX),
    AppliedAt DATETIME DEFAULT GETDATE(),
    Status NVARCHAR(50) DEFAULT 'Pending',
    ResumeData VARBINARY(MAX),
    IsWinner BIT DEFAULT 0,
    HasParticipated BIT DEFAULT 0,
    HostIsNotificationCleared BIT DEFAULT 0,
    CONSTRAINT FK_HackathonApplications_Participants FOREIGN KEY (ParticipantsID) REFERENCES Participants(ParticipantsID) ON DELETE CASCADE,
    CONSTRAINT FK_HackathonApplications_HostHackathon FOREIGN KEY (HostHackathonID) REFERENCES HostHackathon(HackathonID) ON DELETE CASCADE
);

CREATE TABLE ApplicationAuditLogs (
    LogID INT IDENTITY(1,1) PRIMARY KEY,
    ApplicationID INT NOT NULL,
    ActionType NVARCHAR(50) DEFAULT 'INSERT',
    LogDate DATETIME DEFAULT GETDATE(),
    Details NVARCHAR(MAX)
);
GO

-- 3. CREATE VIEWS (Simplifying Joins for Frontend)
-- ==============================================================================

-- View for Hackathon Listing (Main Page)
CREATE VIEW v_HackathonWithHost AS
SELECT 
    H.HackathonID, H.HostID, Org.HostName, Org.OrganizationName, 
    H.HackathonName, H.HackathonType, H.Mode, H.ParticipationType, H.TeamSize,
    H.PrizePool, H.EventDate, H.Description, H.WebsiteLink, H.ImageData,
    Org.ProfileImage AS HostLogo,
    ISNULL(H.IsBlocked, 0) AS IsBlocked
FROM HostHackathon H
INNER JOIN Host Org ON H.HostID = Org.HostID;
GO

-- View for Participant's Dashboard (Applied Hackathons)
CREATE VIEW v_ExpandedApplications AS
SELECT 
    A.ApplicationID, A.ParticipantsID, A.AppliedAt, A.Status, A.IsWinner, A.HasParticipated, A.HostIsNotificationCleared,
    H.HackathonID, H.HackathonName, H.HackathonType, H.Mode, H.PrizePool, H.ImageData, H.WebsiteLink,
    Org.HostID, Org.HostName, Org.OrganizationName
FROM HackathonApplications A
INNER JOIN HostHackathon H ON A.HostHackathonID = H.HackathonID
INNER JOIN Host Org ON H.HostID = Org.HostID;
GO

-- View for Host's Applicant Report (Tracking performance and profiles)
CREATE VIEW v_HostApplicantReport AS
SELECT 
    A.ApplicationID, A.ParticipantsID, A.HostHackathonID, A.AppliedAt, A.Status, A.IsWinner, A.HasParticipated,
    P.Firstname, P.Lastname, P.Email, P.Collegename AS OriginalCollege,
    A.CollegeName AS AppliedFromCollege, A.PortfolioUrl, A.Motivation, A.TeamMembers,
    PP.Skill, PP.GithubLink, PP.ProfileImage AS ParticipantAvatar,
    H.HackathonName,
    (SELECT COUNT(*) FROM HackathonApplications WHERE ParticipantsID = A.ParticipantsID AND HasParticipated = 1) AS LifetimeParticipations,
    (SELECT COUNT(*) FROM HackathonApplications WHERE ParticipantsID = A.ParticipantsID AND IsWinner = 1) AS LifetimeWins
FROM HackathonApplications A
INNER JOIN Participants P ON A.ParticipantsID = P.ParticipantsID
INNER JOIN HostHackathon H ON A.HostHackathonID = H.HackathonID
LEFT JOIN ParticipantsProfile PP ON A.ParticipantsID = PP.ParticipantsID;
GO

-- View for Host Notifications (Uncleared applications)
CREATE VIEW v_HackathonNotifications AS
SELECT 
    A.ApplicationID, H.HostID, H.HackathonName,
    P.Firstname + ' ' + P.Lastname AS ParticipantName,
    A.AppliedAt
FROM HackathonApplications A
INNER JOIN Participants P ON A.ParticipantsID = P.ParticipantsID
INNER JOIN HostHackathon H ON A.HostHackathonID = H.HackathonID
WHERE ISNULL(A.HostIsNotificationCleared, 0) = 0;
GO

-- 4. CREATE STORED PROCEDURES
-- ==============================================================================

-- Save participant profile (Insert or Update)
CREATE PROCEDURE SaveParticipantsProfile
    @ParticipantsID INT,
    @Skill NVARCHAR(200),
    @Place NVARCHAR(200),
    @GithubLink NVARCHAR(300),
    @Bio NVARCHAR(MAX),
    @ProfileImage VARBINARY(MAX)
AS
BEGIN
    IF EXISTS (SELECT 1 FROM ParticipantsProfile WHERE ParticipantsID = @ParticipantsID)
    BEGIN
        UPDATE ParticipantsProfile
        SET Skill = @Skill, Place = @Place, GithubLink = @GithubLink, Bio = @Bio, ProfileImage = @ProfileImage
        WHERE ParticipantsID = @ParticipantsID
    END
    ELSE
    BEGIN
        INSERT INTO ParticipantsProfile (ParticipantsID, Skill, Place, GithubLink, Bio, ProfileImage)
        VALUES (@ParticipantsID, @Skill, @Place, @GithubLink, @Bio, @ProfileImage)
    END
END
GO

-- Apply for Hackathon with Duplicate Check
CREATE PROCEDURE sp_ApplyForHackathon
    @HostHackathonID INT,
    @ParticipantsID INT,
    @CollegeName NVARCHAR(255),
    @PortfolioUrl NVARCHAR(MAX),
    @Motivation NVARCHAR(MAX),
    @TeamMembers NVARCHAR(MAX)
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        INSERT INTO HackathonApplications 
            (HostHackathonID, ParticipantsID, CollegeName, PortfolioUrl, Motivation, TeamMembers, AppliedAt, HostIsNotificationCleared)
        VALUES 
            (@HostHackathonID, @ParticipantsID, @CollegeName, @PortfolioUrl, @Motivation, @TeamMembers, GETDATE(), 0);
        SELECT 'Success' AS Status, SCOPE_IDENTITY() AS NewApplicationID;
    END TRY
    BEGIN CATCH
        IF ERROR_NUMBER() = 2627 OR ERROR_NUMBER() = 2601
            RAISERROR('You have already applied for this hackathon.', 16, 1);
        ELSE
        BEGIN
            DECLARE @ErrMsg NVARCHAR(4000) = ERROR_MESSAGE();
            DECLARE @ErrSev INT = ERROR_SEVERITY();
            DECLARE @ErrSta INT = ERROR_STATE();
            RAISERROR(@ErrMsg, @ErrSev, @ErrSta);
        END
    END CATCH
END
GO

-- Reporting Procedure with CURSOR
CREATE PROCEDURE sp_GetHackathonStatsReport
AS
BEGIN
    SET NOCOUNT ON;
    DECLARE @HackathonName NVARCHAR(255), @ApplicantCount INT, @HackathonID INT;
    DECLARE hackathon_cursor CURSOR FOR SELECT HackathonID, HackathonName FROM HostHackathon;
    OPEN hackathon_cursor;
    FETCH NEXT FROM hackathon_cursor INTO @HackathonID, @HackathonName;
    WHILE @@FETCH_STATUS = 0
    BEGIN
        SELECT @ApplicantCount = COUNT(*) FROM HackathonApplications WHERE HostHackathonID = @HackathonID;
        PRINT 'Hackathon: ' + @HackathonName + ' | Total Applicants: ' + CAST(@ApplicantCount AS NVARCHAR(10));
        FETCH NEXT FROM hackathon_cursor INTO @HackathonID, @HackathonName;
    END
    CLOSE hackathon_cursor;
    DEALLOCATE hackathon_cursor;
END
GO

-- 5. CREATE TRIGGERS
-- ==============================================================================

CREATE TRIGGER trg_OnApplicationSubmitted
ON HackathonApplications
AFTER INSERT
AS
BEGIN
    SET NOCOUNT ON;
    INSERT INTO ApplicationAuditLogs (ApplicationID, Details)
    SELECT ApplicationID, 'New application submitted by Participant ID: ' + CAST(ParticipantsID AS NVARCHAR(10))
    FROM inserted;
END
GO

-- 6. SEED DATA
-- ==============================================================================

-- Initial Admin User (admin / admin123)
-- BCrypt Hash: $2a$12$R9h/lIPz0bou3EDF8.9PDeThz.V6Iq.LdIouX.FpM4uByis6H80mC
INSERT INTO Admin (Username, UserPassword) 
VALUES ('admin', '$2a$12$R9h/lIPz0bou3EDF8.9PDeThz.V6Iq.LdIouX.FpM4uByis6H80mC');
GO

PRINT 'Database setup complete. All tables, views, procedures, and triggers are ready.';
