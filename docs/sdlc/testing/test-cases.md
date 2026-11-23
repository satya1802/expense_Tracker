# Tests

> Maintained by QuorQ AI SDLC. Text between `sdlc:auto` markers is regenerated; anything outside them is yours and is kept.

<!-- sdlc:auto:start summary -->
66 tests · Passed 53 · Failed 8 · Skipped 0 · Not run 5

Acceptance criteria covered: 12/42 · passing: 5/42
<!-- sdlc:auto:end summary -->

<!-- sdlc:auto:start tests -->
## Sprint 1

### US-001: Sign up with email and password

| Criteria | Test | Level | Result | File |
|---|---|---|---|---|
| AC-003 | test_ac003_rejects_invalid_email_format | Unit | Passed | `backend/tests/unit/test_schemas.py` |
| AC-003 | test_ac003_rejects_password_shorter_than_eight_characters | Unit | Passed | `backend/tests/unit/test_schemas.py` |
| — | test_accepts_a_valid_email_and_password | Unit | Passed | `backend/tests/unit/test_schemas.py` |
| AC-009 | App > [AC-009] redirects an unauthenticated visit to a protected route to /sign-in without rendering it | Unit | Passed | `frontend/src/App.test.tsx` |
| — | App > renders a screen inside the app shell and shows its menu once /me confirms the session | Unit | Passed | `frontend/src/App.test.tsx` |
| AC-004 | SignIn > [AC-004] stores the returned token and nothing is pre-filled from a seeded account | Unit | Passed | `frontend/src/screens/SignIn.test.tsx` |
| AC-005 | SignIn > [AC-005] shows exactly one generic message on 401 and never names a field | Unit | Failed | `frontend/src/screens/SignIn.test.tsx` |
| AC-001 | test_ac001_signup_returns_201_and_password_hash_is_never_the_plaintext | Integration | Passed | `backend/tests/acceptance/test_accounts_sessions_isolation.py` |
| AC-002 | test_ac002_duplicate_email_signup_returns_409_and_creates_no_second_row | Integration | Passed | `backend/tests/acceptance/test_accounts_sessions_isolation.py` |
| AC-003 | test_ac003_invalid_email_returns_422_with_an_explanatory_field_message | Integration | Passed | `backend/tests/acceptance/test_accounts_sessions_isolation.py` |
| AC-003 | test_ac003_too_short_password_returns_422_with_an_explanatory_field_message | Integration | Passed | `backend/tests/acceptance/test_accounts_sessions_isolation.py` |
| AC-004 | test_ac004_login_with_correct_credentials_returns_a_usable_token | Integration | Passed | `backend/tests/acceptance/test_accounts_sessions_isolation.py` |
| AC-005 | test_ac005_wrong_password_and_unknown_email_return_byte_identical_401_bodies | Integration | Passed | `backend/tests/acceptance/test_accounts_sessions_isolation.py` |
| AC-006 | test_ac006_logout_revokes_the_session_for_a_data_endpoint | Integration | Passed | `backend/tests/acceptance/test_accounts_sessions_isolation.py` |
| AC-006 | test_ac006_logout_revokes_the_session_for_get_me | Integration | Passed | `backend/tests/acceptance/test_accounts_sessions_isolation.py` |
| AC-007 | test_ac007_idle_session_beyond_session_idle_minutes_returns_401_on_next_call | Integration | Passed | `backend/tests/acceptance/test_accounts_sessions_isolation.py` |
| AC-008 | test_ac008_user_a_token_never_returns_user_b_categories | Integration | Passed | `backend/tests/acceptance/test_accounts_sessions_isolation.py` |
| AC-009 | test_ac009_data_endpoints_reject_a_garbage_token | Integration | Passed | `backend/tests/acceptance/test_accounts_sessions_isolation.py` |
| AC-009 | test_ac009_data_endpoints_reject_requests_with_no_authorization_header | Integration | Passed | `backend/tests/acceptance/test_accounts_sessions_isolation.py` |
| AC-001 | test_ac001_signup_creates_account_and_returns_token_and_hashes_password | Integration | Passed | `backend/tests/integration/test_auth.py` |
| AC-002 | test_ac002_signup_duplicate_email_returns_409_and_creates_no_account | Integration | Passed | `backend/tests/integration/test_auth.py` |
| AC-003 | test_ac003_signup_invalid_email_returns_422_and_creates_no_account | Integration | Failed | `backend/tests/integration/test_auth.py` |
| AC-003 | test_ac003_signup_short_password_returns_422_and_creates_no_account | Integration | Passed | `backend/tests/integration/test_auth.py` |
| AC-004 | test_ac004_login_with_correct_credentials_returns_200_and_new_token | Integration | Passed | `backend/tests/integration/test_auth.py` |
| AC-005 | test_ac005_login_wrong_email_returns_same_401_generic_message | Integration | Passed | `backend/tests/integration/test_auth.py` |
| AC-005 | test_ac005_login_wrong_password_returns_401_generic_message | Integration | Failed | `backend/tests/integration/test_auth.py` |
| AC-006 | test_ac006_logout_revokes_session_and_token_reuse_returns_401 | Integration | Failed | `backend/tests/integration/test_auth.py` |
| AC-007 | test_ac007_idle_session_is_rejected_and_active_session_refreshes | Integration | Failed | `backend/tests/integration/test_auth.py` |
| AC-009 | test_ac009_me_rejects_missing_malformed_revoked_and_expired_tokens | Integration | Passed | `backend/tests/integration/test_auth.py` |
| AC-009 | test_ac009_me_returns_profile_for_valid_token | Integration | Passed | `backend/tests/integration/test_auth.py` |
| AC-009 | test_ac009_data_endpoints_answer_with_a_valid_token | Integration | Passed | `backend/tests/integration/test_routers.py` |
| AC-009 | test_ac009_data_endpoints_require_authentication | Integration | Passed | `backend/tests/integration/test_routers.py` |
| — | test_every_api_spec_path_is_registered | Integration | Passed | `backend/tests/integration/test_routers.py` |
| — | test_stub_routes_answer | Integration | Passed | `backend/tests/integration/test_routers.py` |

