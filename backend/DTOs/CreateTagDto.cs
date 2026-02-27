namespace AlbanianQuora.Api.DTOs
{
    public class CreateTagDto
    {
        public string Name { get; set; } = "";
        public int CategoryId { get; set; }
    }
}
