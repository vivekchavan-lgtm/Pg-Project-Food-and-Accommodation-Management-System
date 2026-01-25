using System.Net.Http;
using System.Net.Http.Json;
using System.Threading.Tasks;
using System.Collections.Generic;
using AdminService.Services.Interfaces;

namespace AdminService.Services
{
    public class DashboardService : IDashboardService
    {
        private readonly HttpClient _http;

        public DashboardService(HttpClient http)
        {
            _http = http;
        }

        private async Task<int> GetCount<T>(string url)
        {
            var list = await _http.GetFromJsonAsync<List<T>>(url);
            return list?.Count ?? 0;
        }

        public async Task<object> GetDashboardDataAsync()
        {
            var totalPGs = await GetCount<object>(
                "http://localhost:8080/api/owner/pg"
            );

            var totalMess = await GetCount<object>(
                "http://localhost:8080/api/owner/mess"
            );

            return new
            {
                totalPGs,
                totalMess
            };
        }
    }
}