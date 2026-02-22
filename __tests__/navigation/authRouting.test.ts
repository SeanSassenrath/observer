/**
 * Tests for auth-based routing logic.
 * Extracts the getInitialRouteName logic from Stack.tsx and tests it directly.
 */

import {User, initialUserState} from '../../src/contexts/userData';

// Replicate the routing logic from Stack.tsx getInitialRouteName()
function getInitialRouteName(user: User): string {
  if (user.uid.length <= 0) {
    return 'PurchaseOnboarding';
  } else if (!user.termsAgreement?.hasAccepted) {
    return 'TermsAgreement';
  } else {
    return 'TabNavigation';
  }
}

describe('Auth routing - getInitialRouteName', () => {
  it('routes unauthenticated user (empty uid) to PurchaseOnboarding', () => {
    const user = {...initialUserState, uid: ''};
    expect(getInitialRouteName(user)).toBe('PurchaseOnboarding');
  });

  it('routes authenticated user without terms to TermsAgreement', () => {
    const user: User = {
      ...initialUserState,
      uid: 'test-uid-123',
      termsAgreement: undefined,
    };
    expect(getInitialRouteName(user)).toBe('TermsAgreement');
  });

  it('routes authenticated user with unaccepted terms to TermsAgreement', () => {
    const user: User = {
      ...initialUserState,
      uid: 'test-uid-123',
      termsAgreement: {hasAccepted: false, date: ''},
    };
    expect(getInitialRouteName(user)).toBe('TermsAgreement');
  });

  it('routes fully onboarded user to TabNavigation', () => {
    const user: User = {
      ...initialUserState,
      uid: 'test-uid-123',
      termsAgreement: {hasAccepted: true, date: '2024-01-01'},
    };
    expect(getInitialRouteName(user)).toBe('TabNavigation');
  });
});
