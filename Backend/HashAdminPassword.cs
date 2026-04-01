using System;
using BCrypt.Net;

class Program
{
    static void Main()
    {
        string password = "pass-admin0005";
        string salt = BCrypt.Net.BCrypt.GenerateSalt(11);
        string hash = BCrypt.Net.BCrypt.HashPassword(password, salt);
        Console.WriteLine(hash);
    }
}
