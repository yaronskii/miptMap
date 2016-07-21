<?php
if(isset($_POST['department']) ) {
	header("Content-type: text/txt; charset=UTF-8");	
	$mysqli = new mysqli('localhost', 'root', '1', 'miptMap');
     if (mysqli_connect_errno()) {
         echo "Подключение невозможно: ".mysqli_connect_error();
     }
     $mysqli->query("SET NAMES 'utf8'");
     $d = $_POST['department'];
     $n = $_POST['name'];
     //echo $d;
     $mysqli->query('INSERT INTO departments (department, name, post, loc, loc_phone, phone) VALUES ("'.$d.'" , "'.$n.'", "'.$_POST['post'].'", "'.$_POST['loc'].'", "'.$_POST['loc_phone'].'", "'.$_POST['phone'].'")');
    /*
     $result_set = $mysqli->query('SELECT * FROM departments');
       while ($row = $result_set->fetch_assoc()) {
         print_r($row);
         echo "<br />";
       }
       $result_set->close();
     */
     //$mysqli->query("SET NAMES 'cp1251';");
     $mysqli->close();

}
?>