# TESTING

## Test Scenarios Executed

- AuthService: login normalizes email, verifies password, and returns signed JWT + public user.
- AuthService: rejects invalid password.
- AuthService: registers new users with normalized email and hashed password.
- AuthService: rejects duplicate registration.
- AuthService: rejects missing current user.

- ActionItemsService: trims title/description before create.
- ActionItemsService: rejects invalid due date.
- ActionItemsService: updates status when repository returns a result.
- ActionItemsService: rejects update when action item is missing.
- ActionItemsService: returns filtered list from repository.
- ActionItemsService: returns overdue list from repository.

- MeetingService: normalizes title and participants on create.
- MeetingService: rejects duplicate meeting title.
- MeetingService: rejects invalid meeting date.
- MeetingService: rejects empty participants.
- MeetingService: rejects missing transcript.
- MeetingService: rejects missing meeting ID.
- MeetingService: rejects missing meeting when fetching by ID.
- MeetingService: rejects invalid pagination.
- MeetingService: runs analysis and persists LLM response.
- MeetingService: rejects analysis when transcript is empty.

## Edge Cases Considered

- Auth: duplicate email, invalid password, missing current user.
- Meetings: duplicate title, invalid date, empty participants, missing transcript, missing meeting ID.
- Meetings: invalid pagination values (non-positive or non-integer).
- Analysis: empty transcript blocks LLM call.
- Action items: invalid due date, not-found status update.

## Limitations Discovered

- Only service-layer unit tests are covered; controllers, routes, and middleware are not unit-tested.
- Repository behavior is mocked; no integration tests against a real database.
- No tests for auth token expiration or refresh flows (not implemented).
