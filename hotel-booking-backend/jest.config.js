module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  // Membatasi Jest agar HANYA mencari file test di dalam folder src
  roots: ["<rootDir>/src"], 
  // Memastikan Jest mengabaikan folder build/dist agar tidak terjadi test ganda
  testPathIgnorePatterns: ["/node_modules/", "/dist/"],
};