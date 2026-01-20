# Proposal: Add Account Management

## Change ID
`add-account-management`

## Summary
Implement the account management system allowing users to create, edit, and manage multiple financial accounts (Cash, Bank, Credit Card, etc.) with balance tracking and transfers.

## Motivation
Users need to track finances across multiple accounts. The account system provides:
- Separate tracking for different wallets/banks/cards
- Account-specific transaction filtering
- Transfer functionality between accounts
- Balance overview across all accounts

## Scope
- Accounts list screen
- Add Account screen
- Edit Account screen
- Account detail screen (transaction history per account)
- Account card component
- Transfer between accounts functionality

## Prerequisites
- `add-core-foundation` change must be completed
- `add-transaction-management` change should be completed (for account selector)

## Dependencies
- `database/operations/accounts.ts`
- `database/operations/transactions.ts` (for transfers)

## Risks
- **Transfer complexity**: Dual account balance updates must be atomic
- **Currency handling**: Different currencies per account need consideration

## Success Criteria
- [x] Can create new account with type, currency, icon, color
- [x] Account appears in Accounts list
- [x] Can edit account details
- [x] Can archive (soft delete) account
- [x] Can view transactions filtered by account
- [x] Can transfer between accounts
- [x] Total balance shows across all accounts

## Related Specs
- `specs/accounts/spec.md` - Account UI/UX

