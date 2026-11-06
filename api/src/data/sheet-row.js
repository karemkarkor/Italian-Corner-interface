export function rowToRecord(headers, row) {
  const entries = [];

  headers.map((h, i) => {
    const r = row[i] ?? "";
    entries.push([h, r]);
  });

  return Object.fromEntries(entries);
}
