-- Disable constraints
EXEC sp_MSforeachtable 'ALTER TABLE ? NOCHECK CONSTRAINT ALL';

-- Delete Existing rows to ensure fresh state
DELETE FROM ParticipantsProfile;
DELETE FROM HostHackathon;
DELETE FROM Host;
DELETE FROM Participants;

-- Reset Identity Auto-Increment
DBCC CHECKIDENT ('ParticipantsProfile', RESEED, 0);
DBCC CHECKIDENT ('HostHackathon', RESEED, 0);
DBCC CHECKIDENT ('Host', RESEED, 0);
DBCC CHECKIDENT ('Participants', RESEED, 0);

-- Re-enable constraints (so that basic constraints apply to fresh data)
EXEC sp_MSforeachtable 'ALTER TABLE ? WITH CHECK CHECK CONSTRAINT ALL';

-- Insert 20 Hosts
INSERT INTO Host (HostName, HostType, OrganizationName, Email, Country, City, Username, UserPassword) VALUES
('Alex Johnson', 'Company', 'Tech Innovators', 'alex@techinnovators.com', 'USA', 'San Francisco', 'alex_host', '$2a$11$6bIWdOQT1AeaVAM52xrOzOeC/u2tFLLoFl7zAxtSh4E/B54.aXRmy'),
('Sarah Smith', 'Institution', 'State University', 'sarah.s@stateu.edu', 'USA', 'Boston', 'sarahs_univ', '$2a$11$6bIWdOQT1AeaVAM52xrOzOeC/u2tFLLoFl7zAxtSh4E/B54.aXRmy'),
('DevOrg Inc', 'Company', 'DevOps Foundation', 'info@devorg.com', 'UK', 'London', 'devorg_admin', '$2a$11$6bIWdOQT1AeaVAM52xrOzOeC/u2tFLLoFl7zAxtSh4E/B54.aXRmy'),
('Code For Future', 'Non-profit', 'CFF NGO', 'contact@cff.org', 'Canada', 'Toronto', 'cff_host', '$2a$11$6bIWdOQT1AeaVAM52xrOzOeC/u2tFLLoFl7zAxtSh4E/B54.aXRmy'),
('Priya Patel', 'Individual', 'Independent', 'priya.dev@example.com', 'India', 'Bangalore', 'priya_dv', '$2a$11$6bIWdOQT1AeaVAM52xrOzOeC/u2tFLLoFl7zAxtSh4E/B54.aXRmy'),
('David Chen', 'Company', 'Data Science Labs', 'david.c@dslabs.io', 'Singapore', 'Singapore', 'david_ds', '$2a$11$6bIWdOQT1AeaVAM52xrOzOeC/u2tFLLoFl7zAxtSh4E/B54.aXRmy'),
('Maria Garcia', 'Institution', 'Polytechnic Institute', 'mgarcia@polytech.edu', 'Spain', 'Madrid', 'maria_edu', '$2a$11$6bIWdOQT1AeaVAM52xrOzOeC/u2tFLLoFl7zAxtSh4E/B54.aXRmy'),
('Cyber Shield', 'Company', 'CyberSecurity Experts', 'hello@cybershield.com', 'Israel', 'Tel Aviv', 'cyber_admin', '$2a$11$6bIWdOQT1AeaVAM52xrOzOeC/u2tFLLoFl7zAxtSh4E/B54.aXRmy'),
('Fintech Hackers', 'Company', 'Finance Tech Group', 'hackathons@fintech.group', 'UK', 'London', 'fintech_h', '$2a$11$6bIWdOQT1AeaVAM52xrOzOeC/u2tFLLoFl7zAxtSh4E/B54.aXRmy'),
('Green Earth Tech', 'Non-profit', 'Eco Tech', 'events@greentherth.org', 'Australia', 'Sydney', 'eco_host', '$2a$11$6bIWdOQT1AeaVAM52xrOzOeC/u2tFLLoFl7zAxtSh4E/B54.aXRmy'),
('James Wilson', 'Company', 'AI Research Lab', 'j.wilson@airesearch.com', 'USA', 'Austin', 'james_ai', '$2a$11$6bIWdOQT1AeaVAM52xrOzOeC/u2tFLLoFl7zAxtSh4E/B54.aXRmy'),
('Health Innovate', 'Institution', 'Medical Research', 'innovate@medicalrc.edu', 'USA', 'Chicago', 'health_admin', '$2a$11$6bIWdOQT1AeaVAM52xrOzOeC/u2tFLLoFl7zAxtSh4E/B54.aXRmy'),
('Elena Rodriguez', 'Individual', 'Independent', 'elena.r@example.com', 'Mexico', 'Mexico City', 'elena_ind', '$2a$11$6bIWdOQT1AeaVAM52xrOzOeC/u2tFLLoFl7zAxtSh4E/B54.aXRmy'),
('Web3 Pioneers', 'Company', 'Blockchain Solutions', 'contact@web3pioneers.io', 'Switzerland', 'Zug', 'web3_host', '$2a$11$6bIWdOQT1AeaVAM52xrOzOeC/u2tFLLoFl7zAxtSh4E/B54.aXRmy'),
('Quantum Future', 'Institution', 'Quantum Computing', 'info@quantumfuture.org', 'Germany', 'Munich', 'qf_admin', '$2a$11$6bIWdOQT1AeaVAM52xrOzOeC/u2tFLLoFl7zAxtSh4E/B54.aXRmy'),
('EduHack', 'Non-profit', 'Education For All', 'events@eduhack.org', 'South Africa', 'Cape Town', 'eduhack_host', '$2a$11$6bIWdOQT1AeaVAM52xrOzOeC/u2tFLLoFl7zAxtSh4E/B54.aXRmy'),
('AgriTech Solutions', 'Company', 'Smart Farming', 'admin@agritech.com', 'Netherlands', 'Amsterdam', 'agri_host', '$2a$11$6bIWdOQT1AeaVAM52xrOzOeC/u2tFLLoFl7zAxtSh4E/B54.aXRmy'),
('VR Immersive', 'Company', 'Virtual Reality Co', 'events@vrimmersive.com', 'Japan', 'Tokyo', 'vr_admin', '$2a$11$6bIWdOQT1AeaVAM52xrOzOeC/u2tFLLoFl7zAxtSh4E/B54.aXRmy'),
('Open Source Society', 'Non-profit', 'OSS Foundation', 'host@osssociety.org', 'France', 'Paris', 'oss_host', '$2a$11$6bIWdOQT1AeaVAM52xrOzOeC/u2tFLLoFl7zAxtSh4E/B54.aXRmy'),
('GameDev Masters', 'Company', 'Indie Games Studio', 'jams@gamedevmasters.com', 'Sweden', 'Stockholm', 'gamedev_host', '$2a$11$6bIWdOQT1AeaVAM52xrOzOeC/u2tFLLoFl7zAxtSh4E/B54.aXRmy');

