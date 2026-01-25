using System.Threading.Tasks;

namespace AdminService.Services.Interfaces
{
    public interface IDashboardService
    {
        Task<object> GetDashboardDataAsync();
    }
}