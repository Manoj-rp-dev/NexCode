UPDATE HostHackathon SET ImageData = (SELECT BulkColumn FROM OPENROWSET(BULK N'e:\Project\Hackathon\src\assets\LandingPageImages\ss2.jpeg', SINGLE_BLOB) AS x) WHERE HackathonID % 5 = 0;
UPDATE HostHackathon SET ImageData = (SELECT BulkColumn FROM OPENROWSET(BULK N'e:\Project\Hackathon\src\assets\LandingPageImages\ss3.jpeg', SINGLE_BLOB) AS x) WHERE HackathonID % 5 = 1;
UPDATE HostHackathon SET ImageData = (SELECT BulkColumn FROM OPENROWSET(BULK N'e:\Project\Hackathon\src\assets\LandingPageImages\ss4.jpeg', SINGLE_BLOB) AS x) WHERE HackathonID % 5 = 2;
UPDATE HostHackathon SET ImageData = (SELECT BulkColumn FROM OPENROWSET(BULK N'e:\Project\Hackathon\src\assets\LandingPageImages\ss5.jpeg', SINGLE_BLOB) AS x) WHERE HackathonID % 5 = 3;
UPDATE HostHackathon SET ImageData = (SELECT BulkColumn FROM OPENROWSET(BULK N'e:\Project\Hackathon\src\assets\LandingPageImages\ss6.jpeg', SINGLE_BLOB) AS x) WHERE HackathonID % 5 = 4;
