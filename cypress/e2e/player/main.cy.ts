import { Context, PermissionLevel } from '@graasp/sdk';

import { START_INTERACTION_BUTTON_CY, buildDataCy } from '@/config/selectors';

describe('Player View', () => {
  beforeEach(() => {
    cy.setUpApi(
      {},
      {
        context: Context.Player,
        permission: PermissionLevel.Write,
      },
    );
    cy.visit('/');
  });

  it('App', () => {
    cy.get(buildDataCy(START_INTERACTION_BUTTON_CY)).should(
      'contain.text',
      `Start`,
    );
  });
});
