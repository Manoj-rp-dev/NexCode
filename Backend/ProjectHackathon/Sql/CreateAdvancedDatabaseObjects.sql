

-- 1. Create Audit Table for Trigger
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'ApplicationAuditLogs')
BEGIN
    CREATE TABLE ApplicationAuditLogs (
        LogID INT IDENTITY(1,1) PRIMARY KEY,
        ApplicationID INT NOT NULL,
        ActionType NVARCHAR(50) DEFAULT 'INSERT',
        LogDate DATETIME DEFAULT GETDATE(),
        Details NVARCHAR(MAX)
    );
    PRINT 'ApplicationAuditLogs table created.';
END
GO

-- 2. Create Stored Procedure for Hackathon Application
IF EXISTS (SELECT * FROM sys.objects WHERE type = 'P' AND name = 'sp_ApplyForHackathon')
    DROP PROCEDURE sp_ApplyForHackathon;
GO

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
        -- Check for Duplicate Key violation (already applied)
        IF ERROR_NUMBER() = 2627 OR ERROR_NUMBER() = 2601
        BEGIN
            -- Manual Error Message
            RAISERROR('You have already applied for this hackathon.', 16, 1);
        END
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

-- 3. Create Trigger for Auditing
IF EXISTS (SELECT * FROM sys.triggers WHERE name = 'trg_OnApplicationSubmitted')
    DROP TRIGGER trg_OnApplicationSubmitted;
GO

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

-- 4. Create Procedure with CURSOR for reporting
IF EXISTS (SELECT * FROM sys.objects WHERE type = 'P' AND name = 'sp_GetHackathonStatsReport')
    DROP PROCEDURE sp_GetHackathonStatsReport;
GO

CREATE PROCEDURE sp_GetHackathonStatsReport
AS
BEGIN
    SET NOCOUNT ON;
    
    DECLARE @HackathonName NVARCHAR(255);
    DECLARE @ApplicantCount INT;
    DECLARE @HackathonID INT;
    
    -- Using a CURSOR to iterate through each hackathon
    DECLARE hackathon_cursor CURSOR FOR 
    SELECT HackathonID, HackathonName FROM HostHackathon;
    
    OPEN hackathon_cursor;
    
    FETCH NEXT FROM hackathon_cursor INTO @HackathonID, @HackathonName;
    
    PRINT '--- HACKATHON APPLICANT REPORT ---';
    
    WHILE @@FETCH_STATUS = 0
    BEGIN
        SELECT @ApplicantCount = COUNT(*) 
        FROM HackathonApplications 
        WHERE HostHackathonID = @HackathonID;
        
        PRINT 'Hackathon: ' + @HackathonName + ' | Total Applicants: ' + CAST(@ApplicantCount AS NVARCHAR(10));
        
        FETCH NEXT FROM hackathon_cursor INTO @HackathonID, @HackathonName;
    END
    
    CLOSE hackathon_cursor;
    DEALLOCATE hackathon_cursor;
END
GO
