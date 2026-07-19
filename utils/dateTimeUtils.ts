/**
 * Utility to parse appointment time strings into Date objects
 * Supports formats like "Today 4:00 PM" and "Tomorrow 10:00 AM"
 */
export const parseAppointmentTime = (timeStr: string): Date => {
  const now = new Date();
  const date = new Date();
  
  const isTomorrow = timeStr.toLowerCase().includes('tomorrow');
  if (isTomorrow) {
    date.setDate(now.getDate() + 1);
  }
  
  // Extract time like "4:00 PM"
  const timeMatch = timeStr.match(/(\d+):(\d+)\s*(AM|PM)/i);
  if (timeMatch) {
    let hours = parseInt(timeMatch[1], 10);
    const minutes = parseInt(timeMatch[2], 10);
    const ampm = timeMatch[3].toUpperCase();
    
    if (ampm === 'PM' && hours < 12) hours += 12;
    if (ampm === 'AM' && hours === 12) hours = 0;
    
    date.setHours(hours, minutes, 0, 0);
  } else {
    // Default to 1 hour from now if parsing fails
    date.setHours(now.getHours() + 1);
  }
  
  return date;
};