-- Insert 20 Participants
INSERT INTO Participants (Firstname, Lastname, Email, Dob, Degree, Collegename, Username, UserPassword) VALUES
('Michael', 'Brown', 'michael.b@example.com', '2001-03-12', 'B.Sc Computer Science', 'MIT', 'michael_b', '$2a$11$e73nbFaqXXFLDjsVUf7A/OUlu5XciEZNRkLQPSYMuDfttjbFULx5C'),
('Emily', 'Davis', 'emily.d@example.com', '2000-07-24', 'B.Tech Information Tech', 'Stanford University', 'emily_d', '$2a$11$e73nbFaqXXFLDjsVUf7A/OUlu5XciEZNRkLQPSYMuDfttjbFULx5C'),
('Daniel', 'Miller', 'daniel.m@example.com', '1999-11-05', 'M.Sc Software Engineering', 'Carnegie Mellon', 'daniel_m', '$2a$11$e73nbFaqXXFLDjsVUf7A/OUlu5XciEZNRkLQPSYMuDfttjbFULx5C'),
('Sophia', 'Wilson', 'sophia.w@example.com', '2002-01-18', 'B.E Artificial Intelligence', 'UC Berkeley', 'sophia_w', '$2a$11$e73nbFaqXXFLDjsVUf7A/OUlu5XciEZNRkLQPSYMuDfttjbFULx5C'),
('Matthew', 'Moore', 'matthew.m@example.com', '2000-09-30', 'B.Sc Data Science', 'University of Washington', 'matthew_m', '$2a$11$e73nbFaqXXFLDjsVUf7A/OUlu5XciEZNRkLQPSYMuDfttjbFULx5C'),
('Isabella', 'Taylor', 'isabella.t@example.com', '2001-05-22', 'B.Tech Cyber Security', 'Georgia Tech', 'isabella_t', '$2a$11$e73nbFaqXXFLDjsVUf7A/OUlu5XciEZNRkLQPSYMuDfttjbFULx5C'),
('William', 'Anderson', 'william.a@example.com', '1998-12-14', 'M.Sc Computer Science', 'University of Illinois', 'william_a', '$2a$11$e73nbFaqXXFLDjsVUf7A/OUlu5XciEZNRkLQPSYMuDfttjbFULx5C'),
('Olivia', 'Thomas', 'olivia.t@example.com', '2002-08-09', 'B.Sc Computer Engineering', 'Purdue University', 'olivia_t', '$2a$11$e73nbFaqXXFLDjsVUf7A/OUlu5XciEZNRkLQPSYMuDfttjbFULx5C'),
('Alexander', 'Jackson', 'alexander.j@example.com', '2000-04-27', 'B.E Software Engineering', 'University of Michigan', 'alex_j', '$2a$11$e73nbFaqXXFLDjsVUf7A/OUlu5XciEZNRkLQPSYMuDfttjbFULx5C'),
('Ava', 'White', 'ava.w@example.com', '2001-10-15', 'B.Tech Computer Science', 'Cornell University', 'ava_w', '$2a$11$e73nbFaqXXFLDjsVUf7A/OUlu5XciEZNRkLQPSYMuDfttjbFULx5C'),
('Ethan', 'Harris', 'ethan.h@example.com', '1999-02-03', 'M.Sc Information Systems', 'NYU', 'ethan_h', '$2a$11$e73nbFaqXXFLDjsVUf7A/OUlu5XciEZNRkLQPSYMuDfttjbFULx5C'),
('Mia', 'Martin', 'mia.m@example.com', '2002-06-20', 'B.Sc Data Analytics', 'Columbia University', 'mia_m', '$2a$11$e73nbFaqXXFLDjsVUf7A/OUlu5XciEZNRkLQPSYMuDfttjbFULx5C'),
('James', 'Thompson', 'james.t@example.com', '2000-11-11', 'B.A Computer Science', 'Harvard University', 'james_t', '$2a$11$e73nbFaqXXFLDjsVUf7A/OUlu5XciEZNRkLQPSYMuDfttjbFULx5C'),
('Charlotte', 'Garcia', 'charlotte.g@example.com', '2001-01-05', 'B.Tech AI & Data Science', 'UCLA', 'charlotte_g', '$2a$11$e73nbFaqXXFLDjsVUf7A/OUlu5XciEZNRkLQPSYMuDfttjbFULx5C'),
('Benjamin', 'Martinez', 'benjamin.m@example.com', '1998-08-28', 'M.Sc Cyber Security', 'UT Austin', 'benjamin_m', '$2a$11$e73nbFaqXXFLDjsVUf7A/OUlu5XciEZNRkLQPSYMuDfttjbFULx5C'),
('Amelia', 'Robinson', 'amelia.r@example.com', '2002-03-17', 'B.Sc Software Engineering', 'University of Toronto', 'amelia_r', '$2a$11$e73nbFaqXXFLDjsVUf7A/OUlu5XciEZNRkLQPSYMuDfttjbFULx5C'),
('Lucas', 'Clark', 'lucas.c@example.com', '2000-07-08', 'B.E Electronics & Comm', 'University of Waterloo', 'lucas_c', '$2a$11$e73nbFaqXXFLDjsVUf7A/OUlu5XciEZNRkLQPSYMuDfttjbFULx5C'),
('Harper', 'Rodriguez', 'harper.r@example.com', '2001-12-02', 'B.Tech Information Science', 'University of British Columbia', 'harper_r', '$2a$11$e73nbFaqXXFLDjsVUf7A/OUlu5XciEZNRkLQPSYMuDfttjbFULx5C'),
('Henry', 'Lewis', 'henry.l@example.com', '1999-05-19', 'M.Sc Computer Engineering', 'Imperial College London', 'henry_l', '$2a$11$e73nbFaqXXFLDjsVUf7A/OUlu5XciEZNRkLQPSYMuDfttjbFULx5C'),
('Evelyn', 'Lee', 'evelyn.l@example.com', '2002-09-26', 'B.Sc Computer Science', 'NUS Singapore', 'evelyn_l', '$2a$11$e73nbFaqXXFLDjsVUf7A/OUlu5XciEZNRkLQPSYMuDfttjbFULx5C');

