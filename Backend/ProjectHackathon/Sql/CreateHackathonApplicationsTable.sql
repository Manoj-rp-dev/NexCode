USE Project;
GO

CREATE TABLE HackathonApplications (
    ApplicationID INT IDENTITY(1,1) PRIMARY KEY,
    HostHackathonID INT NOT NULL,
    ParticipantsID INT NOT NULL,
    CollegeName NVARCHAR(255) NULL,
    PortfolioUrl NVARCHAR(MAX) NULL,
    Motivation NVARCHAR(MAX) NULL,
    TeamMembers NVARCHAR(MAX) NULL,
    AppliedAt DATETIME DEFAULT GETDATE(),
    
    CONSTRAINT FK_HackathonApplications_HostHackathon FOREIGN KEY (HostHackathonID) REFERENCES HostHackathon(HackathonID) ON DELETE CASCADE,
    CONSTRAINT FK_HackathonApplications_Participants FOREIGN KEY (ParticipantsID) REFERENCES Participants(ParticipantsID) ON DELETE CASCADE,
    CONSTRAINT UQ_ApplicantPerHackathon UNIQUE (HostHackathonID, ParticipantsID)
);
GO

PRINT 'HackathonApplications table created successfully.';
