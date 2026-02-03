using AdminService.Data;
using AdminService.Services;
using AdminService.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// ---------------- BASIC SERVICES ----------------

builder.Services.AddControllers();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// MySQL DbContext (from ENV via appsettings.json)
var conn = builder.Configuration.GetConnectionString("DefaultConnection");

builder.Services.AddDbContext<AdminDbContext>(options =>
    options.UseMySql(
        conn,
        ServerVersion.AutoDetect(conn)
    )
);


// Register Admin service
builder.Services.AddScoped<IAdminService, AdminService.Services.AdminService>();
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll",
        policy => policy
            .AllowAnyOrigin()
            .AllowAnyMethod()
            .AllowAnyHeader());
});


var app = builder.Build();

// ---------------- PIPELINE ----------------

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseCors("AllowAll");


app.MapControllers();

app.Run();
