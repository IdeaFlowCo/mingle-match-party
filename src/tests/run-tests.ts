
import { beforeAll } from 'vitest';

// Global test setup
beforeAll(() => {
  console.log('Starting test suite...');
});

// Import all test files to be run
import './auth/authHelpers.test';
import './auth/AuthModal.test';
import './auth/LoginForm.test';

// Note: You can run these tests using:
// npx vitest run
// (this doesn't require package.json modification)
