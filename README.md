# food-order-web
table ordering food web for mobile devices


-- run --

npm install

npm start



--your database--

create .env file that contains

DATABASE = database_name

DATABASE_HOST = localhost

DATABASE_USER = root

DATABASE_PASSWORD = if your xampp has password to mysql

you should create your own table of your database




///xss defense
escape 6 special character
&
<
>
'
"
/


//http only for cookie
// content security policy


//clickjacking
x-frame-option 
response.setHeader('X-Frame-Options', 'sameorigin')