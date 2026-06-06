/// <reference types="jest" />
import { calculateDynamicTotalCost } from "../utils/pricingEngine";

describe("Pengujian Dynamic Pricing Engine", () => {
  const hargaDasar = 100000; // Rp 100.000 per malam
  const kenaikanWeekend = 1.2; // +20% (Rp 120.000)

  test("1. Harus menghitung tarif normal untuk 2 malam di hari kerja (Weekday)", () => {
    const checkIn = "2026-06-08";  // Senin
    const checkOut = "2026-06-10"; // Rabu

    const total = calculateDynamicTotalCost(checkIn, checkOut, hargaDasar, kenaikanWeekend);
    expect(total).toBe(200000); // 2 malam x 100.000
  });

  test("2. Harus menaikkan tarif sebesar 20% jika menginap full di akhir pekan (Weekend)", () => {
    const checkIn = "2026-06-13";  // Sabtu
    const checkOut = "2026-06-15"; // Senin

    const total = calculateDynamicTotalCost(checkIn, checkOut, hargaDasar, kenaikanWeekend);
    expect(total).toBe(240000); // Sabtu (120k) + Minggu (120k)
  });

  test("3. Harus menggabungkan tarif weekday dan weekend secara proporsional", () => {
    const checkIn = "2026-06-11";  // Kamis
    const checkOut = "2026-06-15"; // Senin (Total 4 malam)

    const total = calculateDynamicTotalCost(checkIn, checkOut, hargaDasar, kenaikanWeekend);
    // Kamis (100k) + Jumat (100k) + Sabtu (120k) + Minggu (120k) = 440.000
    expect(total).toBe(440000);
  });
});