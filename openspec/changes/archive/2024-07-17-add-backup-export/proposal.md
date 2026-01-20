# Proposal: Add Backup & Export

## Change ID
`add-backup-export`

## Summary
Implement the backup and restore system with ZIP backup files, CSV export, and data import functionality for complete data portability.

## Motivation
Users need data portability for:
- Safeguarding financial data
- Migrating to new devices
- Exporting for external analysis
- Complete data ownership

## Scope
- Full backup to ZIP file (JSON + attachments)
- Restore from ZIP backup
- Export transactions to CSV
- Import from CSV
- Data validation on import

## Prerequisites
- All Phase 1 and Phase 2 changes completed
- Database fully functional
- Settings screen completed

## Dependencies
- `expo-file-system` (already installed)
- `expo-sharing` (already installed)
- `expo-document-picker` (already installed)

## Risks
- **Large file handling**: Big backups may fail on low memory
- **CSV parsing edge cases**: Handle special characters, commas in fields
- **Attachment handling**: Base64 encoding increases file size

## Success Criteria
- [ ] Can create full backup ZIP
- [ ] Can restore from backup ZIP
- [ ] Can export transactions to CSV
- [ ] Can import from CSV
- [ ] Data validation catches errors
- [ ] Backup can be shared

## Related Specs
- `specs/data-management/spec.md` - Backup/Export UI/UX

