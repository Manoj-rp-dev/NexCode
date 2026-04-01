USE Project;
GO

IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Admin')
BEGIN
    CREATE TABLE Admin (
        AdminID INT IDENTITY(1,1) PRIMARY KEY,
        Username NVARCHAR(100) NOT NULL UNIQUE,
        UserPassword NVARCHAR(MAX) NOT NULL
    );
END
GO

IF NOT EXISTS (SELECT * FROM Admin WHERE Username = 'admin123')
BEGIN
    INSERT INTO Admin (Username, UserPassword) 
    VALUES ('admin123', 'pass-admin0005');
END
GO

PRINT 'Admin table created and seeded successfully.';
