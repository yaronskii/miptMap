<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link href="css/bootstrap.min.css" rel="stylesheet">
  <script src="http://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/js/bootstrap.min.js"></script>
  <title>form</title>
</head>
<body>
   <p>Здравствуйте, <?php echo htmlspecialchars($_POST['firstName']) . htmlspecialchars($_POST['secondName']);?>.
</p>
   <p>Вы работаете в сфере <?php echo htmlspecialchars($_POST['area']);?>.</p>
   <p>Вам <?php echo (int)$_POST['age']; ?> лет.</p>
   <?php
     $mysqli = new mysqli('localhost', 'root', '1', 'mybase');
     if (mysqli_connect_errno()) {
         echo "Подключение невозможно: ".mysqli_connect_error();
     }
     $mysqli->query('INSERT INTO mytable (name, email) VALUES ("MyName2", "myname2@mail.ru")');
     $result_set = $mysqli->query('SELECT * FROM mytable');
       while ($row = $result_set->fetch_assoc()) {
         print_r($row);
         echo "<br />";
       }
       $result_set->close();
     $mysqli->close();
   ?>
</body>
</html>