$insertAt = 1169
$lines = Get-Content src/lib/gameData2.ts
$before = $lines[0..($insertAt-1)]
$after = $lines[$insertAt..($lines.Length-1)]
