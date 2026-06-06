export const calculateDynamicTotalCost = (
  checkIn: string,
  checkOut: string,
  basePricePerNight: number,
  weekendMultiplier: number
): number => {
  const start = new Date(checkIn);
  const end = new Date(checkOut);
  
  let totalCost = 0;
  let current = new Date(start);

  while (current < end) {
    const dayOfWeek = current.getDay(); 
    const isWeekend = dayOfWeek === 5 || dayOfWeek === 6; // 5 = Jumat, 6 = Sabtu

    if (isWeekend) {
      totalCost += basePricePerNight * weekendMultiplier;
    } else {
      totalCost += basePricePerNight;
    }

    current.setDate(current.getDate() + 1);
  }

  return totalCost;
};