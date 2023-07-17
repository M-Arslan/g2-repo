import { ensureNonEmptyString } from '../../../Utility/rules';
import { FormFormatter } from './FormFormatter';

export const None = new FormFormatter((v) => v);

export const IsoDate = (old, nw) => (nw instanceof Date ? nw : (ensureNonEmptyString(nw) ? (new Date(nw)).toISOString() : ''));