-- Insert 20 Hackathons natively tracking to the exact hosts (using subqueries if needed, but we can just use 1 host per hackathon or varying based on rownum logic, realistically assigning random ones would be complex without an ID map, so lets select their IDs explicitly based on Username)

DECLARE @HD1 INT = (SELECT HostID FROM Host WHERE Username = 'alex_host');
DECLARE @HD2 INT = (SELECT HostID FROM Host WHERE Username = 'sarahs_univ');
DECLARE @HD3 INT = (SELECT HostID FROM Host WHERE Username = 'devorg_admin');
DECLARE @HD4 INT = (SELECT HostID FROM Host WHERE Username = 'cff_host');
DECLARE @HD5 INT = (SELECT HostID FROM Host WHERE Username = 'priya_dv');
DECLARE @HD6 INT = (SELECT HostID FROM Host WHERE Username = 'david_ds');
DECLARE @HD7 INT = (SELECT HostID FROM Host WHERE Username = 'maria_edu');
DECLARE @HD8 INT = (SELECT HostID FROM Host WHERE Username = 'cyber_admin');
DECLARE @HD9 INT = (SELECT HostID FROM Host WHERE Username = 'fintech_h');
DECLARE @HD10 INT = (SELECT HostID FROM Host WHERE Username = 'eco_host');
DECLARE @HD11 INT = (SELECT HostID FROM Host WHERE Username = 'james_ai');
DECLARE @HD12 INT = (SELECT HostID FROM Host WHERE Username = 'health_admin');
DECLARE @HD13 INT = (SELECT HostID FROM Host WHERE Username = 'elena_ind');
DECLARE @HD14 INT = (SELECT HostID FROM Host WHERE Username = 'web3_host');
DECLARE @HD15 INT = (SELECT HostID FROM Host WHERE Username = 'qf_admin');
DECLARE @HD16 INT = (SELECT HostID FROM Host WHERE Username = 'eduhack_host');
DECLARE @HD17 INT = (SELECT HostID FROM Host WHERE Username = 'agri_host');
DECLARE @HD18 INT = (SELECT HostID FROM Host WHERE Username = 'vr_admin');
DECLARE @HD19 INT = (SELECT HostID FROM Host WHERE Username = 'oss_host');
DECLARE @HD20 INT = (SELECT HostID FROM Host WHERE Username = 'gamedev_host');

