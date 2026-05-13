export const monitoringQueryKeys = {
  events: (storeId: number) => ["monitoring", "events", storeId] as const,
  event: (eventId: number) => ["monitoring", "event", eventId] as const,
  alerts: (storeId: number) => ["monitoring", "alerts", storeId] as const,
  alert: (alertId: number) => ["monitoring", "alert", alertId] as const,
  eventDetails: (eventId: number) => ["monitoring", "event-details", eventId] as const,
};
