/**
 * Валидация E-Mail
 * @param email
 */
export function isEmail(email: string): boolean {
    const regEx = /[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,8}(.[a-z{2,8}])?/g;
    return regEx.test(email);
}