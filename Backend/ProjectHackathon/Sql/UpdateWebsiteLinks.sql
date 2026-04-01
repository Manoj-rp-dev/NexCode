-- Update WebsiteLinks for all 20 hackathons to real company domains
-- so the frontend can use Clearbit to fetch actual company logos

-- HD1: Tech Innovators -> Microsoft (AI Summit)
UPDATE HostHackathon SET WebsiteLink = 'https://microsoft.com' WHERE HackathonID = (SELECT H.HackathonID FROM HostHackathon H INNER JOIN Host Org ON H.HostID = Org.HostID WHERE Org.Username = 'alex_host');

-- HD2: State University -> MIT (Cyber Defense)
UPDATE HostHackathon SET WebsiteLink = 'https://mit.edu' WHERE HackathonID = (SELECT H.HackathonID FROM HostHackathon H INNER JOIN Host Org ON H.HostID = Org.HostID WHERE Org.Username = 'sarahs_univ');

-- HD3: DevOps Foundation -> GitHub (Web3 Innovators)
UPDATE HostHackathon SET WebsiteLink = 'https://github.com' WHERE HackathonID = (SELECT H.HackathonID FROM HostHackathon H INNER JOIN Host Org ON H.HostID = Org.HostID WHERE Org.Username = 'devorg_admin');

-- HD4: CFF NGO -> WWF (Green Tech)
UPDATE HostHackathon SET WebsiteLink = 'https://wwf.org' WHERE HackathonID = (SELECT H.HackathonID FROM HostHackathon H INNER JOIN Host Org ON H.HostID = Org.HostID WHERE Org.Username = 'cff_host');

-- HD5: Independent -> Stripe (FinTech)
UPDATE HostHackathon SET WebsiteLink = 'https://stripe.com' WHERE HackathonID = (SELECT H.HackathonID FROM HostHackathon H INNER JOIN Host Org ON H.HostID = Org.HostID WHERE Org.Username = 'priya_dv');

-- HD6: Data Science Labs -> IBM (Health & Wellness)
UPDATE HostHackathon SET WebsiteLink = 'https://ibm.com' WHERE HackathonID = (SELECT H.HackathonID FROM HostHackathon H INNER JOIN Host Org ON H.HostID = Org.HostID WHERE Org.Username = 'david_ds');

-- HD7: Polytechnic -> NASA (Space Exploration)
UPDATE HostHackathon SET WebsiteLink = 'https://nasa.gov' WHERE HackathonID = (SELECT H.HackathonID FROM HostHackathon H INNER JOIN Host Org ON H.HostID = Org.HostID WHERE Org.Username = 'maria_edu');

-- HD8: CyberSecurity Experts -> Palo Alto Networks (EduTech)
UPDATE HostHackathon SET WebsiteLink = 'https://paloaltonetworks.com' WHERE HackathonID = (SELECT H.HackathonID FROM HostHackathon H INNER JOIN Host Org ON H.HostID = Org.HostID WHERE Org.Username = 'cyber_admin');

-- HD9: Finance Tech Group -> Visa (Smart City)
UPDATE HostHackathon SET WebsiteLink = 'https://visa.com' WHERE HackathonID = (SELECT H.HackathonID FROM HostHackathon H INNER JOIN Host Org ON H.HostID = Org.HostID WHERE Org.Username = 'fintech_h');

-- HD10: Eco Tech -> Mozilla (Open Source Weekend)
UPDATE HostHackathon SET WebsiteLink = 'https://mozilla.org' WHERE HackathonID = (SELECT H.HackathonID FROM HostHackathon H INNER JOIN Host Org ON H.HostID = Org.HostID WHERE Org.Username = 'eco_host');

-- HD11: AI Research Lab -> OpenAI (Game Jam)
UPDATE HostHackathon SET WebsiteLink = 'https://openai.com' WHERE HackathonID = (SELECT H.HackathonID FROM HostHackathon H INNER JOIN Host Org ON H.HostID = Org.HostID WHERE Org.Username = 'james_ai');

-- HD12: Medical Research -> Google (Quantum Sprint)
UPDATE HostHackathon SET WebsiteLink = 'https://google.com' WHERE HackathonID = (SELECT H.HackathonID FROM HostHackathon H INNER JOIN Host Org ON H.HostID = Org.HostID WHERE Org.Username = 'health_admin');

-- HD13: Independent -> Meta (AR/VR Hack)
UPDATE HostHackathon SET WebsiteLink = 'https://meta.com' WHERE HackathonID = (SELECT H.HackathonID FROM HostHackathon H INNER JOIN Host Org ON H.HostID = Org.HostID WHERE Org.Username = 'elena_ind');

-- HD14: Blockchain Solutions -> Ethereum (Data Sci-Fi)
UPDATE HostHackathon SET WebsiteLink = 'https://ethereum.org' WHERE HackathonID = (SELECT H.HackathonID FROM HostHackathon H INNER JOIN Host Org ON H.HostID = Org.HostID WHERE Org.Username = 'web3_host');

-- HD15: Quantum Computing -> IBM Research (Accessibility First)
UPDATE HostHackathon SET WebsiteLink = 'https://research.ibm.com' WHERE HackathonID = (SELECT H.HackathonID FROM HostHackathon H INNER JOIN Host Org ON H.HostID = Org.HostID WHERE Org.Username = 'qf_admin');

-- HD16: Education For All -> Khan Academy (AgriTech Future)
UPDATE HostHackathon SET WebsiteLink = 'https://khanacademy.org' WHERE HackathonID = (SELECT H.HackathonID FROM HostHackathon H INNER JOIN Host Org ON H.HostID = Org.HostID WHERE Org.Username = 'eduhack_host');

-- HD17: Smart Farming -> John Deere (Code For Good)
UPDATE HostHackathon SET WebsiteLink = 'https://deere.com' WHERE HackathonID = (SELECT H.HackathonID FROM HostHackathon H INNER JOIN Host Org ON H.HostID = Org.HostID WHERE Org.Username = 'agri_host');

-- HD18: Virtual Reality Co -> Unity (Cloud Native Clash)
UPDATE HostHackathon SET WebsiteLink = 'https://unity.com' WHERE HackathonID = (SELECT H.HackathonID FROM HostHackathon H INNER JOIN Host Org ON H.HostID = Org.HostID WHERE Org.Username = 'vr_admin');

-- HD19: OSS Foundation -> Linux Foundation (Automotive AI)
UPDATE HostHackathon SET WebsiteLink = 'https://linuxfoundation.org' WHERE HackathonID = (SELECT H.HackathonID FROM HostHackathon H INNER JOIN Host Org ON H.HostID = Org.HostID WHERE Org.Username = 'oss_host');

-- HD20: Indie Games Studio -> Epic Games (React Native Challenge)
UPDATE HostHackathon SET WebsiteLink = 'https://epicgames.com' WHERE HackathonID = (SELECT H.HackathonID FROM HostHackathon H INNER JOIN Host Org ON H.HostID = Org.HostID WHERE Org.Username = 'gamedev_host');

PRINT 'WebsiteLinks updated to real company domains successfully.';
