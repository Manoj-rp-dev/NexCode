-- Restore Manoj0005's password to Manoj@2005
UPDATE Participants SET UserPassword = '$2a$11$qeyjfUgfkd9cF6QtkZaSu.wV139MI7S1lDDUhCyB4WiLs0BGz305y' WHERE Username = 'Manoj0005';

SELECT LEN(UserPassword) AS HashLen, LEFT(UserPassword,10) AS HashStart FROM Participants WHERE Username = 'Manoj0005';
PRINT 'Password restored for Manoj0005';
