
## Project Overview

This is a Skills (Laravel, MySQL, Vue.js) Assessment Test project.

## Tech Stack:

1. PHP (^7.3) and Laravel (^8.54) - Used for all the back-end operations
2. VueJS 2 (https://vuejs.org/v2/guide/) - Used for all front-end operations, did not use any other library or addon, anything not included with vue will have to be done with Vanilla js (http://vanilla-js.com/)
3. SCSS (https://sass-lang.com/documentation/syntax#scss) with the BEM standard (http://getbem.com/introduction/) - Used for all (except the autentication form) the styling.

Please note that I have used laravel/breeze starter kit for user authentication system. With this library, the Tailwind CSS has been included but it's only being used in login form.

### Prerequisite

- PHP (^7.3)
- Laravel Framework (^8.54)
- MySQL
- Node (at least v12.14.1)
- Composer

### Instalation

Copy .env.example file to .env and make necessary changes accordingly. The run following commands on Terminal.

- composer install
- npm install
- npm run dev
- php artisan migrate
- php artisan db:seed
- php artisan serve

## Login

After running the db:seed there will be 10 users inserted in to users table. Just pick one email address from there as login, and use "password" keyword as password.

