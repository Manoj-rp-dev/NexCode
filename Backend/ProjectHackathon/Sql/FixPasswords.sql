-- Fix all participant passwords to Welcome!123
-- BCrypt hash for "Welcome!123"
UPDATE Participants SET UserPassword = '$2a$11$k.j.EKGAeYEDuuOyKorXSO1neoMO6u9qU97vcQFiLht6XDtkULQm2';

SELECT LEN(UserPassword) AS HashLen, LEFT(UserPassword, 10) AS HashStart FROM Participants WHERE Username = 'michael_b';
PRINT 'Passwords updated. Login with: Username=michael_b, Password=Welcome!123';
