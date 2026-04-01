-- Insert 20 dummy Hosts
INSERT INTO Host (HostName, HostType, OrganizationName, Email, Country, City, Username, UserPassword) VALUES
('Alex Johnson', 'Company', 'Tech Innovators', 'alex@techinnovators.com', 'USA', 'San Francisco', 'alex.host', 'Welcome!123'),
('Sarah Smith', 'Institution', 'State University', 'sarah.s@stateu.edu', 'USA', 'Boston', 'sarahs_univ', 'Welcome!123'),
('DevOrg Inc', 'Company', 'DevOps Foundation', 'info@devorg.com', 'UK', 'London', 'devorg_admin', 'Welcome!123'),
('Code For Future', 'Non-profit', 'CFF NGO', 'contact@cff.org', 'Canada', 'Toronto', 'cff_host', 'Welcome!123'),
('Priya Patel', 'Individual', 'Independent', 'priya.dev@example.com', 'India', 'Bangalore', 'priya_dv', 'Welcome!123'),
('David Chen', 'Company', 'Data Science Labs', 'david.c@dslabs.io', 'Singapore', 'Singapore', 'david_ds', 'Welcome!123'),
('Maria Garcia', 'Institution', 'Polytechnic Institute', 'mgarcia@polytech.edu', 'Spain', 'Madrid', 'maria_edu', 'Welcome!123'),
('Cyber Shield', 'Company', 'CyberSecurity Experts', 'hello@cybershield.com', 'Israel', 'Tel Aviv', 'cyber_admin', 'Welcome!123'),
('Fintech Hackers', 'Company', 'Finance Tech Group', 'hackathons@fintech.group', 'UK', 'London', 'fintech_h', 'Welcome!123'),
('Green Earth Tech', 'Non-profit', 'Eco Tech', 'events@greentherth.org', 'Australia', 'Sydney', 'eco_host', 'Welcome!123'),
('James Wilson', 'Company', 'AI Research Lab', 'j.wilson@airesearch.com', 'USA', 'Austin', 'james_ai', 'Welcome!123'),
('Health Innovate', 'Institution', 'Medical Research Center', 'innovate@medicalrc.edu', 'USA', 'Chicago', 'health_admin', 'Welcome!123'),
('Elena Rodriguez', 'Individual', 'Independent', 'elena.r@example.com', 'Mexico', 'Mexico City', 'elena_ind', 'Welcome!123'),
('Web3 Pioneers', 'Company', 'Blockchain Solutions', 'contact@web3pioneers.io', 'Switzerland', 'Zug', 'web3_host', 'Welcome!123'),
('Quantum Future', 'Institution', 'Quantum Computing Institute', 'info@quantumfuture.org', 'Germany', 'Munich', 'qf_admin', 'Welcome!123'),
('EduHack', 'Non-profit', 'Education For All', 'events@eduhack.org', 'South Africa', 'Cape Town', 'eduhack_host', 'Welcome!123'),
('AgriTech Solutions', 'Company', 'Smart Farming', 'admin@agritech.com', 'Netherlands', 'Amsterdam', 'agri_host', 'Welcome!123'),
('VR Immersive', 'Company', 'Virtual Reality Co', 'events@vrimmersive.com', 'Japan', 'Tokyo', 'vr_admin', 'Welcome!123'),
('Open Source Society', 'Non-profit', 'OSS Foundation', 'host@osssociety.org', 'France', 'Paris', 'oss_host', 'Welcome!123'),
('GameDev Masters', 'Company', 'Indie Games Studio', 'jams@gamedevmasters.com', 'Sweden', 'Stockholm', 'gamedev_host', 'Welcome!123');

-- Insert 20 dummy Participants
INSERT INTO Participants (Firstname, Lastname, Email, Dob, Degree, Collegename, Username, UserPassword) VALUES
('Michael', 'Brown', 'michael.b@example.com', '2001-03-12', 'B.Sc Computer Science', 'MIT', 'michael_b', 'Pword123!'),
('Emily', 'Davis', 'emily.d@example.com', '2000-07-24', 'B.Tech Information Tech', 'Stanford University', 'emily_d', 'Pword123!'),
('Daniel', 'Miller', 'daniel.m@example.com', '1999-11-05', 'M.Sc Software Engineering', 'Carnegie Mellon', 'daniel_m', 'Pword123!'),
('Sophia', 'Wilson', 'sophia.w@example.com', '2002-01-18', 'B.E Artificial Intelligence', 'UC Berkeley', 'sophia_w', 'Pword123!'),
('Matthew', 'Moore', 'matthew.m@example.com', '2000-09-30', 'B.Sc Data Science', 'University of Washington', 'matthew_m', 'Pword123!'),
('Isabella', 'Taylor', 'isabella.t@example.com', '2001-05-22', 'B.Tech Cyber Security', 'Georgia Tech', 'isabella_t', 'Pword123!'),
('William', 'Anderson', 'william.a@example.com', '1998-12-14', 'M.Sc Computer Science', 'University of Illinois', 'william_a', 'Pword123!'),
('Olivia', 'Thomas', 'olivia.t@example.com', '2002-08-09', 'B.Sc Computer Engineering', 'Purdue University', 'olivia_t', 'Pword123!'),
('Alexander', 'Jackson', 'alexander.j@example.com', '2000-04-27', 'B.E Software Engineering', 'University of Michigan', 'alex_j', 'Pword123!'),
('Ava', 'White', 'ava.w@example.com', '2001-10-15', 'B.Tech Computer Science', 'Cornell University', 'ava_w', 'Pword123!'),
('Ethan', 'Harris', 'ethan.h@example.com', '1999-02-03', 'M.Sc Information Systems', 'NYU', 'ethan_h', 'Pword123!'),
('Mia', 'Martin', 'mia.m@example.com', '2002-06-20', 'B.Sc Data Analytics', 'Columbia University', 'mia_m', 'Pword123!'),
('James', 'Thompson', 'james.t@example.com', '2000-11-11', 'B.A Computer Science', 'Harvard University', 'james_t', 'Pword123!'),
('Charlotte', 'Garcia', 'charlotte.g@example.com', '2001-01-05', 'B.Tech AI & Data Science', 'UCLA', 'charlotte_g', 'Pword123!'),
('Benjamin', 'Martinez', 'benjamin.m@example.com', '1998-08-28', 'M.Sc Cyber Security', 'UT Austin', 'benjamin_m', 'Pword123!'),
('Amelia', 'Robinson', 'amelia.r@example.com', '2002-03-17', 'B.Sc Software Engineering', 'University of Toronto', 'amelia_r', 'Pword123!'),
('Lucas', 'Clark', 'lucas.c@example.com', '2000-07-08', 'B.E Electronics & Comm', 'University of Waterloo', 'lucas_c', 'Pword123!'),
('Harper', 'Rodriguez', 'harper.r@example.com', '2001-12-02', 'B.Tech Information Science', 'University of British Columbia', 'harper_r', 'Pword123!'),
('Henry', 'Lewis', 'henry.l@example.com', '1999-05-19', 'M.Sc Computer Engineering', 'Imperial College London', 'henry_l', 'Pword123!'),
('Evelyn', 'Lee', 'evelyn.l@example.com', '2002-09-26', 'B.Sc Computer Science', 'National University of Singapore', 'evelyn_l', 'Pword123!');

PRINT 'Successfully inserted 20 Hosts and 20 Participants records.';
