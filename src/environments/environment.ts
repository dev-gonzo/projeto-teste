export const environment = {
  apiUrl: 'http://192.168.208.51:8081',
  secretKey: (typeof process !== 'undefined' ? process.env['SECRET_KEY'] : 'default_test_key')
};