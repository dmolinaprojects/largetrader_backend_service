/* eslint-disable no-useless-escape */
export const UsernameRegex = /^[\w.]{2,}$/i;

export const EmailRegex = /(^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$)/i;

export const NameRegex = /^([\w]+(\.|'){0,1}[\w]*)(\s[\w]+(\.|'){0,1}[\w]*)*$/i;

export const StartQuoteRegex = /^['"]/g;

export const EndQuoteRegex = /['"]$/g;
