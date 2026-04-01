DECLARE @NewHostID INT;

-- Insert a dummy Host organization
INSERT INTO Host (HostName, HostType, OrganizationName, Email, Country, City, Username, UserPassword)
VALUES ('Tech Innovations', 'Company', 'Global Tech', 'contact@globaltech.com', 'USA', 'San Francisco', 'globaltech_admin', 'Pass123!');

SET @NewHostID = SCOPE_IDENTITY();

-- Insert 20 dummy Hackathons
INSERT INTO HostHackathon (HostID, HackathonName, HackathonType, Mode, ParticipationType, PrizePool, EventDate, ImageData, Description, WebsiteLink) VALUES
(@NewHostID, 'Global AI Summit 2026', 'AI/ML', 'Online', 'Team', 50000, '2026-05-15', 0x, 'Build robust AI models for healthcare.', 'https://globalai.example.com'),
(@NewHostID, 'Cyber Defense Challenge', 'Cybersecurity', 'Offline', 'Individual', 25000, '2026-06-20', 0x, 'Test your hacking and defense skills against the best.', 'https://cyberdef.example.com'),
(@NewHostID, 'Web3 Innovators', 'Blockchain', 'Online', 'Team', 10000, '2026-04-10', 0x, 'Create decentralized apps using modern smart contracts.', 'https://web3innovators.example.com'),
(@NewHostID, 'Green Tech Hackathon', 'Environment', 'Offline', 'Team', 15000, '2026-07-05', 0x, 'Develop solutions to combat climate change.', 'https://greentech.example.com'),
(@NewHostID, 'FinTech Revolution', 'Finance', 'Online', 'Team', 30000, '2026-08-12', 0x, 'Next-generation financial tools for the unbanked.', 'https://fintechrev.example.com'),
(@NewHostID, 'Health & Wellness Hack', 'Healthcare', 'Offline', 'Individual', 5000, '2026-05-22', 0x, 'Apps that monitor and improve mental and physical wellness.', 'https://healthhack.example.com'),
(@NewHostID, 'Space Exploration Sprint', 'Aerospace', 'Online', 'Team', 40000, '2026-09-01', 0x, 'Data analysis on NASA open datasets for exoplanet discovery.', 'https://spacesprint.example.com'),
(@NewHostID, 'EduTech Builders', 'Education', 'Offline', 'Team', 12000, '2026-06-15', 0x, 'Tools to make remote learning interactive and fun.', 'https://edutechbuilders.example.com'),
(@NewHostID, 'Smart City Solutions', 'IoT', 'Online', 'Team', 20000, '2026-07-20', 0x, 'Internet of Things solutions for smart traffic and waste management.', 'https://smartcity.example.com'),
(@NewHostID, 'Open Source Weekend', 'Open Source', 'Online', 'Individual', 2000, '2026-04-25', 0x, 'Contribute to open source tools and libraries.', 'https://osweekend.example.com'),
(@NewHostID, 'Game Jam 2026', 'GameDev', 'Offline', 'Team', 15000, '2026-05-30', 0x, '48-hour game development marathon with a secret theme.', 'https://gamejam26.example.com'),
(@NewHostID, 'Quantum Computing Sprint', 'Quantum', 'Online', 'Team', 60000, '2026-10-10', 0x, 'Write efficient quantum algorithms using Q#.', 'https://quantumhack.example.com'),
(@NewHostID, 'AR/VR Immersive Hack', 'AR/VR', 'Offline', 'Team', 25000, '2026-08-05', 0x, 'Build immersive virtual reality experiences for training.', 'https://arvrhack.example.com'),
(@NewHostID, 'Data Sci-Fi', 'Data Science', 'Online', 'Individual', 8000, '2026-06-05', 0x, 'Predictive modeling on futuristic datasets.', 'https://datasci-fi.example.com'),
(@NewHostID, 'Accessibility First', 'Web Accessibility', 'Online', 'Team', 10000, '2026-07-15', 0x, 'Redesign popular apps to be 100% accessible to disabled users.', 'https://accessfirst.example.com'),
(@NewHostID, 'AgriTech Future', 'Agriculture', 'Offline', 'Team', 20000, '2026-09-20', 0x, 'Tech solutions for precision farming and yield prediction.', 'https://agritech.example.com'),
(@NewHostID, 'Code For Good', 'Social Impact', 'Online', 'Team', 5000, '2026-05-08', 0x, 'Develop software for non-profits and charities.', 'https://codeforgood.example.com'),
(@NewHostID, 'Cloud Native Clash', 'DevOps', 'Online', 'Individual', 15000, '2026-08-25', 0x, 'Build and deploy scalable microservices using Kubernetes.', 'https://cloudnative.example.com'),
(@NewHostID, 'Automotive AI', 'Automotive', 'Offline', 'Team', 35000, '2026-11-05', 0x, 'Machine vision for autonomous vehicle navigation.', 'https://automotiveai.example.com'),
(@NewHostID, 'React Native Challenge', 'Mobile Dev', 'Online', 'Team', 12000, '2026-06-25', 0x, 'Build beautiful cross-platform mobile apps in 72 hours.', 'https://reactnativechallenge.example.com');

PRINT 'Successfully inserted 1 Host and 20 HostHackathon records.';
