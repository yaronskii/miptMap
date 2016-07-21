<!DOCTYPE html>
<html>
   <head>
      <meta charset="utf-8" />
      <title>
         Регистрация
      </title>
   </head>
   <body>

   <?php
   $dblocation = "localhost"; // Имя сервера
   $dbuser = "root";          // Имя пользователя
   $dbpasswd = "1";            // Пароль
   $dbcnx = @mysql_connect($dblocation,$dbuser,$dbpasswd);
   if (!$dbcnx) // Если дескриптор равен 0 соединение не установлено
   {
     echo("<P>В настоящий момент сервер базы данных не доступен, поэтому 
              корректное отображение страницы невозможно.</P>");
     exit();
   }
   ?>

   <script language = "php">
      //register
      //Подключение к MySQL
      $dblocation = "localhost"; // Имя сервера
      $dbuser = "root";          // Имя пользователя
      $dbpasswd = "1";            // Пароль
      $dbcnx = @mysql_connect($dblocation,$dbuser,$dbpasswd);
      if (!$dbcnx) // Если дескриптор равен 0 соединение не установлено
      {
        echo("<P>В настоящий момент сервер базы данных не доступен, поэтому корректное отображение страницы невозможно.</P>");
        exit();
      }
      mysql_connect("localhost", "root", "1") or die(mysql_error); 
      //Подключение к базе данных deskside
      mysql_select_db("deskside") or die(mysql_error); 
      $find_id_sql = mysql_query("SELECT * FROM users ORDER BY id ASC"); 
      $find_id_row = mysql_num_rows($find_id_sql);
      $find_names = mysql_query("SELECT * FROM users WHERE login='".$_POST['login']."'");
      $find_row = mysql_num_rows($find_names);
      $id_counter = 1;
   //Вычисление последнего ID
      while ($find_id_row = mysql_fetch_assoc($find_id_sql)){
         $id_counter += 1;
      }
      $user_already = false; //Проверка, есть ли уже такой пользователь
      if ($_POST['register'])
      {
         while($find_row == mysql_fetch_assoc($find_names))
         {
            //Проверка, есть ли уже такой пользователь
            if ($find_row['login'] == $_POST['login']){
               $user_already = true;  //Если есть, то так и пишем
            }
         }
         if($user_already){
            echo "
         <p>
            Такой пользователь уже есть <br /> <a href=\"http://localhost/register.htm\">Пройти регистрацию заново... </a>
         </p>
            "; 
         }
         else
         {
            //Если такого пользователя всё-таки нет, то регистрируем нового пользователя с таким именем
            if ($_POST['password'] == $_POST['second_password'])
            {
               //Проверка совпадений паролей
               //Совпали: 
               echo "Регистрация проведена успешно";
               $md5_password = md5($_POST['password']); //Хэширование пароля для базы данных
               mysql_query("INSERT INTO users (`id`, `login`, `password`, `e-mail`, `name`) VALUES ('".$id_counter."', '".$_POST['login']."', '".$md5_password."', '".$_POST['e-mail']."', '".$_POST['name']."')"); 
            }
            else
            {
               echo "
         <p>
            Ошибка регистрации. Возможно, пароли не совпадают! <br /> <a href=\"http://localhost/register.htm\">Пройти регистрацию заново</a>
         </p>
               ";	

            }
         }
      }
      if($_POST['register'])
      {
         //Если пользователь уже нажал кнопку РЕГИСТРАЦИЯ, то зачем ему заново показывать форму?! 
      }
      else
      {
         //Если он уже кликнул, то мы не показываем форму, а выводим либо сообщение о подтверждении, либо об ошибке
         echo '
         <form method=\"post\">
            <p>
               Логин: <input type=\"text\" name=\"login\" />
            </p>
            <p>
               Пароль: <input type=\"password\" name=\"password\">
            </p>
            <p>
               Пароль еще раз: <input type=\"password\" name=\"second_password\" />
            </p>
            <p>
               E-mail: <input type=\"email\" name=\"e-mail\" />
            </p>
            <p>
               Ваше имя: <input type=\"text\" name=\"name\" />
            </p>
            <input type=\"submit\" name=\"register\" value=\"Зарегестрироваться\">
         </form>
         '; 
      }
   </script>

   </body>
</html>