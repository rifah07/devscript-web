// Bengali Unicode block. Text containing it gets lang="bn", so CSS can
// switch to the Bangla font and a taller line-height, and screen readers
// pronounce it correctly.
const BENGALI = /[ঀ-৿]/;

export const langOf = (text: string): 'bn' | undefined => (BENGALI.test(text) ? 'bn' : undefined);
