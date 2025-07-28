namespace ManagementApp.Constants
{
    public static class UserRoles
    {
        public const string Admin = "Admin";
        public const string User = "User";
        public const string Manager = "Manager";
    }

    public static class MatchStatus
    {
        public const string Completed = "COMPLETED";
        public const string Pending = "PENDING";
        public const string Cancelled = "CANCELLED";
    }

    public static class TimeOfDay
    {
        public const string AM = "AM";
        public const string PM = "PM";
    }

    public static class EventTypes
    {
        public const string Meeting = "meeting";
        public const string Task = "task";
        public const string Reminder = "reminder";
        public const string Other = "other";
    }
}
