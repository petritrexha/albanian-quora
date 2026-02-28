using System.Security.Cryptography;
using System.Text;

namespace AlbanianQuora.Api.Security;

public static class OtpService
{
    public static string GenerateCode()
    {
        return RandomNumberGenerator.GetInt32(0, 1_000_000).ToString("D6");
    }

    public static byte[] GenerateSalt(int size = 16)
    {
        return RandomNumberGenerator.GetBytes(size);
    }

    public static byte[] Hash(string code, byte[] salt)
    {
        using var hmac = new HMACSHA256(salt);
        return hmac.ComputeHash(Encoding.UTF8.GetBytes(code));
    }

    public static bool Verify(string code, byte[] salt, byte[] expectedHash)
    {
        var computed = Hash(code, salt);
        return CryptographicOperations.FixedTimeEquals(computed, expectedHash);
    }
}