INSERT INTO HostHackathon (HostID, HackathonName, HackathonType, Mode, ParticipationType, TeamSize, PrizePool, EventDate, RegistrationStartDate, RegistrationEndDate, ImageData, Description, WebsiteLink) VALUES
(@HD1, 'Global AI Summit 2026', 'AI/ML', 'Online', 'Team', 4, 50000, '2026-05-15', '2026-04-01', '2026-05-01', 0x, 'Build robust AI models for healthcare.', 'https://globalai.example.com'),
(@HD2, 'Cyber Defense Challenge', 'Cybersecurity', 'Offline', 'Individual', NULL, 25000, '2026-06-20', '2026-05-01', '2026-06-10', 0x, 'Test your hacking and defense skills against the best.', 'https://cyberdef.example.com'),
(@HD3, 'Web3 Innovators', 'Blockchain', 'Online', 'Team', 3, 10000, '2026-04-10', '2026-03-01', '2026-03-31', 0x, 'Create decentralized apps using modern smart contracts.', 'https://web3innovators.example.com'),
(@HD4, 'Green Tech Hackathon', 'Environment', 'Offline', 'Team', 5, 15000, '2026-07-05', '2026-05-15', '2026-06-25', 0x, 'Develop solutions to combat climate change.', 'https://greentech.example.com'),
(@HD5, 'FinTech Revolution', 'Finance', 'Online', 'Team', 4, 30000, '2026-08-12', '2026-07-01', '2026-08-01', 0x, 'Next-generation financial tools for the unbanked.', 'https://fintechrev.example.com'),
(@HD6, 'Health & Wellness Hack', 'Healthcare', 'Offline', 'Individual', NULL, 5000, '2026-05-22', '2026-04-10', '2026-05-15', 0x, 'Apps that monitor and improve mental and physical wellness.', 'https://healthhack.example.com'),
(@HD7, 'Space Exploration Sprint', 'Aerospace', 'Online', 'Team', 6, 40000, '2026-09-01', '2026-07-01', '2026-08-20', 0x, 'Data analysis on NASA open datasets for exoplanet discovery.', 'https://spacesprint.example.com'),
(@HD8, 'EduTech Builders', 'Education', 'Offline', 'Team', 4, 12000, '2026-06-15', '2026-05-01', '2026-06-05', 0x, 'Tools to make remote learning interactive and fun.', 'https://edutechbuilders.example.com'),
(@HD9, 'Smart City Solutions', 'IoT', 'Online', 'Team', 3, 20000, '2026-07-20', '2026-06-01', '2026-07-10', 0x, 'Internet of Things solutions for smart traffic and waste management.', 'https://smartcity.example.com'),
(@HD10, 'Open Source Weekend', 'Open Source', 'Online', 'Individual', NULL, 2000, '2026-04-25', '2026-03-15', '2026-04-20', 0x, 'Contribute to open source tools and libraries.', 'https://osweekend.example.com'),
(@HD11, 'Game Jam 2026', 'GameDev', 'Offline', 'Team', 5, 15000, '2026-05-30', '2026-04-15', '2026-05-20', 0x, '48-hour game development marathon with a secret theme.', 'https://gamejam26.example.com'),
(@HD12, 'Quantum Computing Sprint', 'Quantum', 'Online', 'Team', 2, 60000, '2026-10-10', '2026-08-15', '2026-09-30', 0x, 'Write efficient quantum algorithms using Q#.', 'https://quantumhack.example.com'),
(@HD13, 'AR/VR Immersive Hack', 'AR/VR', 'Offline', 'Team', 4, 25000, '2026-08-05', '2026-06-01', '2026-07-25', 0x, 'Build immersive virtual reality experiences for training.', 'https://arvrhack.example.com'),
(@HD14, 'Data Sci-Fi', 'Data Science', 'Online', 'Individual', NULL, 8000, '2026-06-05', '2026-05-01', '2026-05-30', 0x, 'Predictive modeling on futuristic datasets.', 'https://datasci-fi.example.com'),
(@HD15, 'Accessibility First', 'Web Accessibility', 'Online', 'Team', 3, 10000, '2026-07-15', '2026-06-01', '2026-07-05', 0x, 'Redesign popular apps to be 100% accessible to disabled users.', 'https://accessfirst.example.com'),
(@HD16, 'AgriTech Future', 'Agriculture', 'Offline', 'Team', 4, 20000, '2026-09-20', '2026-08-01', '2026-09-10', 0x, 'Tech solutions for precision farming and yield prediction.', 'https://agritech.example.com'),
(@HD17, 'Code For Good', 'Social Impact', 'Online', 'Team', 5, 5000, '2026-05-08', '2026-04-01', '2026-05-01', 0x, 'Develop software for non-profits and charities.', 'https://codeforgood.example.com'),
(@HD18, 'Cloud Native Clash', 'DevOps', 'Online', 'Individual', NULL, 15000, '2026-08-25', '2026-07-01', '2026-08-15', 0x, 'Build and deploy scalable microservices using Kubernetes.', 'https://cloudnative.example.com'),
(@HD19, 'Automotive AI', 'Automotive', 'Offline', 'Team', 4, 35000, '2026-11-05', '2026-09-15', '2026-10-25', 0x, 'Machine vision for autonomous vehicle navigation.', 'https://automotiveai.example.com'),
(@HD20, 'React Native Challenge', 'Mobile Dev', 'Online', 'Team', 3, 12000, '2026-06-25', '2026-05-15', '2026-06-15', 0x, 'Build beautiful cross-platform mobile apps in 72 hours.', 'https://reactnativechallenge.example.com');

PRINT 'Successfully inserted 20 Hosts, 20 Participants and 20 HostHackathon records.';
