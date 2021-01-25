import {rest} from 'msw';

import {FX_API_BASE} from '../settings';

export const handlers = [rest.get(FX_API_BASE + 'latest/', handleFxRequest)];

/** Handles request for FX rates with reasonable fake values */
function handleFxRequest(req: any, res: any, ctx: any) {
  return res(ctx.json({rates: {CAD: 1.74, EUR: 1.13, USD: 1.36}}));
}
