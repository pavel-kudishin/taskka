add-migration -Context TaskkaDbContext -Project Taskka.Core -verbose
Remove-Migration -Context TaskkaDbContext -Project Taskka.Core
Script-Migration -Idempotent -Context TaskkaDbContext -Project Taskka.Core