### US-009: Create a custom category

| Criteria | Test | Level | Result | File |
|---|---|---|---|---|
| AC-017 | test_ac017_require_name_strips_and_returns_a_usable_name | Unit | Passed | `backend/tests/unit/test_categories.py` |
| AC-018 | test_ac018_reject_duplicate_is_case_insensitive | Unit | Failed | `backend/tests/unit/test_categories.py` |
| AC-018 | test_ac018_require_name_rejects_blank_and_whitespace_only | Unit | Passed | `backend/tests/unit/test_categories.py` |
| — | test_reject_duplicate_allows_a_different_users_same_name | Unit | Passed | `backend/tests/unit/test_categories.py` |
| — | test_reject_duplicate_excludes_the_row_being_renamed | Unit | Passed | `backend/tests/unit/test_categories.py` |
| — | CategoriesBudgets > No seeded categories remain: the empty state renders when the API returns none | Unit | Passed | `frontend/src/screens/CategoriesBudgets.test.tsx` |
| AC-016 | CategoriesBudgets > [AC-016] renders the list from the GET /categories response | Unit | Passed | `frontend/src/screens/CategoriesBudgets.test.tsx` |
| AC-018 | CategoriesBudgets > [AC-018] a 409 on create shows the duplicate-name message without adding a row | Unit | Passed | `frontend/src/screens/CategoriesBudgets.test.tsx` |
| AC-018 | CategoriesBudgets > [AC-018] blocks a blank name client-side before any call is made | Unit | Passed | `frontend/src/screens/CategoriesBudgets.test.tsx` |
| AC-008 | test_ac008_two_accounts_with_a_same_named_custom_category_never_see_each_others_rows | Integration | Passed | `backend/tests/acceptance/test_categories_isolation.py` |
| AC-009 | test_ac009_get_categories_with_no_authorization_header_returns_401 | Integration | Passed | `backend/tests/acceptance/test_categories_isolation.py` |
| AC-016 | test_ac016_new_user_has_the_full_default_set_exactly_once_no_duplicates_on_repeated_startup | Integration | Passed | `backend/tests/acceptance/test_categories_isolation.py` |
| AC-008 | test_ac008_delete_category_removes_the_callers_own_row | Integration | Passed | `backend/tests/integration/test_categories.py` |
| AC-008 | test_ac008_patch_and_delete_another_users_category_returns_404 | Integration | Passed | `backend/tests/integration/test_categories.py` |
| AC-008 | test_ac008_patch_category_renames_the_callers_own_row | Integration | Passed | `backend/tests/integration/test_categories.py` |
| AC-009 | test_ac009_categories_endpoints_require_a_valid_bearer_token | Integration | Passed | `backend/tests/integration/test_categories.py` |
| AC-016, AC-008 | test_ac016_ac008_get_categories_returns_only_callers_rows_ordered_by_name | Integration | Passed | `backend/tests/integration/test_categories.py` |
| AC-016 | test_ac016_signup_provisions_default_categories | Integration | Failed | `backend/tests/integration/test_categories.py` |
| AC-017 | test_ac017_create_category_returns_201_and_is_usable | Integration | Failed | `backend/tests/integration/test_categories.py` |
| AC-018 | test_ac018_create_category_duplicate_name_case_insensitive_returns_409_and_creates_nothing | Integration | Passed | `backend/tests/integration/test_categories.py` |
| AC-018 | test_ac018_create_category_with_blank_name_returns_422_and_creates_nothing | Integration | Passed | `backend/tests/integration/test_categories.py` |
| AC-016 | [AC-016] a freshly registered account sees its default categories with no setup step | E2E | Not run yet | `frontend/e2e/categories.spec.ts` |
| AC-017 | [AC-017] creating a category with a new name saves it and it appears in the list | E2E | Not run yet | `frontend/e2e/categories.spec.ts` |
| AC-018 | [AC-018] submitting a blank category name shows a validation message and adds no row | E2E | Not run yet | `frontend/e2e/categories.spec.ts` |
| AC-018 | [AC-018] submitting a name duplicating an existing category shows a validation message and adds no row | E2E | Not run yet | `frontend/e2e/categories.spec.ts` |

## Project setup

| Criteria | Test | Level | Result | File |
|---|---|---|---|---|
| — | test_hash_password_round_trips | Unit | Passed | `backend/tests/unit/test_security.py` |
| — | test_verify_password_rejects_wrong_password | Unit | Passed | `backend/tests/unit/test_security.py` |
| — | test_seeds_admin_and_smoke_user_idempotently | Unit | Passed | `backend/tests/unit/test_seed.py` |
| — | test_seeds_nothing_when_no_env_vars_are_set | Unit | Passed | `backend/tests/unit/test_seed.py` |
| — | test_health_reports_ok | Integration | Passed | `backend/tests/integration/test_health.py` |
| — | test_the_openapi_document_builds | Integration | Passed | `backend/tests/integration/test_health.py` |
| — | the app loads | E2E | Not run yet | `frontend/e2e/example.spec.ts` |
<!-- sdlc:auto:end tests -->
